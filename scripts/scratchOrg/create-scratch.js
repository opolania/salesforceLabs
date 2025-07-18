#!/usr/bin/env node

const { execSync } = require('child_process');
const process = require('process');

// Función para ejecutar comandos y mostrar output
function runCommand(command, description) {
    console.log(`\n[${description}]`);
    console.log(`Ejecutando: ${command}`);
    
    try {
        execSync(command, { 
            stdio: 'inherit',  // Muestra output en tiempo real
            shell: true 
        });
        console.log(`✓ ${description} - COMPLETADO`);
        return true;
    } catch (error) {
        console.error(`✗ ${description} - ERROR:`, error.message);
        return false;
    }
}

// Obtener el nombre de la scratch org del argumento
const scratchOrgName = process.argv[2];

if (!scratchOrgName) {
    console.error('Error: Debes proporcionar el nombre de la scratch org');
    console.error('Uso: npm run create-scratch <nombre-scratch-org>');
    console.error('Ejemplo: npm run create-scratch mi-scratch-org');
    process.exit(1);
}

console.log('====================================================');
console.log(`Iniciando proceso para scratch org: ${scratchOrgName}`);
console.log('====================================================');

// PASO 1: Crear scratch org

const step1 = runCommand(
    `sf org create scratch --definition-file config/project-scratch-def.json --alias ${scratchOrgName} --target-dev-hub trailheadOrg --duration-days 30`,
    `PASO 1: Creando scratch org: ${scratchOrgName} (30 días)`
);

if (!step1) {
    console.error('Abortando proceso debido a error en PASO 1');
    process.exit(1);
}

// PASO 2: Establecer como org por defecto
const step2 = runCommand(
    `sf config set target-org=${scratchOrgName}`,
    `PASO 2: Estableciendo ${scratchOrgName} como org por defecto`
);

if (!step2) {
    console.error('Abortando proceso debido a error en PASO 2');
    process.exit(1);
}

// PASO 3: Instalar paquete ForceEA
console.log('\n⚠️  NOTA: El siguiente paso puede tardar hasta 10 minutos. Por favor espera...');
const step3 = runCommand(
    `sf package install -w 10 -p 04tJ8000000PbNdIAK -r --target-org ${scratchOrgName}`,
    `PASO 3: Instalando paquete ForceEA`
);

if (!step3) {
    console.error('Abortando proceso debido a error en PASO 3');
    process.exit(1);
}

// PASO 4: Desplegar clase ForceeaTemplateGenerator
const step4 = runCommand(
    `sf project deploy start --source-dir force-app\\main\\default\\classes\\Forceea\\ForceeaTemplateGenerator.cls --target-org ${scratchOrgName}`,
    `PASO 4: Desplegando clase ForceeaTemplateGenerator`
);

if (!step4) {
    console.error('Abortando proceso debido a error en PASO 4');
    process.exit(1);
}

// PASO 5: Ejecutar método templateAccounts
const step5 = runCommand(
    `sf apex run --file scripts\\apex\\createData.apex    --target-org ${scratchOrgName}`,
    `PASO 5: Ejecutando método templateAccounts`
);

if (!step5) {
    console.error('Abortando proceso debido a error en PASO 5');
    process.exit(1);
}

console.log('\n====================================================');
console.log('✓ PROCESO COMPLETADO EXITOSAMENTE');
console.log(`Scratch org: ${scratchOrgName} (vigencia: 30 días)`);
console.log('Estado: Establecida como org por defecto');
console.log('Clase ForceeaTemplateGenerator desplegada exitosamente');
console.log('====================================================');


const step6 = runCommand(
    `sf org open  --target-org ${scratchOrgName}`,
    `PASO 6: Abriendo la scratch org ${scratchOrgName} en el navegador`
);