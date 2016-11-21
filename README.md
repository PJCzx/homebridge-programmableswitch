# homebridge-programmableswitch

ALPHA !!
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
        "name": "ProgrammableSwitch",
        "statefull": false
    }],

        "platforms":[]
    }
```