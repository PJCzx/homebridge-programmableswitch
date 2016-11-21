var Service, Characteristic;

module.exports = function(homebridge) {
	console.log("homebridge API version: " + homebridge.version);
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-programmableswitch", "ProgrammableSwitch", ProgrammableSwitch);
};


function ProgrammableSwitch(log, config) {
	this.switchService = new Service.Switch(this.name);

	this.statefull = config.statefull || true;
	this.service = this.statefull ? new Service.StatefulProgrammableSwitch(this.name) : new Service.StatelessProgrammableSwitch(this.name);

	this.log = log;
	this.name = config.name || "A Programmable Switch";

	this.aValue = 0;

	//this.batteryService = new Service.BatteryService(this.name);
	
	/*
	this.id = config.id || 0;
	this.pythonScriptPath = config.pythonScriptPath;
	this.pythonScriptName = config.pythonScriptName;
	this.apiroute = config.apiroute;
	*/

	// Required Characteristics
  	//this.service.addCharacteristic(Characteristic.ProgrammableSwitchEvent);
  	this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
	.setProps({
	    maxValue: 10,
	    minValue: 0,
	    minStep: 1
	});

	this.service.getCharacteristic(Characteristic.ProgrammableSwitchOutputState)
 	.setProps({
	    maxValue: 10,
	    minValue: 0,
	    minStep: 1
	});

  	// Optional Characteristics
  	//this.addOptionalCharacteristic(Characteristic.Name);
}

ProgrammableSwitch.prototype = {
	//Start
	identify: function(callback) {
		this.log("Identify requested!");
		callback(null);
	},
	// Required
	getName: function(callback) {
		this.log("getName :", this.name);
		var error = null;
		callback(error, this.name);
	},
	getProgrammableSwitchEvent: function(callback) {
		this.log("getProgrammableSwitchEvent :", this.aValue);
		var error = null;
		callback(error, this.aValue);
	},
	setProgrammableSwitchEvent: function(value, callback) {
		this.log("setProgrammableSwitchEvent :", value);
		this.aValue = value;
		var error = null;
		callback(error);
	},
	getProgrammableSwitchOutputState: function(callback) {
		this.log("getProgrammableSwitchOutputState :", this.aValue);
		var error = null;
		callback(error, 0);
	},
	setProgrammableSwitchOutputState: function(value, callback) {
		this.log("setProgrammableSwitchOutputState :", value);
		this.aValue = value;
		var error = null;
		callback(error);
	},

	getServices: function() {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
			.setCharacteristic(Characteristic.Model, "HTTP Model")
			.setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");

		this.service
			.getCharacteristic(Characteristic.Name)
			.on('get', this.getName.bind(this));

		this.service
			.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
			.on('get', this.getProgrammableSwitchEvent.bind(this))
			.on('set', this.setProgrammableSwitchEvent.bind(this));

		this.service
			.getCharacteristic(Characteristic.ProgrammableSwitchOutputState)
			.on('get', this.getProgrammableSwitchOutputState.bind(this))
			.on('set', this.setProgrammableSwitchOutputState.bind(this));
	
		return [informationService, this.service, this.switchService];//, this.batteryService];
	}
};
