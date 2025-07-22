// productSelectorWithScreenFlow.js
import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import { refreshApex } from '@salesforce/apex';
import getProductsByName from '@salesforce/apex/ProductController.getProductsByName';
import createSampleProducts from '@salesforce/apex/ProductController.createSampleProducts';

export default class ProductSelectorWithScreenFlow extends LightningElement {
    // 📥 INPUT PARAMETERS (Flow → LWC)
    @api searchTerm = '';
    @api flowMessage = '';
    @api maxSelections = 5;
    @api allowMultipleSelection = false;
    @api recordId;
    @api defaultProductIds = ''; // IDs separados por coma para pre-selección
    
    // 📤 OUTPUT PARAMETERS (LWC → Flow)
    @api selectedProducts = ''; // JSON string de productos seleccionados
    @api selectedProductIds = ''; // IDs separados por coma
    @api selectedProductNames = ''; // Nombres separados por coma
    @api totalSelectedCount = 0;
    @api selectionCompleted = false;
    @api userActionResult = '';
    @api selectionSummary = ''; // Resumen detallado de la selección
    
    // Propiedades internas
    products = [];
    error;
    isCreatingSamples = false;
    wiredProductsResult;
    selectedProductsInternal = new Set(); // Para tracking interno
    hasValidatedSystem = false;
    


