// recordList.js - Componente con lazy loading
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getRecords from '@salesforce/apex/RecordController.getRecords';

export default class RecordList extends LightningElement {
     records = [];
     isLoading = false;
     hasMore = true;
    
    // Parámetros para paginación
    pageSize = 2000;
    offset = 0;
    
    // Variable para el wire
    wiredRecordsResult;

    connectedCallback() {
        this.loadInitialRecords();
    }

    // Cargar registros iniciales
    async loadInitialRecords() {
        this.isLoading = true;
        try {
            
            const result = await getRecords({
                pageSize: this.pageSize,
                offset: this.offset
            });
            
            this.records = result.records;
            this.hasMore = result.hasMore;
            this.offset += this.pageSize;
        } catch (error) {
            console.error('Error cargando registros:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Cargar más registros (lazy loading)
    async loadMoreRecords() {
        if (this.isLoading || !this.hasMore) return;
        
        this.isLoading = true;
        try {
            const result = await getRecords({
                pageSize: this.pageSize,
                offset: this.offset
            });
            
            // Agregar nuevos registros a la lista existente
            this.records = [...this.records, ...result.records];
            this.hasMore = result.hasMore;
            this.offset += this.pageSize;
        } catch (error) {
            console.error('Error cargando más registros:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Detectar scroll para lazy loading automático
    handleScroll(event) {
        const target = event.target;
        const buffer = 100; // píxeles antes del final
        
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - buffer) {
            this.loadMoreRecords();
        }
    }

    // Método para refrescar todos los datos
    async refreshData() {
        this.offset = 0;
        this.hasMore = true;
        await this.loadInitialRecords();
    }
}