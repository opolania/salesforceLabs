import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';

export default class ContactQuickActionSimple extends NavigationMixin(LightningElement) {
    
    // API properties disponibles en Quick Actions
    @api recordId; // Account ID si se ejecuta desde Account
    @api objectApiName; // 'Account' si se ejecuta desde Account
    
    // Estados del componente
    @track isLoading = false;
    
    // Datos del formulario - Solo 5 campos
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track accountId = '';
    
    /**
     * Se ejecuta cuando el componente se conecta al DOM
     */
    connectedCallback() {
        console.log('🔍 Contact Quick Action Simple: Component connected');
        console.log('🔍 Context - Record ID:', this.recordId, 'Object:', this.objectApiName);
        
        // Si se ejecuta desde Account, pre-poblar Account ID
        if (this.objectApiName === 'Account' && this.recordId) {
            this.accountId = this.recordId;
            console.log('✅ Pre-populated Account ID:', this.accountId);
        }
    }
    
    /**
     * Maneja cambios en los campos del formulario
     */
    handleInputChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;
        
        console.log('🔍 Field changed:', field, 'Value:', value);
        
        switch(field) {
            case 'firstName':
                this.firstName = value;
                break;
            case 'lastName':
                this.lastName = value;
                break;
            case 'email':
                this.email = value;
                break;
            case 'phone':
                this.phone = value;
                break;
            case 'accountId':
                this.accountId = value;
                break;
            default:
                console.warn('Campo no reconocido:', field);
        }
    }
    
    /**
     * Maneja cambios en el lookup de Account
     */
    handleAccountChange(event) {
        console.log('🔍 Account change event:', event);
        console.log('🔍 Event target value:', event.target.value);
        
        // Para lightning-input-field, el value está en event.target.value
        this.accountId = event.target.value;
        console.log('✅ Account ID set to:', this.accountId);
    }
    
    /**
     * Valida el formulario antes de enviar
     */
    validateForm() {
        // Validar campo requerido - Last Name
        if (!this.lastName || this.lastName.trim() === '') {
            this.showToast('Error', 'El apellido es requerido', 'error');
            return false;
        }
        
        // Validar email si está presente
        if (this.email && !this.isValidEmail(this.email)) {
            this.showToast('Error', 'El formato del email no es válido', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Maneja la creación del contacto
     */
    async handleSave() {
        if (!this.validateForm()) {
            return;
        }
        
        this.isLoading = true;
        
        try {
            // Preparar campos para creación - Solo 5 campos
            const fields = {};
            
            // Campo requerido
            fields[LASTNAME_FIELD.fieldApiName] = this.lastName.trim();
            
            // Campos opcionales
            if (this.firstName) {
                fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName.trim();
            }
            
            if (this.email) {
                fields[EMAIL_FIELD.fieldApiName] = this.email.trim();
            }
            
            if (this.phone) {
                fields[PHONE_FIELD.fieldApiName] = this.phone.trim();
            }
            
            if (this.accountId) {
                fields[ACCOUNT_FIELD.fieldApiName] = this.accountId;
            }
            
            console.log('🔍 Creating contact with fields:', fields);
            
            // Crear registro usando LDS
            const recordInput = { 
                apiName: CONTACT_OBJECT.objectApiName, 
                fields 
            };
            
            const result = await createRecord(recordInput);
            
            console.log('✅ Contact created successfully:', result.id);
            
            // Mostrar éxito
            this.showToast('Éxito', 'Contacto creado exitosamente', 'success');
            
            // Cerrar modal
            this.closeAction();
            
            // Navegar al registro nuevo
            this.navigateToRecord(result.id);
            
        } catch (error) {
            console.error('❌ Error creating contact:', error);
            this.showToast('Error', this.getErrorMessage(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Maneja el botón Save & New
     */
    async handleSaveAndNew() {
        if (!this.validateForm()) {
            return;
        }
        
        this.isLoading = true;
        
        try {
            // Preparar campos para creación
            const fields = {};
            
            // Campo requerido
            fields[LASTNAME_FIELD.fieldApiName] = this.lastName.trim();
            
            // Campos opcionales
            if (this.firstName) {
                fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName.trim();
            }
            
            if (this.email) {
                fields[EMAIL_FIELD.fieldApiName] = this.email.trim();
            }
            
            if (this.phone) {
                fields[PHONE_FIELD.fieldApiName] = this.phone.trim();
            }
            
            if (this.accountId) {
                fields[ACCOUNT_FIELD.fieldApiName] = this.accountId;
            }
            
            // Crear registro
            const recordInput = { 
                apiName: CONTACT_OBJECT.objectApiName, 
                fields 
            };
            
            await createRecord(recordInput);
            
            // Mostrar éxito
            this.showToast('Éxito', 'Contacto creado exitosamente', 'success');
            
            // Limpiar formulario para nuevo contacto (mantener Account ID)
            this.resetForm();
            
        } catch (error) {
            console.error('❌ Error creating contact:', error);
            this.showToast('Error', this.getErrorMessage(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Cancela y cierra el modal
     */
    handleCancel() {
        console.log('🔒 Cancel button clicked');
        
        try {
            // Intentar dispatch de evento al Aura wrapper
            this.dispatchEvent(new CustomEvent('cancel', {
                bubbles: true,
                composed: true
            }));
            console.log('✅ Cancel event dispatched');
        } catch(e) {
            console.error('❌ Event dispatch failed:', e);
        }
        
        // Intentar navegación directa como fallback
        setTimeout(() => {
            console.log('🔄 Attempting navigation fallback...');
            this.closeAction();
        }, 100);
    }
    
    /**
     * Cierra el modal navegando de vuelta al ListView
     */
    closeAction() {
        console.log('🔄 Closing action - navigating to Contact ListView');
        
        // Para Aura wrapper, navegar directamente al ListView
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        });
    }
    
    /**
     * Resetea el formulario
     */
    resetForm() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        
        // Mantener accountId si estamos en contexto de Account
        if (this.objectApiName !== 'Account') {
            this.accountId = '';
        }
        
        console.log('🔄 Form reset - Account ID preserved:', this.accountId);
    }
    
    /**
     * Navega al registro creado
     */
    navigateToRecord(recordId) {
        console.log('🔄 Navigating to contact record:', recordId);
        
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }
    
    /**
     * Muestra toast messages
     */
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
    
    /**
     * Extrae mensaje de error legible
     */
    getErrorMessage(error) {
        if (error.body && error.body.message) {
            return error.body.message;
        } else if (error.body && error.body.fieldErrors) {
            const fieldErrors = Object.values(error.body.fieldErrors).flat();
            return fieldErrors.length > 0 ? fieldErrors[0].message : 'Error desconocido';
        } else if (error.message) {
            return error.message;
        }
        return 'Ha ocurrido un error inesperado';
    }
    
    /**
     * Getters para template
     */
    get saveButtonLabel() {
        return this.isLoading ? 'Guardando...' : 'Guardar';
    }
    
    get saveNewButtonLabel() {
        return this.isLoading ? 'Guardando...' : 'Guardar y Nuevo';
    }
}