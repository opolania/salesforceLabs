import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {
    @api greeting; // Public property to receive data from parent

    dispatchCustomEvent() {
        const customEvent = new CustomEvent('customevent', {
            bubbles: true,     // Allows the event to bubble up the DOM
            composed: true,    // Allows crossing the shadow DOM boundary
            detail: { message: 'Hello from Child Component!' } // Event detail
        });
        this.dispatchEvent(customEvent); // Dispatches the custom event
        console.log('event from child dispatch');
    }
}