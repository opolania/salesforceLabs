public with sharing class calculateAccountTotalHelper {
    
    public static void updateAccountTotals(Set<Id> opportunityIds) {
        // Query opportunities with their line items and account information
        List<Opportunity> opportunities = [
            SELECT Id, AccountId, Account.Total__c, StageName,
                (SELECT Id, Quantity FROM OpportunityLineItems)
            FROM Opportunity
            WHERE Id IN :opportunityIds
            AND AccountId != null
        ];
        
        // Map to store account totals
        Map<Id, Decimal> accountTotals = new Map<Id, Decimal>();
        
        // Calculate totals for each account based on Closed Won opportunities
        for(Opportunity opp : opportunities) {
            if(opp.StageName == 'Closed Won') {
                Decimal itemCount = 0;
                
                // Sum up quantities from line items
                for(OpportunityLineItem oli : opp.OpportunityLineItems) {
                    itemCount += oli.Quantity;
                }
                
                // Add to account total
                if(accountTotals.containsKey(opp.AccountId)) {
                    accountTotals.put(opp.AccountId, accountTotals.get(opp.AccountId) + itemCount);
                } else {
                    accountTotals.put(opp.AccountId, itemCount);
                }
            }
        }
        
        // Prepare accounts for update
        List<Account> accountsToUpdate = new List<Account>();
        for(Id accountId : accountTotals.keySet()) {
            accountsToUpdate.add(new Account(
                Id = accountId,
                Total__c = accountTotals.get(accountId)
            ));
        }
        
        // Update accounts if there are any changes
        if(!accountsToUpdate.isEmpty()) {
            try {
                update accountsToUpdate;
            } catch(Exception e) {
                System.debug('Error updating account totals: ' + e.getMessage());
                throw e;
            }
        }
    }
}