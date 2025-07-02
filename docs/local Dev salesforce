# 🚀 Configuración de Lightning Web Components con Salesforce DX

[![Salesforce](https://img.shields.io/badge/Salesforce-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)](https://developer.salesforce.com/)
[![Lightning Web Components](https://img.shields.io/badge/LWC-Lightning%20Web%20Components-blue?style=for-the-badge)](https://lwc.dev/)

> Guía paso a paso para configurar herramientas de desarrollo y crear tu primer Lightning Web Component usando Salesforce DX.

## 📋 Tabla de Contenidos

- [Prerrequisitos](#-prerrequisitos)
- [Configuración Inicial del Proyecto](#-configuración-inicial-del-proyecto)
- [Creación del Lightning Web Component](#-creación-del-lightning-web-component)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Próximos Pasos](#-próximos-pasos)
- [Recursos Adicionales](#-recursos-adicionales)

## 🔧 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- [Visual Studio Code](https://code.visualstudio.com/)
- [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)
- [Salesforce Extensions for VS Code](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)
- Una [Developer Org de Salesforce](https://developer.salesforce.com/signup)

## 🏗️ Configuración Inicial del Proyecto

### 1. Crear un Proyecto Salesforce DX

```bash
# Opción 1: Desde VS Code Command Palette
# Command + Shift + P (macOS) o Ctrl + Shift + P (Windows/Linux)
# Buscar: "create project" → SFDX: Create Project
```

**Pasos detallados:**
1. Abrir Visual Studio Code
2. Presionar `Command + Shift + P` (macOS) o `Ctrl + Shift + P` (Windows/Linux)
3. Escribir `create project`
4. Seleccionar **SFDX: Create Project**
5. Mantener selección **Standard** y presionar Enter
6. Nombre del proyecto: `trailhead`
7. Elegir directorio y hacer clic en **Create Project**

### 2. Autorizar el Dev Hub

```bash
# Comando para autorizar Dev Hub
sfdx auth:web:login --setdefaultdevhubusername --setalias trailheadOrg
```

**Pasos desde VS Code:**
1. Abrir Command Palette (`Command/Ctrl + Shift + P`)
2. Escribir `sfdx`
3. Seleccionar **SFDX: Authorize a Dev Hub**
4. Alias del org: `trailheadOrg`
5. Iniciar sesión con credenciales del Dev Hub
6. Hacer clic en **Allow**

### 3. Habilitar Local Dev

Editar el archivo `config/project-scratch-def.json`:

```json
{
  "orgName": "My Company",
  "edition": "Developer",
  "features": ["EnableSetPasswordInApi"],
  "settings": {
    "lightningExperienceSettings": {
      "enableS1DesktopEnabled": true,
      "enableLightningPreviewPref": true
    },
    "mobileSettings": {
      "enableS1EncryptedStoragePref2": false
    }
  }
}
```

> ⚠️ **Importante**: Agregar `"enableLightningPreviewPref": true` en la sección `lightningExperienceSettings`

### 4. Crear un Scratch Org

```bash
sf org create scratch --definition-file config/project-scratch-def.json --alias scratchOrg --target-dev-hub trailheadOrg
```

**Desde VS Code Terminal:**
1. Abrir Terminal: `Command/Ctrl + Shift + P` → "focus terminal"
2. Ejecutar el comando anterior
3. Esperar confirmación de creación exitosa

## ⚡ Creación del Lightning Web Component

### 1. Generar el Componente

```bash
sf lightning generate component -n myFirstWebComponent -d force-app/main/default/lwc --type lwc
```

**Parámetros del comando:**
- `-n`: Nombre del componente y sus archivos
- `-d`: Directorio destino (debe llamarse `lwc`)
- `--type`: Tipo de componente (Lightning Web Component)

### 2. Estructura de Archivos Generada

```
force-app/main/default/lwc/myFirstWebComponent/
├── myFirstWebComponent.html        # Template HTML
├── myFirstWebComponent.js          # Lógica JavaScript
├── myFirstWebComponent.js-meta.xml # Configuración de metadata
└── myFirstWebComponent.css         # Estilos (opcional)
```

## 📁 Estructura de Archivos

### myFirstWebComponent.js-meta.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>51.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__AppPage">
            <supportedFormFactors>
                <supportedFormFactor type="Small" />
                <supportedFormFactor type="Large" />
            </supportedFormFactors>
        </targetConfig>
        <targetConfig targets="lightning__RecordPage">
            <supportedFormFactors>
                <supportedFormFactor type="Small" />
                <supportedFormFactor type="Large" />
            </supportedFormFactors>
        </targetConfig>
        <targetConfig targets="lightning__HomePage">
            <supportedFormFactors>
                <supportedFormFactor type="Small" />
                <supportedFormFactor type="Large" />
            </supportedFormFactors>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

### myFirstWebComponent.js

```javascript
import { LightningElement } from 'lwc';

export default class MyFirstWebComponent extends LightningElement {
    @track contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];
}
```

### myFirstWebComponent.html

```html
<template>
    <lightning-card title="Contact Information" icon-name="custom:custom14">
        <div class="slds-m-around_medium">
            <template for:each={contacts} for:item="contact">
                <div key={contact.Id}>
                    {contact.Name}, {contact.Title}
                </div>
            </template>
        </div>
    </lightning-card>
</template>
```

## 🔍 Componentes Clave Explicados

### Archivo de Metadata (.js-meta.xml)
- **apiVersion**: Versión de la API de Salesforce
- **isExposed**: Permite que el componente sea visible en Lightning App Builder
- **targets**: Define dónde puede usarse el componente (App, Record, Home pages)
- **supportedFormFactors**: Soporte para dispositivos Small/Large

### Archivo JavaScript (.js)
- **LightningElement**: Clase base para todos los LWC
- **@track**: Decorator para propiedades reactivas (obsoleto en versiones nuevas)
- **export default**: Exporta la clase del componente

### Template HTML (.html)
- **template**: Contenedor raíz requerido
- **lightning-card**: Componente base de Salesforce
- **for:each/for:item**: Directivas para iteración
- **key**: Identificador único requerido en loops

## 🚀 Próximos Pasos

1. **Corregir errores**: El tutorial menciona que hay errores intencionales para aprender
2. **Deploy del componente**: 
   ```bash
   sf project deploy start --source-dir force-app/main/default/lwc
   ```
3. **Agregar al Lightning App Builder**:
   - Ir a Setup → Lightning App Builder
   - Editar una página existente o crear nueva
   - Arrastrar el componente desde el panel lateral

4. **Testing local**: Usar Lightning Web Components Local Development

## 📚 Recursos Adicionales

- [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
- [Trailhead: Lightning Web Components](https://trailhead.salesforce.com/content/learn/trails/build-lightning-web-components)
- [LWC Recipes Repository](https://github.com/trailheadapps/lwc-recipes)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/)

## 🤝 Contribuir

Si encuentras errores o mejoras para esta guía:
1. Fork este repositorio
2. Crea una rama para tu mejora
3. Realiza tus cambios
4. Envía un Pull Request

## 📄 Licencia

Esta documentación está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**⭐ ¿Te resultó útil esta guía?** ¡Dale una estrella al repositorio y compártela con otros desarrolladores de Salesforce!

**🐛 ¿Encontraste un problema?** Abre un [issue](../../issues) y te ayudaremos a resolverlo.

                                  # 🖥️ Preview de Lightning Web Components usando Local Dev

[![Salesforce Local Dev](https://img.shields.io/badge/Salesforce-Local%20Dev-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)](https://developer.salesforce.com/)
[![LWC](https://img.shields.io/badge/LWC-Lightning%20Web%20Components-blue?style=for-the-badge)](https://lwc.dev/)

> Guía completa para previsualizar Lightning Web Components en tiempo real usando Local Dev de Salesforce en entornos desktop e iOS.

## 📋 Tabla de Contenidos

- [¿Qué es Local Dev?](#-qué-es-local-dev)
- [Prerrequisitos](#-prerrequisitos)
- [Preview en Desktop](#-preview-en-desktop)
- [Preview en iOS (Solo macOS)](#-preview-en-ios-solo-macos)
- [Características Principales](#-características-principales)
- [Solución de Problemas](#-solución-de-problemas)
- [Recursos Adicionales](#-recursos-adicionales)

## 🔍 ¿Qué es Local Dev?

Local Dev es una herramienta de Salesforce que permite:
- **Preview en tiempo real** de tus Lightning Web Components
- **Actualizaciones automáticas** cuando cambias el código localmente
- **Testing multiplataforma** (Desktop, iOS, Android)
- **Desarrollo sin deployment** - no necesitas hacer deploy para ver cambios

## 🛠️ Prerrequisitos

- ✅ Visual Studio Code instalado
- ✅ Salesforce CLI actualizado
- ✅ Scratch org creado (alias: `scratchOrg`)
- ✅ Lightning Web Component creado (`myFirstWebComponent`)
- ✅ **Para iOS**: Xcode instalado (solo macOS)

## 🖥️ Preview en Desktop

### 1. Actualizar Salesforce CLI

```bash
# Actualizar a la última versión
sf update
```

### 2. Ejecutar Local Dev para Desktop

```bash
# Comando principal para preview desktop
sf lightning dev app --target-org scratchOrg --device-type desktop
```

**Pasos detallados:**
1. Abrir Visual Studio Code
2. Abrir nueva terminal: `Command/Ctrl + Shift + P` → "new terminal"
3. Ejecutar el comando de actualización: `sf update`
4. Ejecutar el comando Local Dev
5. Seleccionar la app **Sales** cuando se solicite
6. El browser abrirá automáticamente con el preview

### 3. Parámetros del Comando

| Parámetro | Descripción | Valor |
|-----------|-------------|-------|
| `--target-org` | Org objetivo para el preview | `scratchOrg` |
| `--device-type` | Tipo de dispositivo | `desktop` |

### 4. Prueba de Actualización en Tiempo Real

**Editar el componente:**
1. Ir a la pestaña **Accounts** en el browser
2. Abrir el record **Component Developers**
3. En VS Code, abrir `myFirstWebComponent.html`
4. Cambiar el título del `<lightning-card>`:

```html
<!-- Antes -->
<lightning-card title="ContactInformation" icon-name="custom:custom14">

<!-- Después -->
<lightning-card title="Contact Information" icon-name="custom:custom14">
```

5. Guardar el archivo (`Command/Ctrl + S`)
6. ¡Ver el cambio automático en el browser! 🎉

## 📱 Preview en iOS (Solo macOS)

### 1. Prerrequisitos iOS

- **Xcode** instalado desde Mac App Store
- **iOS Simulators** descargados en Xcode
- **Configuración inicial** de Xcode completada

### 2. Ejecutar Local Dev para iOS

```bash
# Comando para preview iOS
sf lightning dev app --target-org scratchOrg --device-type ios
```

**Proceso paso a paso:**
1. Abrir nueva terminal en VS Code
2. Ejecutar el comando iOS
3. Seleccionar **Sales** como Lightning App
4. Elegir un **iPhone** de la lista de dispositivos
5. Confirmar descarga del Salesforce Mobile App (`y`)

### 3. Salida Típica del Comando

```bash
sf lightning dev app --target-org scratchOrg --device-type ios
? Which Lightning Experience App do you want to use for the preview? Sales
✔ Requirements (0.444 sec)
✔ PASSED: Checking macOS Environment (0.000 sec)
✔ PASSED: Checking Xcode (0.029 sec)
› Xcode installed: Xcode 16.2 Build version 16C5032a
✔ PASSED: Checking Supported Simulator Runtime (0.414 sec)
› One or more supported simulator runtimes are configured for iOS: iOS 17.0 iOS 18.2
? Which device do you want to use for the preview? iPhone 15 Pro, iOS 17
Booting device iPhone 15 Pro, iOS 17.0.0...
Installing self-signed certificate... done
? Salesforce Mobile App isn't installed on your device. Do you want to download and install it? yes
Installing app com.salesforce.chatter... done
```

### 4. Configuración del Simulador iOS

#### Obtener URL de la Scratch Org
```bash
sf org display user --target-org scratchOrg
```

#### Configurar Conexión en el Simulador
1. En el simulador, hacer clic en **Settings** (⚙️)
2. Seleccionar **Add** (+) para agregar nuevo host
3. En **Host**, pegar la **Instance URL** de tu scratch org
4. Hacer clic en **Done**

#### Iniciar Sesión
1. Copiar **Username** del output del comando anterior
2. Generar password:
   ```bash
   sf org generate password --target-org scratchOrg
   ```
3. Copiar la password generada
4. Iniciar sesión en el simulador
5. Ingresar código de verificación si es necesario
6. Seleccionar **Allow** para acceso al org

### 5. Navegación y Testing

**Acceder al componente:**
1. En el simulador, ir a **Menu** → **Accounts**
2. Seleccionar **Component Developers** en Recent Accounts
3. Ver tu componente `myFirstWebComponent`

**Probar cambios en tiempo real:**
1. En VS Code, editar `myFirstWebComponent.html`
2. Cambiar título a "Contact Info":
   ```html
   <lightning-card title="Contact Info" icon-name="custom:custom14">
   ```
3. Guardar archivo
4. ¡Ver actualización automática en el simulador! 📱

## ⚡ Características Principales

### ✨ Ventajas de Local Dev

- **🚀 Desarrollo rápido**: No necesitas hacer deploy para ver cambios
- **🔄 Actualización automática**: Los cambios se reflejan instantáneamente
- **📱 Testing multiplataforma**: Desktop, iOS, y Android
- **🎯 Desarrollo realista**: Preview en el contexto real de Salesforce
- **💻 Workflow optimizado**: Edita código y ve resultados al instante

### 🎯 Casos de Uso Ideales

- Desarrollo inicial de componentes
- Testing de UI/UX changes
- Validación de responsive design
- Debug de funcionalidades específicas
- Demos y presentaciones

## 🔧 Solución de Problemas

### Error: "Command not found"
```bash
# Verificar instalación de Salesforce CLI
sf --version

# Reinstalar si es necesario
npm install -g @salesforce/cli
```

### Error: "No scratch org found"
```bash
# Verificar scratch orgs disponibles
sf org list

# Recrear scratch org si es necesario
sf org create scratch --definition-file config/project-scratch-def.json --alias scratchOrg
```

### Error: "Xcode not found" (iOS)
- Instalar Xcode desde Mac App Store
- Completar configuración inicial
- Descargar iOS simulators

### Error: "Component not visible"
- Verificar que el componente esté en la página correcta
- Revisar metadata configuration en `.js-meta.xml`
- Asegurar que `isExposed` sea `true`

## 🚀 Comandos Útiles

```bash
# Actualizar Salesforce CLI
sf update

# Ver información de la org
sf org display user --target-org scratchOrg

# Generar password para scratch org
sf org generate password --target-org scratchOrg

# Listar orgs disponibles
sf org list

# Preview desktop
sf lightning dev app --target-org scratchOrg --device-type desktop

# Preview iOS (macOS solamente)
sf lightning dev app --target-org scratchOrg --device-type ios

# Preview Android (requiere Android Studio)
sf lightning dev app --target-org scratchOrg --device-type android
```

## 📚 Recursos Adicionales

- [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/platform/lwc/guide/)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/)
- [Lightning Web Component Recipes](https://github.com/trailheadapps/lwc-recipes)
- [Trailhead Sample Apps](https://trailhead.salesforce.com/sample-gallery)
- [Local Dev Documentation](https://developer.salesforce.com/docs/platform/lwc/guide/get-started-test-components.html)

## 🎯 Próximos Pasos

1. **Experimentar** con diferentes tipos de componentes
2. **Probar** en múltiples dispositivos
3. **Integrar** con otros componentes de Salesforce
4. **Optimizar** para diferentes form factors
5. **Explorar** las opciones avanzadas de configuración

---

## 🤝 Contribuir

¿Encontraste mejoras o errores en esta guía?
1. Fork este repositorio
2. Crea una rama para tu mejora
3. Envía un Pull Request

## 📄 Licencia

Esta documentación está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**💡 Tip**: Local Dev es una herramienta poderosa que acelera significativamente el desarrollo de Lightning Web Components. ¡Úsala para iterar rápidamente y crear componentes increíbles!

**⭐ ¿Te resultó útil?** ¡Dale una estrella al repositorio!
