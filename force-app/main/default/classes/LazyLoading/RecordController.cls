// RecordController.cls
public with sharing class RecordController {
    
    // Wrapper class para la respuesta
    public class RecordResponse {
        @AuraEnabled public List<RecordWrapper> records;
        @AuraEnabled public Boolean hasMore;
        @AuraEnabled public Integer totalCount;
    }
    
    // Wrapper para cada registro
    public class RecordWrapper {
        @AuraEnabled public String Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Description;
        @AuraEnabled public String recordUrl;
        @AuraEnabled public DateTime CreatedDate;
    }

    // Método principal para obtener registros con paginación
    @AuraEnabled(cacheable=true)
    public static RecordResponse getRecords(Integer pageSize, Integer offset) {
        try {
            // Validar parámetros
            if (pageSize == null || pageSize <= 0) {
                pageSize = 20;
            }
            if (offset == null || offset < 0) {
                offset = 0;
            }
            
        

            String query = 'SELECT Id, Name, Description, CreatedDate'+
                ' FROM Account'+
                ' WHERE Name != null'+
                ' ORDER BY CreatedDate asc';
            // Determinar si hay más registros
            Database.Cursor locator =  Database.getCursor(query);
            Integer totalRecords = locator.getNumRecords();
            Boolean hasMore = false;

            // Adjust pageSize if it exceeds available records
            if (offset + pageSize > totalRecords) {
                pageSize = Math.max(totalRecords - offset, 0);
            }

            // There are more records if after this page, offset+pageSize < totalRecords
            if (offset + pageSize < totalRecords) {
                hasMore = true;
            }

            List<Account> accounts = locator.fetch(offset, pageSize);
           
            
            // Convertir a wrapper
            List<RecordWrapper> recordWrappers = new List<RecordWrapper>();
            for (Account acc : accounts) {
                RecordWrapper wrapper = new RecordWrapper();
                wrapper.Id = acc.Id;
                wrapper.Name = acc.Name;
                wrapper.Description = acc.Description;
                wrapper.recordUrl = '/' + acc.Id;
                wrapper.CreatedDate = acc.CreatedDate;
                recordWrappers.add(wrapper);
            }
            
          
            
            RecordResponse response = new RecordResponse();
            response.records = recordWrappers;
            response.hasMore = hasMore;
            response.totalCount = totalRecords;
            
            return response;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error al obtener registros: ' + e.getMessage());
        }
    }
}