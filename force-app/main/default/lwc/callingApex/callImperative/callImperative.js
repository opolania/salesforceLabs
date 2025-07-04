import { LightningElement, track } from "lwc";

import getAccountListByCountry from "@salesforce/apex/MyAccountClass.getAccountListByCountry";

export default class CallImperative extends LightningElement {
  strc;

  @track accounts;

  @track errorMsg;

  columns = [
    { label: "ID", fieldName: "Id", type: "text" },

    { label: "Name", fieldName: "Name", type: "text" }
  ];

  getAccountsData(event) {
    this.strc = this.template.querySelector('[data-id="shippingCountryInput"]').value;
    console.log("shipping country:" + this.strc);
    getAccountListByCountry({ strCountry: this.strc })
      .then((result) => {
        this.accounts = result;
      })

      .catch((error) => {
        this.errorMsg = error.body.message;
      });
  }
}
