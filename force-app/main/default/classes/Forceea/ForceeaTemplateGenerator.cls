public class ForceeaTemplateGenerator {

    public static Forceea.Template templateAccounts() {
        return new Forceea.Template()
            .add('Accounts', new FObject(Account.SObjectType, 5000)
                .setGroupName('GroupAccounts')
                .setDefinition(Account.Industry, 'random type(picklist)')
                .setDefinition(Account.Name, 'static value(Company-)')
                .setDefinition(Account.Name, 'serial type(number) from(8001) step(1) scale(0)')
                .setDefinition(Account.ShippingStreet, 'copy field(BillingStreet)')
                .setDefinition(Account.ShippingPostalCode, 'copy field(BillingPostalCode)')
                .setDefinition(Account.ShippingCity, 'copy field(BillingCity)')
                .setDefinition(Account.ShippingState, 'copy field(BillingState)')
                .setDefinition(Account.ShippingCountry, 'copy field(BillingCountry)')
                .setDefinition(Account.Website, 'random type(url)')
            );
    }

    public static Forceea.Template templateContacts() {
        return new Forceea.Template()
            .add('Contacts', new FObject(Contact.SObjectType, 5000)
                .setDefinition(Contact.FirstName, 'random type(firstName) group(mailing)')
                .setDefinition(Contact.LastName, 'random type(lastName) group(mailing)')
                .setDefinition(Contact.Email, 'copy field(firstName)')
                .setDefinition(Contact.Email, 'copy field(lastName)')
                .setDefinition(Contact.Email, 'static value(@gmail.com)')
                .setDefinition(Contact.MailingStreet, 'random type(street) group(Mailing)')
                .setDefinition(Contact.MailingPostalCode, 'random type(postalCode) group(Mailing)')
                .setDefinition(Contact.MailingCity, 'random type(city) group(Mailing)')
                .setDefinition(Contact.MailingState, 'random type(state) group(Mailing)')
                .setDefinition(Contact.MailingCountry, 'random type(country) group(Mailing)')
                .setDefinition(Contact.AccountId,
                    'random lookup(Account)   source(salesforce)')
                 .setVerbose('debug')
            );
    }

    public static Forceea.Template templateOpportunities() {
        return new Forceea.Template()
            .add('Opportunities', new FObject(Opportunity.SObjectType, 25)  // 5 Opportunities per Contact
                .setGroupName('GroupOpportunities')
                .setDefinition(Opportunity.AccountId, 'parent(Contact)')
                .setDefinition(Opportunity.Name, 'static value(Opportunity-)')
                .setDefinition(Opportunity.Name, 'serial type(number) from(1) step(1) scale(0)')
                .setDefinition(Opportunity.StageName, 'random type(picklist)')
                .setDefinition(Opportunity.CloseDate, 'random type(date) from(2025-01-01) to(2025-12-31)')
                .setDefinition(Opportunity.Amount, 'random type(number) from(5000) to(50000) scale(2)')
            );
    }

    public static void generateAndCommitTemplates() {
        // Generate templates
        Forceea.Template accountTemplate = templateAccounts();
        Forceea.Template contactTemplate = templateContacts();
        Forceea.Template opportunityTemplate = templateOpportunities();

        // Commit each template
      
        System.debug('All templates committed successfully!');
    }
}
