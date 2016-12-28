# homebridge-programmableswitch

Supports Programmable Switch devices on HomeBridge Platform.

It currently covers Python script triggering for

1. IR codes (via LIRC)
2. Blyss devices [thx StefTech](https://steftech.wordpress.com/2014/06/10/cloner-une-telecommande-radio-frequence-433mhz-part-3-le-cas-blyss/)
3. A custom 433Mhz protocol of mine 

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-programmableswitch
3. Update your configuration file as bellow.

# Configuration

Configuration sample:

 ```
    {
        "bridge": {
            ...
        },
        
        "description": "...",

        "accessories": [{
        "accessory": "ProgrammableSwitch",
        "name": "Programmable Switch",
        "id": 123,
        "statefull": true,
        "pythonScriptPath": "ABSOLUTE_TO_YOUR_SCRIPT",
        "pythonScriptName": "SCRIPT_NAME.py",
        "minValue": 0,
        "maxValue": 3,
        "manufacturer": "Manufacturer",
        "model": "Model",
        "serialnumber": "Serial Number",
        "isDummy": false,
        "buttonId": 1,
        "irCommands": {
            "0": [{
                "remote": "myRemote",
                "key": "myKey"
            },
            {
                "remote": "myRemote",
                "key": "myKey"
            }],
            "1": [{
                "remote": "myRemote",
                "key": "myKey"
            }],
            "2": [{
                "remote": "myRemote",
                "key": "myKey"
            }, {
                "remote": "myRemote",
                "key": "myKey"
            }]
        }
    }],

        "platforms":[]
    }
```

Unfortunatelly, I'm also workin on an option `"statefull": false,` but the `StatelessProgrammableSwitch` looks unstable for now. Use with care, any feeback will be welcomed.


For Bliss
---
```
{
    "accessory": "ProgrammableSwitch",
    "name": "Socket",
    "statefull": true,
    "pythonScriptPath": "/usr/local/lib/node_modules/homebridge-programmableswitch/",
    "pythonScriptName": "blyss.py",
    "manufacturer": "Blyss",
    "serialnumber": "Button1",
    "buttonId": 1
  }
```

For LIRC
---
```
{
    "accessory": "ProgrammableSwitch",
    "name": "Vidéo projecteur",
    "statefull": true,
    "pythonScriptPath": "/usr/local/lib/node_modules/homebridge-programmableswitch/",
    "pythonScriptName": "IRremote.py",
    "minValue": 0,
    "maxValue": 1,
    "manufacturer": "Optoma",
    "serialnumber": "HD 700X",
    "irCommands": {
      "0": [{
          "remote": "OPTOMA_HD700X",
          "key": "KEY_POWER"
      }],
      "1": [{
          "remote": "OPTOMA_HD700X",
          "key": "KEY_POWER"
      }]
    }
  }
```