    // Wire method que se ejecuta automáticamente cuando searchTerm cambia
    @wire(getProductsByName, { searchTerm: '$searchTerm' })
    async wiredProducts(result) {
        this.wiredProductsResult = result;
        const { error, data } = result;
        
        if (data) {
            this.products = data.map(product => ({
                ...product,
                isSelected: this.selectedProductsInternal.has(product.Id)
            }));
            this.error = undefined;
            console.log('✅ Productos cargados via @wire:', data.length);
            
            // Validación del sistema solo en carga inicial
            if (!this.searchTerm && !this.hasValidatedSystem) {
                await this.validateSystemInWire(data);
            }
            
            // Pre-seleccionar productos si se especificaron IDs por defecto
            this.preselectDefaultProducts();
            
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

    // 🎯 MÉTODOS DE SELECCIÓN PARA FLOW 🎯

    // Manejar selección/deselección de productos
    handleProductSelection(event) {
        const productId = event.currentTarget.dataset.productId;
        const productName = event.currentTarget.dataset.productName;
        
        if (this.selectedProductsInternal.has(productId)) {
            // Deseleccionar producto
            this.selectedProductsInternal.delete(productId);
            console.log('❌ Producto deseleccionado:', productName);
            this.showToast('Info', `${productName} deseleccionado`, 'info');
        } else {
            // Verificar límite de selecciones
            if (this.selectedProductsInternal.size >= this.maxSelections) {
                this.showToast('Advertencia', `Máximo ${this.maxSelections} productos permitidos`, 'warning');
                return;
            }
            
            // Si no permite múltiples selecciones, limpiar selección previa
            if (!this.allowMultipleSelection) {
                this.selectedProductsInternal.clear();
            }
            
            // Seleccionar producto
            this.selectedProductsInternal.add(productId);
            console.log('✅ Producto seleccionado:', productName);
            this.showToast('Éxito', `${productName} seleccionado`, 'success');
        }
        
        // Actualizar productos seleccionados y enviar a Flow
        this.updateSelectedProducts();
    }

    // Pre-seleccionar productos basado en defaultProductIds
    preselectDefaultProducts() {
        if (this.defaultProductIds && this.products.length > 0) {
            const defaultIds = this.defaultProductIds.split(',').map(id => id.trim());
            defaultIds.forEach(id => {
                const product = this.products.find(p => p.Id === id);
                if (product && this.selectedProductsInternal.size < this.maxSelections) {
                    this.selectedProductsInternal.add(id);
                }
            });
            
            if (this.selectedProductsInternal.size > 0) {
                this.updateSelectedProducts();
                console.log('🎯 Productos pre-seleccionados:', this.selectedProductsInternal.size);
            }
        }
    }

    // Actualizar y enviar productos seleccionados al Flow
    updateSelectedProducts() {
        // Obtener productos seleccionados con detalles completos
        const selectedProductsArray = this.products.filter(product => 
            this.selectedProductsInternal.has(product.Id)
        );
        
        // ✅ Actualizar flag de selección en todos los productos
        this.products = this.products.map(product => ({
            ...product,
            isSelected: this.selectedProductsInternal.has(product.Id)
        }));
        
        // Combinar ambas listas sin duplicados
        const allSelected = [...selectedProductsArray];
                
        // Preparar datos para el Flow
        const productDetails = allSelected.map(product => ({
            Id: product.Id,
            Name: product.Name,
            ProductCode: product.ProductCode,
            Family: product.Family,
            Description: product.Description,
            isActive: product.IsActive
        }));
        
        this.selectedProducts = JSON.stringify(productDetails);
        this.selectedProductIds = allSelected.map(p => p.Id).join(',');
        this.selectedProductNames = allSelected.map(p => p.Name).join(', ');
        this.totalSelectedCount = allSelected.length;
        
        // Crear resumen detallado
        this.selectionSummary = this.createSelectionSummary(productDetails);
        
        // 🔄 Enviar cambios inmediatamente al Flow
        this.sendSelectionToFlow();
        
        console.log('🔄 Selección actualizada:', {
            count: this.totalSelectedCount,
            products: this.selectedProductNames
        });
    }

    // Crear resumen detallado de la selección
    createSelectionSummary(productDetails) {
        if (productDetails.length === 0) {
            return 'No se han seleccionado productos';
        }
        
        const summary = {
            totalCount: productDetails.length,
            maxAllowed: this.maxSelections,
            products: productDetails,
            families: [...new Set(productDetails.map(p => p.Family).filter(f => f))],
            timestamp: new Date().toISOString(),
            context: {
                recordId: this.recordId,
                searchTerm: this.searchTerm,
                multipleSelection: this.allowMultipleSelection
            }
        };
        
        return JSON.stringify(summary);
    }

    // Enviar selección actual al Flow
    sendSelectionToFlow() {
        const events = [
            new FlowAttributeChangeEvent('selectedProducts', this.selectedProducts),
            new FlowAttributeChangeEvent('selectedProductIds', this.selectedProductIds),
            new FlowAttributeChangeEvent('selectedProductNames', this.selectedProductNames),
            new FlowAttributeChangeEvent('totalSelectedCount', this.totalSelectedCount),
            new FlowAttributeChangeEvent('selectionSummary', this.selectionSummary)
        ];
        
       events.forEach(event => this.dispatchEvent(event));
    }

    // Completar selección y continuar Flow
    handleCompleteSelection() {
        if (this.totalSelectedCount === 0) {
            this.showToast('Advertencia', 'Selecciona al menos un producto para continuar', 'warning');
            return;
        }
        
        this.selectionCompleted = true;
        this.userActionResult = `Selección completada: ${this.totalSelectedCount} productos elegidos - ${this.selectedProductNames}`;
        
        // Enviar resultado final al Flow
        const finalEvents = [
            new FlowAttributeChangeEvent('selectionCompleted', true),
            new FlowAttributeChangeEvent('userActionResult', this.userActionResult)
        ];
        
        finalEvents.forEach(event => this.dispatchEvent(event));
        
        this.showToast('Éxito', 'Selección completada! 🎉 Continuando Flow...', 'success');
        
        // Navegar al siguiente paso del Flow
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
        
        console.log('✅ Selección enviada al Flow:', {
            totalCount: this.totalSelectedCount,
            productIds: this.selectedProductIds,
            summary: this.selectionSummary
        });
    }

    // Cancelar y continuar Flow sin selección
    handleCancelSelection() {
        this.selectedProductsInternal.clear();
        this.selectionCompleted = false;
        this.userActionResult = 'Usuario canceló la selección de productos';
        this.totalSelectedCount = 0;
        this.selectedProducts = '[]';
        this.selectedProductIds = '';
        this.selectedProductNames = '';
        this.selectionSummary = JSON.stringify({ cancelled: true, timestamp: new Date().toISOString() });
        
        // Enviar cancelación al Flow
        const cancelEvents = [
            new FlowAttributeChangeEvent('selectionCompleted', false),
            new FlowAttributeChangeEvent('userActionResult', this.userActionResult),
            new FlowAttributeChangeEvent('totalSelectedCount', 0),
            new FlowAttributeChangeEvent('selectedProducts', '[]'),
            new FlowAttributeChangeEvent('selectionSummary', this.selectionSummary)
        ];
        
        cancelEvents.forEach(event => this.dispatchEvent(event));
        
        this.showToast('Info', 'Selección cancelada. Continuando Flow...', 'info');
        
        // Continuar Flow
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
        
        console.log('❌ Selección cancelada');
    }

    // Limpiar selección actual
    handleClearSelection() {
        this.selectedProductsInternal.clear();
        this.updateSelectedProducts();
        this.showToast('Info', 'Selección limpiada', 'info');
    }

    // 🎯 BÚSQUEDA Y GESTIÓN DE PRODUCTOS 🎯

    handleSearch(event) {
        this.searchTerm = event.target.value;
        console.log('🔍 Búsqueda reactiva:', this.searchTerm);
    }

    handleClear() {
        this.searchTerm = '';
        console.log('🧹 Limpiando búsqueda reactiva');
    }

   

   

    async handleCreateSamples() {
        this.isCreatingSamples = true;
        
        try {
            const result = await createSampleProducts();
            await refreshApex(this.wiredProductsResult);
            this.showToast('Éxito', result + ' 🎉', 'success');
        } catch (error) {
            this.showToast('Error', 'Error creando productos: ' + error.body?.message, 'error');
        } finally {
            this.isCreatingSamples = false;
        }
    }

    // Validación automática del sistema
    async validateSystemInWire(products) {
        this.hasValidatedSystem = true;
        
        if (!products || products.length === 0) {
            try {
                const allSystemProducts = await getProductsByName({ searchTerm: '' });
                
                if (!allSystemProducts || allSystemProducts.length === 0) {
                    console.log('🚨 Sistema sin productos - Creando automáticamente...');
                    this.showToast('Info', 'Sistema sin productos. Creando datos de muestra...', 'info');
                    await this.handleCreateSamples();
                }
            } catch (error) {
                console.error('❌ Error en validación del sistema:', error);
            }
        }
    }

    // 🎯 GETTERS PARA UI 🎯

    get hasProducts() {
        return this.products && this.products.length > 0;
    }

   

    get searchSummary() {
        if (!this.searchTerm) {
            return 'Mostrando todos los productos activos';
        }
        return `Resultados reactivos para "${this.searchTerm}"`;
    }

    get productCountMessage() {
        const count = this.products ? this.products.length : 0;
        return `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }


    get selectionMessage() {
        if (this.totalSelectedCount === 0) {
            return `Selecciona productos (máximo ${this.maxSelections})`;
        }
        return `${this.totalSelectedCount} de ${this.maxSelections} productos seleccionados`;
    }

    get canSelectMore() {
        return this.totalSelectedCount < this.maxSelections;
    }

    get hasSelection() {
        return this.totalSelectedCount > 0;
    }

    // Verificar si un producto está seleccionado
    isProductSelected(productId) {
        return this.selectedProductsInternal.has(productId);
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
        console.log('🚀 ProductSelectorWithScreenFlow conectado');
        console.log('📥 Parámetros del Flow recibidos:', {
            flowMessage: this.flowMessage,
            maxSelections: this.maxSelections,
            allowMultipleSelection: this.allowMultipleSelection,
            recordId: this.recordId,
            searchTerm: this.searchTerm,
            defaultProductIds: this.defaultProductIds
        });
    }

    errorCallback(error, stack) {
        console.error('💥 Error en el componente:', error, stack);
        this.showToast('Error', 'Error inesperado en el componente', 'error');
    }

    get istheSameSelected() {
        return this.selectedId === this.productId;
    }

   get hasNoSelection() {
    return !this.hasSelection;
}
}