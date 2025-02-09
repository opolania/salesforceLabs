import { LightningElement, wire } from "lwc";

import getTenAccountList from "@salesforce/apex/MyAccountClass.getTenAccountList";

export default class GetWIredTenAccountList extends LightningElement {
  columns = [
    { label: "ID", fieldName: "Id", type: "text" },

    { label: "Name", fieldName: "Name", type: "text" }
  ];

  @wire(getTenAccountList) accounts;
}
