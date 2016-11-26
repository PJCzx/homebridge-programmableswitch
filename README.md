# homebridge-programmableswitch

Supports Programmable Switch devices on HomeBridge Platform

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
        "serialnumber": "Serial Number"
    }],

        "platforms":[]
    }
```

The demo python script included takes `numeric` value as args. I added `on`, `off` for picky guys, and `true`, `false` for one of the shitty app I use wich doesn't comply with HAP.

Unfortunatelly, I'm also workin on an option `"statefull": false,` but the `StatelessProgrammableSwitch` looks unstable for now. Use with care, any feeback will be welcomed.