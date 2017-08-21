# homebridge-twine-temperature

Support getting temperature from Twine API returning a JSON with the temperature data

# Installation

1. Download/Clone the Git
2. cd to the git folder
3. Run sudo npm -g install

# Configuration

The available fields in the config.json file are:
 - `url` [Mandatory] Endpoint URL.
 - `name` [Mandatory] Accessory name.
 - `http_method` [Optional] HTTP method used to get the temperature (Default: GET)
 - `manufacturer` [Optional] Additional information for the accessory.
 - `model` [Optional] Additional information for the accessory.
 - `serial` [Optional] Additional information for the accessory.
 - `timeout` [Optional] Waiting time for the endpoint response before fail (Default: 5000ms).
 - `min_temp` [Optional] Min. temperature that can be returned by the endpoint (Default: -100).
 - `max_temp` [Optional] Max. temperature that can be returned by the endpoint (Default: 100).
 - `refresh` [Optional] Refresh Status timing. Default 5 minutes (Default: 300). 

Example:

 ```
    "accessories": [
        {
            "accessory": "TwineTemperature",
            "name": "Twine Temperature",
            "url": "https://twine.cc/<Twine Device ID>/rt?cached=1&access_key=<access key>",
            "http_method": "GET"
        }
    ]

```

# Credit

Based on Metbosch homebridge-HTTP-Temperature https://github.com/metbosch/homebridge-http-temperature
