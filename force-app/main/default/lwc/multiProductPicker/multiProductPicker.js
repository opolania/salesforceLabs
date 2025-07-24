import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// ✅ Query como constante - FUERA de la clase
const SEARCH_PRODUCT_QUERY = gql`
    query searchProductById($selectedRecordId: ID) {
        uiapi {
            query {
                Product2(
                    where: { Id: { eq: $selectedRecordId } }
                    first: 1
                ) {
                    edges {
                        node {
                            Id
                            Name {
                                value
                            }
                            Description {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default class MultiProductPicker extends LightningElement {
    items = [];
    selectedRecordId = '';

    get variables() {
        return {
            selectedRecordId: this.selectedRecordId
        };
    }

    handleRecordSelection(event) {
        this.selectedRecordId = event.detail.recordId;
    }

    get hasItems() {
        return this.items.length > 0;
    }

    @wire(graphql, {
        query: SEARCH_PRODUCT_QUERY,
        variables: '$variables'
    })
    wiredGraphQL({ data, errors }) {
        this.selectedRecordId = null;
        if (errors || !data || (data && data?.uiapi?.query?.Product2?.edges?.length < 1)) {
            return;
        }
        const graphqlResults = data.uiapi.query.Product2.edges.map((edge) => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value,
            Description: edge.node.Description.value
        }));

        const productsData = graphqlResults?.[0];
        // Check if the account is already in the list
        if (!this.items.some(item => item.name === productsData.Id)) {
            this.items = [
                ...this.items,
                {
                    label: productsData.Name,
                    name: productsData.Id
                }
            ];
        }

        const recordPicker = this.template.querySelector('lightning-record-picker');

        if (recordPicker) {
            recordPicker.clearSelection();
        }
    }

    handleItemRemove(event) {
        const itemName = event.detail.item.name;

        // Remove the item using filter to create a new array and trigger reactivity
        this.items = this.items.filter(item => item.name !== itemName);
    }

    handleSave() {
        console.log('items seleccionados:' + this.items.length);
        if (this.items.length === 0) {
            this.showToast('No Products', 'Please select at least one product to save', 'warning');
            return;
        }

       
      

        this.showToast('Saved Successfully', `${this.items.length} products saved to your list`, 'success');
          // Limpiar la selección actual
        this.items = [];
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

    get hasSavedProducts() {
        return this.items.length > 0;
    }
    get isEmpty() {
        return this.items.length === 0;
    }
    
    handleClearAll() {
        this.items = [];
    }
}