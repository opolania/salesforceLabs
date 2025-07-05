# Comparación: WITH SECURITY_ENFORCED vs WITH USER_MODE

## Resumen Ejecutivo

En Salesforce Apex, existen dos principales cláusulas para manejar la seguridad en operaciones de base de datos:
- **WITH SECURITY_ENFORCED**: Enfocada en seguridad a nivel de campo (FLS)
- **WITH USER_MODE**: Seguridad integral que incluye objeto, campo, sharing rules y territorio

## WITH SECURITY_ENFORCED

### ✅ Beneficios

#### 1. **Errores Específicos y Claros**
```apex
// Error detallado sobre campo específico
List<Account> accounts = [SELECT Id, Name, Revenue FROM Account WITH SECURITY_ENFORCED];
// Error: "No such column 'Revenue' on entity 'Account'"
```

#### 2. **Scope Limitado y Predecible**
- Solo valida permisos de campo (FLS)
- Comportamiento consistente y predecible
- Ideal para validaciones específicas de FLS

#### 3. **Disponible desde Versiones Anteriores**
- Implementado desde versiones más antiguas de Apex
- Compatible con código legacy existente

#### 4. **Rendimiento Optimizado**
- Validaciones limitadas = menos overhead
- Ejecución más rápida en queries simples

### ❌ Limitaciones

#### 1. **Solo Aplica a SELECT y FROM**
```apex
// ❌ PROBLEMA: Si no tienes acceso a Revenue, la query se ejecuta igual
List<Account> accounts = [SELECT Id, Name 
                         FROM Account 
                         WHERE Revenue > 100000 
                         WITH SECURITY_ENFORCED];
```

#### 2. **No Funciona en DML Operations**
```apex
// ❌ Esto NO existe:
// insert with security_enforced accountList;
```

#### 3. **Solo Muestra el Primer Error**
```apex
// Si faltan permisos en: Industry, Revenue, Rating
// Solo te dice: "No such column 'Industry'"
// No sabes que Revenue y Rating también fallan
```

#### 4. **No Soporta Campos Polimórficos**
```apex
// ❌ Error de compilación
List<Event> events = [SELECT Id, What.Name FROM Event WITH SECURITY_ENFORCED];
```

#### 5. **No Valida Sharing Rules ni Territorio**
- Solo FLS, no validación completa de seguridad
- Puede exponer datos que el usuario no debería ver

---

## WITH USER_MODE

### ✅ Beneficios

#### 1. **Seguridad Integral**
```apex
// Valida: objeto, campos, WHERE clause, sharing rules, territorio
List<Account> accounts = [SELECT Id, Name, Industry 
                         FROM Account 
                         WHERE Revenue > 1000000 
                         WITH USER_MODE];
```

#### 2. **Funciona en DML Operations**
```apex
// ✅ Soporta todas las operaciones DML
Account acc = new Account(Name='Test', Industry='Tech');
insert as user acc;

Database.insert(accountList, AccessLevel.USER_MODE);
Database.update(accountList, AccessLevel.USER_MODE);
Database.delete(accountList, AccessLevel.USER_MODE);
```

#### 3. **Mejor Manejo de Errores**
```apex
try {
    insert as user accountList;
} catch (DmlException e) {
    // ✅ Obtiene TODOS los campos con errores
    List<String> fieldsWithErrors = e.getFieldNames();
    System.debug('Todos los campos con errores: ' + fieldsWithErrors);
}
```

#### 4. **Consistencia en Toda la Aplicación**
```apex
// Una sola sintaxis para queries y DML
List<Account> accounts = [SELECT Id FROM Account WITH USER_MODE];
insert as user accountList;
```

#### 5. **Validación Completa de WHERE/ORDER BY**
```apex
// ✅ Si no tienes acceso a Revenue, la query falla completamente
List<Account> accounts = [SELECT Id, Name 
                         FROM Account 
                         WHERE Revenue > 100000 
                         WITH USER_MODE];
```

#### 6. **Soporta Campos Polimórficos**
```apex
// ✅ Funciona correctamente
List<Event> events = [SELECT Id, What.Name FROM Event WITH USER_MODE];
```

### ❌ Limitaciones

#### 1. **Errores Menos Específicos**
```apex
// Mensaje genérico: "Insufficient privileges"
// No te dice exactamente cuál campo causa el problema
```

#### 2. **Más Overhead de Validación**
- Validaciones completas = más procesamiento
- Ligeramente más lento que SECURITY_ENFORCED

#### 3. **Disponible Solo en Versiones Recientes**
- Implementado en versiones más nuevas
- Puede requerir actualización de código legacy

---

## Comparación Práctica

| Aspecto | WITH SECURITY_ENFORCED | WITH USER_MODE |
|---------|------------------------|----------------|
| **Depuración** | ❌ Solo primer error | ✅ Todos los errores |
| **DML Operations** | ❌ No soporta | ✅ Soporta completamente |
| **Seguridad Completa** | ❌ Solo FLS | ✅ Integral |
| **Errores Específicos** | ✅ Muy específicos | ❌ Más genéricos |
| **WHERE/ORDER BY** | ❌ No valida | ✅ Valida completamente |
| **Campos Polimórficos** | ❌ No soporta | ✅ Soporta |
| **Rendimiento** | ✅ Más rápido | ❌ Más lento |

---

## Recomendaciones de Uso

### 🎯 Para Depuración
**Recomendado: WITH USER_MODE**
```apex
// Obtiene todos los errores de una vez
try {
    Account acc = new Account(Name='Test', Industry='Tech', Revenue=100000);
    insert as user acc;
} catch (DmlException e) {
    List<String> allErrors = e.getFieldNames();
    System.debug('Campos con errores: ' + allErrors);
}
```

### 🎯 Para Producción
**Recomendado: WITH USER_MODE**
```apex
public class AccountService {
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Industry FROM Account WITH USER_MODE];
    }
    
    public static void createAccount(Account acc) {
        insert as user acc;
    }
}
```

### 🎯 Para Casos Específicos
**Usar WITH SECURITY_ENFORCED cuando:**
- Solo necesitas validar FLS específicamente
- Trabajas con código legacy
- Requieres máximo rendimiento en queries simples
- Necesitas errores muy específicos sobre campos

---

## Conclusión

**WITH USER_MODE es la opción superior** para la mayoría de casos porque:
- Proporciona seguridad integral
- Funciona en queries y DML
- Mejor para depuración (muestra todos los errores)
- Es la dirección futura de Apex security

**WITH SECURITY_ENFORCED** sigue siendo útil para casos específicos donde solo necesitas validar FLS y requieres errores muy detallados sobre campos específicos.

### Migración Recomendada
```apex
// Antes (legacy)
List<Account> accounts = [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED];

// Después (recomendado)
List<Account> accounts = [SELECT Id, Name FROM Account WITH USER_MODE];
```
