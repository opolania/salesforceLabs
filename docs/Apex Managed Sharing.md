# Conclusiones: Apex Managed Sharing en Salesforce

## ¿Cuándo usar Apex Managed Sharing?

Apex Managed Sharing es necesario cuando las reglas de sharing estándar no pueden manejar lógica compleja o dinámica que depende de información **no directamente** en el registro compartido.

### Limitaciones de las reglas estándar:

1. **Jerarquía de roles no coincide**: Los roles organizacionales no mapean directamente con los equipos de proyecto
2. **Reglas basadas en criterios son insuficientes**: No pueden referenciar registros relacionados para otorgar acceso
3. **Sharing manual no es automatizado**: Requiere intervención manual constante y no se actualiza dinámicamente

## Ejemplo práctico

**Escenario**: Objeto `Project__c` con `Project_Team_Member__c` que vincula usuarios a proyectos.

**Requerimiento**: Cualquier usuario listado como miembro del equipo debe tener acceso Read/Write al proyecto, independientemente de su rol.

### Solución con Apex Managed Sharing:

```apex
trigger ProjectTeamMemberTrigger on Project_Team_Member__c (after insert, after delete) {
    List<Project__Share> shares = new List<Project__Share>();
    
    // Al insertar nuevos miembros
    if(Trigger.isInsert) {
        for(Project_Team_Member__c member : Trigger.new) {
            Project__Share share = new Project__Share();
            share.ParentId = member.Project__c;
            share.UserOrGroupId = member.User__c;
            share.AccessLevel = 'Edit';
            share.RowCause = Schema.Project__Share.RowCause.Project_Team_Member__c;
            shares.add(share);
        }
        insert shares;
    }
    
    // Al eliminar miembros
    if(Trigger.isDelete) {
        List<Project__Share> toDelete = [
            SELECT Id FROM Project__Share 
            WHERE RowCause = :Schema.Project__Share.RowCause.Project_Team_Member__c
            AND ParentId IN :projectIds
            AND UserOrGroupId IN :userIds
        ];
        delete toDelete;
    }
}
```

## Objeto Project__Share

### ¿Dónde encontrarlo?
- **NO aparece en Setup** - es un objeto automático
- Se crea automáticamente cuando el objeto personalizado tiene OWD restrictivo

### Requisitos para que exista:
- ✅ Organization-Wide Default (OWD) = "Private" o "Public Read Only"
- ❌ NO existe si OWD = "Public Read/Write"

### Verificación:
```sql
SELECT Id, ParentId, UserOrGroupId, AccessLevel, RowCause 
FROM Project__Share 
LIMIT 5
```

## Campo RowCause

### ¿Qué es?
Campo que identifica **por qué motivo** se creó el registro de sharing.

### Valores permitidos:
- **Sistema**: `Manual`, `Owner`
- **Custom**: Definidos mediante **Apex Sharing Reasons**

### ❌ Concepto erróneo:
"RowCause se puede llenar con cualquier valor libre"

### ✅ Realidad:
"RowCause requiere valores específicos creados como Apex Sharing Reasons"

## Creación de Custom RowCause

### Proceso:
1. **Setup → Object Manager → Project__c → Apex Sharing Reasons → New**
2. **Configurar**:
   - Label: "Project Team Member"
   - Name: "Project_Team_Member"
   - Description: "Access for project team members"

3. **Usar en código**:
```apex
projShare.RowCause = Schema.Project__Share.RowCause.Project_Team_Member__c;
```

### Beneficios:
- **Identificación clara**: Sabes exactamente por qué alguien tiene acceso
- **Limpieza selectiva**: Puedes eliminar solo registros de sharing específicos
- **Debugging**: Facilita encontrar problemas de permisos
- **Mantenimiento**: Mejor organización del código

## Ejemplo completo de implementación

```apex
trigger ProjectTeamMemberTrigger on Project_Team_Member__c (after insert, after update, after delete) {
    
    if(Trigger.isInsert || Trigger.isUpdate) {
        List<Project__Share> sharesToInsert = new List<Project__Share>();
        
        for(Project_Team_Member__c member : Trigger.new) {
            Project__Share share = new Project__Share();
            share.ParentId = member.Project__c;
            share.UserOrGroupId = member.User__c;
            share.AccessLevel = 'Edit';
            share.RowCause = Schema.Project__Share.RowCause.Project_Team_Member__c;
            sharesToInsert.add(share);
        }
        
        if(!sharesToInsert.isEmpty()) {
            insert sharesToInsert;
        }
    }
    
    if(Trigger.isDelete) {
        Set<Id> projectIds = new Set<Id>();
        Set<Id> userIds = new Set<Id>();
        
        for(Project_Team_Member__c member : Trigger.old) {
            projectIds.add(member.Project__c);
            userIds.add(member.User__c);
        }
        
        List<Project__Share> sharesToDelete = [
            SELECT Id FROM Project__Share 
            WHERE RowCause = :Schema.Project__Share.RowCause.Project_Team_Member__c
            AND ParentId IN :projectIds
            AND UserOrGroupId IN :userIds
        ];
        
        if(!sharesToDelete.isEmpty()) {
            delete sharesToDelete;
        }
    }
}
```

## Casos de uso típicos

1. **Equipos de proyecto**: Miembros del equipo necesitan acceso independientemente de su rol
2. **Colaboración entre departamentos**: Sharing basado en relaciones complejas
3. **Acceso temporal**: Otorgar acceso por tiempo limitado basado en eventos
4. **Sharing condicional**: Acceso basado en múltiples criterios o cálculos complejos

## Mejores prácticas

1. **Usar custom RowCause**: Siempre crear Apex Sharing Reasons específicos
2. **Manejo de errores**: Implementar try-catch para operaciones DML
3. **Bulk processing**: Manejar múltiples registros eficientemente
4. **Limpieza automática**: Eliminar sharing cuando ya no es necesario
5. **Testing**: Crear test classes que cubran todos los escenarios

## Conclusión final

Apex Managed Sharing es una herramienta poderosa para casos donde las reglas estándar de Salesforce no son suficientes. Permite implementar lógica de sharing compleja y dinámica, manteniendo la seguridad y automatización del proceso. La clave está en entender cuándo usarlo y cómo implementarlo correctamente con custom RowCause para mejor mantenimiento y debugging.
