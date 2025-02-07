/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class testForceaTemplate {
    private static final String ERROR_MESSAGE = 'Error creating records';

    @isTest
    static void myUnitTest() {
        Test.startTest();
        Forceea.Template template = ForceeaTemplateGenerator.templateAccounts();
        template.insertRecords(true);
        Test.stopTest();

        // THEN the records are inserted successfully
        System.assert(insertionIsValid(Account.SObjectType), ERROR_MESSAGE);
        System.assert(insertionIsValid(Case.SObjectType), ERROR_MESSAGE);

        System.assertEquals(5, [Select id from Account].size());

    }
   

    private static String getQueryString(SObjectType sObjType) {
        return 'SELECT Id FROM ' + sObjType.getDescribe().name;
    }

    private static String getQueryStringForUser() {
        return 'SELECT Id FROM User WHERE LastName = \'User!$1234\'';
    }

    private static Boolean insertionIsValid(SObjectType sObjType) {
        return FObject.getInsertedRecords(sObjType).size() ==
            Database.query(getQueryString(sObjType)).size();
    }

    private static Boolean insertionIsValid(SObjectType sObjType, String groupName) {
        return FObject.getInsertedGroupRecords(sObjType, groupName).size() ==
            Database.query(getQueryString(sObjType)).size();
    }
}