#1.enable local dev on org

#2. on file config/project-scratch-def.json
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

#3. AUTHORIZE Dev Hub
sf org login web --set-default-dev-hub --alias my-hub-org


#4.Create Scratch ORG
org create scratch --definition-file config/project-scratch-def.json --alias scratchOrg --target-dev-hub trailheadOrg


#5.Set Password admin scratch org SO CAN CREATE CONNECTION ON VSCODE
sf org generate password --target-org


#6.DEPLOY FORCEEA TO SCRATCH ORG
Sf package install -w 10 -p 04tJ8000000PbNdIAK -r --target-org scratchOrg

#7.DEPLOY COMPONENTS TO CREATE TEST DATA SPECIFIC PATH 
sf project deploy start --source-dir <<COMPONENT_PATH>> --target-org scratchOrg

#8.login with custom url scratch org
sf org login web --instance-url <your_instance_url> --alias <your_alias> --set-default


#9.Start local dev in scratch ORG
sf lightning dev app --target-org scratchOrg --device-type desktop










