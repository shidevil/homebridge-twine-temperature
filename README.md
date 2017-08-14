Based on Metbosch homebridge-HTTP-Temperature https://github.com/metbosch/homebridge-http-temperature

# homebridge-twine-temperature

Support getting temperature from Twine API returning a JSON with the temperature data

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
