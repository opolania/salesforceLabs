public with sharing class MyAccountClass {
  public MyAccountClass() {
  }

  @AuraEnabled(cacheable=true)
  public static List<Account> getTenAccountList() {
    List<account> accountList = [
      SELECT Id, Name, Phone, Industry, BillingState, BillingCountry, ShippingPostalCode, ShippingCountry
      FROM Account
      ORDER BY Name
      LIMIT 10
    ];

    return accountList;
  }

  @AuraEnabled
  public static List<Account> getAccountListByCountry(string strCountry) {
    List<account> accountList = [
      SELECT Id, Name, Phone, Industry, BillingState, BillingCountry, ShippingPostalCode, ShippingCountry
      FROM Account
      WHERE ShippingCountry = :strCountry
    ];

    return accountList;
  }
}