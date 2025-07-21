// productSearch.js
import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex'; // ← AGREGAR ESTA LÍNEA
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductsByName from '@salesforce/apex/ProductController.getProductsByName';
import createSampleProducts from '@salesforce/apex/ProductController.createSampleProducts';
import deleteAllProducts from '@salesforce/apex/ProductController.deleteAllProducts';
export default class ProductSearch extends LightningElement {
    // Propiedad configurable desde Lightning App Builder
    @api searchTerm = '';
    
    // Propiedades internas
    products = [];
    error;
    wiredProductsResult;
    isCreatingSamples;
    // Wire method que se ejecuta automáticamente cuando searchTerm cambia
    @wire(getProductsByName, { searchTerm: '$searchTerm' })
    wiredProducts(result) { // ← Recibir el result completo
        // Guardar la referencia para refreshApex
        this.wiredProductsResult = result;
        
        // Destructurar dentro del método
        const { error, data } = result;
        
        if (data) {
            this.products = data;
            this.error = undefined;
            console.log('✅ Productos cargados:', data.length);
            
            if (this.searchTerm) {
                this.showToast('Éxito', `Se encontraron ${data.length} productos`, 'success');
            }
        } else if (error) {
            this.error = error;
            this.products = [];
            console.error('❌ Error en wire method:', error);
            this.showToast('Error', 'Error al cargar productos: ' + error.body?.message, 'error');
        }
    }

    // 🎯 EVENT HANDLERS 🎯

    // Handler del input de búsqueda - ¡Aquí ocurre la magia reactiva!
    handleSearch(event) {
        const newSearchTerm = event.target.value;
        console.log('🔍 Usuario escribió:', newSearchTerm);
        
        // ¡Esta línea dispara AUTOMÁTICAMENTE el @wire method!
        this.searchTerm = newSearchTerm;
        
        console.log('⚡ @wire method se ejecutará automáticamente...');
    }

    // Limpiar búsqueda
    handleClear() {
        console.log('🧹 Limpiando búsqueda');
        this.searchTerm = ''; // Esto también dispara el @wire method
    }

    // 🎯 GETTERS REACTIVOS 🎯

    get hasProducts() {
        return this.products && this.products.length > 0;
    }

    get searchSummary() {
        if (!this.searchTerm) {
            return 'Mostrando todos los productos activos';
        }
        return `Resultados para "${this.searchTerm}"`;
    }

    get productCountMessage() {
        const count = this.products ? this.products.length : 0;
        return `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }

    // Crear productos de muestra manualmente
   
    async handleDeleteAll() {
        await this.deleteAllProductsMethod();
    }

    async deleteAllProductsMethod() {
        try {
            await deleteAllProducts();
            await refreshApex(this.wiredProductsResult);
           
            this.showToast('Éxito borrando',  ' 🎉', 'success');
        }catch (error) {
            console.error('❌ Error ELIMINANDO productos:', error);
            this.showToast('Error', 'Error creando productos: ' + error.body?.message, 'error');
        } finally {
            this.isCreatingSamples = false;
        }
    }

    async handleCreateSamples() {
        this.isCreatingSamples = true;
        await this.createSampleProductsMethod();
    }
    
    // Método reutilizable para crear productos
    async createSampleProductsMethod() {
        
        try {
            console.log('🔨 Iniciando creación de productos de muestra...');
            const result = await createSampleProducts();
            console.log('✅ Productos creados exitosamente:', result);
            await refreshApex(this.wiredProductsResult);
            this.showToast('Éxito', result + ' 🎉', 'success');
            
            // Los @wire methods se refrescarán automáticamente
            console.log('🔄 Los datos se refrescarán automáticamente via @wire');
            
        } catch (error) {
            console.error('❌ Error creando productos:', error);
            this.showToast('Error', 'Error creando productos: ' + error.body?.message, 'error');
        } finally {
           
        }
    }
    // 🎯 MÉTODOS AUXILIARES 🎯

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
            duration: 3000
        });
        this.dispatchEvent(event);
    }

    // 🎯 LIFECYCLE HOOKS 🎯

    connectedCallback() {
        console.log('🚀 Componente conectado');
        console.log('⚡ El @wire method se ejecutará automáticamente con searchTerm inicial:', this.searchTerm);
    }

    errorCallback(error, stack) {
        console.error('💥 Error en el componente:', error, stack);
        this.showToast('Error', 'Error inesperado en el componente', 'error');
    }
}