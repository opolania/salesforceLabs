import { LightningElement, api } from "lwc";
export default class Car extends LightningElement {
  @api brand = "Q3";
  @api model = "Accord";
  @api year = 1981;
  get titleomar() {
    return this.brand + " " + this.model + " " + this.year;
  }

  constructor(brand, model, year) {
    super();
    console.log("Car constructor");
  }

  connectedCallback() {
    console.log("Car connectedCallback");
  }

  renderedCallback() {
    console.log("Car renderedCallback");
  }

  disconnectedCallback() {
    console.log("Car disconnectedCallback");
  }
}
