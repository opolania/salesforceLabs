// ProductController.cls
public with sharing class ProductController {
    
    // Método cacheable para @wire - DEBE ser estático
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductsByName(String searchTerm) {
        System.debug('🔍 Ejecutando búsqueda para: ' + searchTerm);
        
        // Si no hay término de búsqueda, devolver todos los productos
        if (String.isBlank(searchTerm)) {
            return [
                SELECT Id, Name, ProductCode, Description, Family, IsActive
                FROM Product2 
                WHERE IsActive = true 
                ORDER BY Name 
                LIMIT 50
            ];
        }
        
        // Buscar productos que coincidan con el término
        String searchPattern = '%' + searchTerm.trim() + '%';
        
        return [
            SELECT Id, Name, ProductCode, Description, Family, IsActive
            FROM Product2 
            WHERE IsActive = true 
            AND (
                Name LIKE :searchPattern 
                OR ProductCode LIKE :searchPattern 
                OR Description LIKE :searchPattern 
                OR Family LIKE :searchPattern
            )
            ORDER BY Name 
            LIMIT 50
        ];
    }
    
    // Método adicional para obtener estadísticas
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getProductStats(String searchTerm) {
        System.debug('📊 Obteniendo estadísticas para: ' + searchTerm);
        
        Integer totalProducts;
        Map<String, Integer> familyCount = new Map<String, Integer>();
        
        if (String.isBlank(searchTerm)) {
            // Contar todos los productos activos
            totalProducts = [SELECT COUNT() FROM Product2 WHERE IsActive = true];
            
            // Contar por familia
            for (AggregateResult ar : [
                SELECT Family, COUNT(Id) total 
                FROM Product2 
                WHERE IsActive = true AND Family != null
                GROUP BY Family 
                ORDER BY COUNT(Id) DESC
            ]) {
                familyCount.put((String)ar.get('Family'), (Integer)ar.get('total'));
            }
        } else {
            String searchPattern = '%' + searchTerm.trim() + '%';
            
            totalProducts = [
                SELECT COUNT() 
                FROM Product2 
                WHERE IsActive = true 
                AND (
                    Name LIKE :searchPattern 
                    OR ProductCode LIKE :searchPattern 
                    OR Description LIKE :searchPattern 
                    OR Family LIKE :searchPattern
                )
            ];
            
            for (AggregateResult ar : [
                SELECT Family, COUNT(Id) total 
                FROM Product2 
                WHERE IsActive = true 
                AND Family != null
                AND (
                    Name LIKE :searchPattern 
                    OR ProductCode LIKE :searchPattern 
                    OR Description LIKE :searchPattern 
                    OR Family LIKE :searchPattern
                )
                GROUP BY Family 
                ORDER BY COUNT(Id) DESC
            ]) {
                familyCount.put((String)ar.get('Family'), (Integer)ar.get('total'));
            }
        }
        
        return new Map<String, Object>{
            'totalProducts' => totalProducts,
            'familyBreakdown' => familyCount,
            'searchTerm' => searchTerm,
            'timestamp' => System.now()
        };
    }
    
    // Método para crear productos de prueba (útil para testing)
    @AuraEnabled
    public static String createSampleProducts() {
        List<Product2> sampleProducts = new List<Product2>{
            new Product2(Name = 'iPhone 14 Pro', ProductCode = 'IPH14P', Family = 'Electronics', IsActive = true, Description = 'Latest iPhone with advanced camera'),
            new Product2(Name = 'MacBook Air M2', ProductCode = 'MBA-M2', Family = 'Computers', IsActive = true, Description = 'Lightweight laptop with M2 chip'),
            new Product2(Name = 'iPad Pro 12.9', ProductCode = 'IPD129', Family = 'Tablets', IsActive = true, Description = 'Professional tablet with M2 chip'),
            new Product2(Name = 'AirPods Pro 2', ProductCode = 'APP2', Family = 'Audio', IsActive = true, Description = 'Wireless earbuds with noise cancellation'),
            new Product2(Name = 'Apple Watch Ultra', ProductCode = 'AWU', Family = 'Wearables', IsActive = true, Description = 'Rugged smartwatch for extreme sports'),
            new Product2(Name = 'Magic Mouse', ProductCode = 'MM3', Family = 'Accessories', IsActive = true, Description = 'Wireless mouse with multi-touch surface'),
            new Product2(Name = 'Studio Display', ProductCode = 'SD27', Family = 'Monitors', IsActive = true, Description = '27-inch 5K Retina display'),
            new Product2(Name = 'Mac Studio', ProductCode = 'MS-M1U', Family = 'Computers', IsActive = true, Description = 'Compact professional desktop')
        };
        
        try {
            insert sampleProducts;
            return 'Successfully created ' + sampleProducts.size() + ' sample products';
        } catch (Exception e) {
            throw new AuraHandledException('Error creating sample products: ' + e.getMessage());
        }
    }

    @AuraEnabled 
    public static void deleteAllProducts() {
        delete [SELECT Id FROM Product2];
    }
}