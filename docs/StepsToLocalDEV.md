# Steps to Set Up Local Development with Salesforce

This guide will help you enable and configure local Salesforce development using Scratch Orgs, VS Code, and Lightning Web Components (LWC).

---

## 1. Enable Local Development in Your Salesforce Org

Ensure your Salesforce org supports local development and you have the Salesforce CLI (`sf`) installed.

---

## 2. Authorize Your Dev Hub Org

Authorize your Dev Hub org, which allows you to create and manage Scratch Orgs.

```bash
sf org login web --set-default-dev-hub --alias my-hub-org
```

---

## 3. Configure Scratch Org Definition

Edit or create the file `config/project-scratch-def.json` with the following content:

```json
{
  "orgName": "scratchOrgName",
  "edition": "Developer",
  "features": ["EnableSetPasswordInApi"],
  "settings": {
    "lightningExperienceSettings": {
      "enableS1DesktopEnabled": true,
     **"enableLightningPreviewPref": true**
    },
    "mobileSettings": {
      "enableS1EncryptedStoragePref2": false
    }
  }
}
```

Update "orgName" to your preferred Scratch Org name if desired.

---

## 4. Create Scratch Org

```bash
sf org create scratch --definition-file config/project-scratch-def.json --alias scratchOrg --target-dev-hub trailheadOrg
```

---

## 5. Set Password Admin Scratch Org So Can Create Connection on VS Code

```bash
sf org generate password --target-org <<scratchOrgName>>
```

---

## 6. Recover Password and Authenticate on VS Code to Store Connection

```bash
sf org login web --instance-url <your_instance_url> --alias <your_alias> --set-default
```

---

## 7. Deploy ForceEA to Scratch Org

```bash
sf package install -w 10 -p 04tJ8000000PbNdIAK -r --target-org scratchOrg
```

---

## 8. Deploy LWC Components That Will Be Tested

```bash
sf project deploy start --source-dir <<COMPONENT_PATH>> --target-org <<scratchOrgName>>
```

---

## 9. Start Local Dev in Scratch Org

```bash
sf lightning dev app --target-org scratchOrg --device-type desktop
```
