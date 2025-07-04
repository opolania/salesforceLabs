#1.enable local dev on org

#2.AUTHORIZE Dev Hub
sf org login web --set-default-dev-hub --alias my-hub-org

#3.  on file config/project-scratch-def.json
{
  "orgName": "scratchOrgName",
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


#4.Create Scratch ORG
org create scratch --definition-file config/project-scratch-def.json --alias scratchOrg --target-dev-hub trailheadOrg


#5.Set Password admin scratch org SO CAN CREATE CONNECTION ON VSCODE
sf org generate password --target-org <<scratchOrgName>>

#6.Recover password  and authenticate on VS Code to store connection 
sf org login web --instance-url <your_instance_url> --alias <your_alias> --set-default

#7.DEPLOY FORCEEA TO SCRATCH ORG
Sf package install -w 10 -p 04tJ8000000PbNdIAK -r --target-org scratchOrg

#8.DEPLOY LWC COMPONENTS  that will be tested
sf project deploy start --source-dir <<COMPONENT_PATH>> --target-org <<scratchOrgName>>

#10.Start local dev in scratch ORG
sf lightning dev app --target-org scratchOrg --device-type desktop










