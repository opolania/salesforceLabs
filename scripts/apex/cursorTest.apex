  String query = 'SELECT Id, Name, Description, CreatedDate' +
                ' FROM Account'+
                ' WHERE Name != null'+
                ' ORDER BY CreatedDate DESC';         
Database.Cursor cursor = Database.getCursor(query);
System.debug('size:'+cursor.getNumRecords());
 List<Account> accounts = cursor.fetch(8000, 3);
 System.debug('accounts size:'+accounts.size());