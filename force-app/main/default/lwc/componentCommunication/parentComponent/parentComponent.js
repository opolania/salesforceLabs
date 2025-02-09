import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    handleParentClick(event) {
        alert('Parent received event: ' + event.detail.message); // Display the message from the child
        //event.stopPropagation(); // Prevents the event from bubbling up to the grandparent
    }
}