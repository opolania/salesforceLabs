import { LightningElement } from 'lwc';

export default class GrandparentComponent extends LightningElement {
    handleGrandparentClick(event) {
        if (event.detail) {
            alert('Grandparent received event: ' + event.detail.message);
        }
    }
}