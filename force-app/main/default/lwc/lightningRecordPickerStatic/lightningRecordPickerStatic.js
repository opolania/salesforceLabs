import { LightningElement } from 'lwc';

export default class LightningRecordPickerStatic extends LightningElement {
    selectedRecordId = '';

    matchingInfo = {
        primaryField: { fieldPath: "Name" },
        additionalFields: [{ fieldPath: "ProductCode" }],
    };
    displayInfo = {
        additionalFields: ["Description"],
    };
/*
    filter = {
        criteria: [
            {
                fieldPath: "Name",
                operator: "like",
                value: "A%",
            },
        ],
    };
    */
    
    handleChange(event) {
        this.selectedRecordId = event.detail.recordId;
        console.log("🚀 ~ this.selectedRecordId:", this.selectedRecordId);
    }
}