var Service, Characteristic;
var request = require('request');

const DEF_MIN_TEMPERATURE = -100,
      DEF_MAX_TEMPERATURE = 100,
      DEF_TIMEOUT = 5000;
      DEF_INTERVAL = 300000; //120second

module.exports = function (homebridge) {
   Service = homebridge.hap.Service;
   Characteristic = homebridge.hap.Characteristic;
   homebridge.registerAccessory("homebridge-twine-temperature", "TwineTemperature", TwineTemperature);
}


function TwineTemperature(log, config) {
   this.log = log;

   // url info
   this.url = config["url"];
   this.http_method = config["http_method"] || "GET";
   this.name = config["name"];
   this.manufacturer = config["manufacturer"] || "SuperMechnical";
   this.model = config["model"] || "Twine";
   this.serial = config["serial"] || "18356D2499BD";
   this.fieldName = config["field_name"] || "temperature";
   this.timeout = config["timeout"] || DEF_TIMEOUT;
   this.minTemperature = config["min_temp"] || DEF_MIN_TEMPERATURE;
   this.maxTemperature = config["max_temp"] || DEF_MAX_TEMPERATURE;
   this.update_interval = Number ( config["update_interval"] || DEF_INTERVAL);
      
   this.last_value = null;
   this.waiting_response = false;
}

TwineTemperature.prototype = {

      updateState: function() {
         //Ensure previous call finished
      if (this.waiting_response) {
         this.log('avoid updatestate as previous response does not arrived yet');
         return;
      }
      this.last_value = new Promise((resolve, reject) => {
         var ops = {
         uri:    this.url,
         method: this.http_method,
         timeout: this.timeout
      };
       this.log('Requesting temperature on "' + ops.uri + '", method ' + ops.method);
      request(ops, (error, res, body) => {
         var value = null;
         if (error) {
            this.log('HTTP bad response (' + ops.uri + '): ' + error.message);
         } else {
            try {
               var value = JSON.parse(body);
               var temperature = value.values[1][1].toString();       
               temperaturesub = temperature.substr(0, temperature.length-2);
               value = (temperaturesub - 32) * (5/9);
             if (isNaN(value)) {
                     throw new Error('Received value is not a number: "' + value + '" ("' + body.substring(0, 100) + '")');
                  } else if (value < this.minTemperature || value > this.maxTemperature) {
                     var msg = 'Received value is out of bounds: "' + value + '". min=' + this.minTemperature +
                               ', max= ' + this.maxTemperature;
                     throw new Error(msg);
                  }
               this.log('HTTP successful response: ' + value);
            } catch (parseErr) {
               this.log('Error processing received information: ' + parseErr.message);
               error = parseErr;
            }
         }
         if (!error) {
            resolve(value);
         } else {
            reject(error);
         }
         this.waiting_response = false;
      });
}).then((value) => {
   this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature).updateValue(value, null);
      return value;
}, (error) => {
   return error;
});
   },

   getState: function (callback) {
      this.log('call to getstate: waiting_response is "' + this.waiting_response + '"');
      this.updateState(); //This sets the promise in last_value
      this.last_value.then((value) => {
         callback(null, value);
         return value;
      }, (error) => {
         callback(error, null);
         //For now, only to avoid the NodeJS warning about uncatched rejected promises
         return error;
      })
   },

   getTemperatureUnits: function(callback) {
      // 1 =F and 0 = C
      var value = 0;
      this.log("call to getTemperature'Units, response: " + value);
      callback(null, value);
   }

   getServices: function () {
      this.informationService = new Service.AccessoryInformation();
      this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

      this.temperatureService = new Service.TemperatureSensor(this.name);
      this.temperatureService
         .getCharacteristic(Characteristic.CurrentTemperature)
         .on('get', this.getState.bind(this))
         .setProps({
             minValue: this.minTemperature,
             maxValue: this.maxTemperature
         });
   if (this.update_interval > 0) {
         this.timer = setInterval(this.updateState.bind(this), this.update_interval);
      }
      return [this.informationService, this.temperatureService];
   }
};
