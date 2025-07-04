import { LightningElement, wire, track, api } from "lwc";

import getTenAccountList from "@salesforce/apex/MyAccountClass.getTenAccountList";

export default class GetWiredMethod extends LightningElement {
  @track accounts;

  error;

  columns = [
    { label: "ID", fieldName: "Id", type: "text" },

    { label: "Name", fieldName: "Name", type: "text" },
    { label: "ShippingCountry", fieldName: "ShippingCountry", type: "text" }
  ];

  @wire(getTenAccountList)
  wiredaccountsmethod({ data, error }) {
    if (data) {
      this.accounts = data;
    } else if (error) {
      this.error = error;
    }
  }
}
