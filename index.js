var PythonShell = require('python-shell');

var Service, Characteristic;

module.exports = function(homebridge) {
	console.log("homebridge API version: " + homebridge.version);
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-programmableswitch", "ProgrammableSwitch", ProgrammableSwitch);
};


function ProgrammableSwitch(log, config) {
	this.log = log;
	this.switchService = new Service.Switch(this.name);

	this.statefull = config.statefull !== undefined ? config.statefull : true;
	this.log("Config Stateful", config.statefull);
	this.log("This Stateful", this.statefull);

	this.service = this.statefull === true ? new Service.StatefulProgrammableSwitch(this.name) : new Service.StatelessProgrammableSwitch(this.name);

	this.name = config.name || "A Programmable Switch";

	this.outputState = 0;

	//this.batteryService = new Service.BatteryService(this.name);
	
	//this.id = config.id || 0;
	this.pythonScriptPath = config.pythonScriptPath;
	this.pythonScriptName = config.pythonScriptName;

	this.minValue = config.minValue || 0;
	this.maxValue = config.maxValue || 1;
	//this.apiroute = config.apiroute;
	

	// Required Characteristics
  	//this.service.addCharacteristic(Characteristic.ProgrammableSwitchEvent);
  	/*this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
	.setProps({
	    maxValue: this.maxValue,
	    minValue: this.minValue,
	    minStep: 1
	});

	this.service.getCharacteristic(Characteristic.ProgrammableSwitchOutputState)
 	.setProps({
	    maxValue: this.maxValue,
	    minValue: this.minValue,
	    minStep: 1
	});*/

  	// Optional Characteristics
  	//this.addOptionalCharacteristic(Characteristic.Name);

	// you can OPTIONALLY create an information service if you wish to override
	// the default values for things like serial number, model, etc.
	this.informationService = new Service.AccessoryInformation();

	this.informationService
		.setCharacteristic(Characteristic.Manufacturer, config.manufacturer ?  config.manufacturer : "HTTP Manufacturer")
		.setCharacteristic(Characteristic.Model, config.model ? config.model : this.statefull ? "Stateful Model": "Stateless Model")
		.setCharacteristic(Characteristic.SerialNumber, config.serialnumber ? config.serialnumber : "HTTP Serial Number");
}

ProgrammableSwitch.prototype = {
	//Start
	identify: function(callback) {
		this.log("Identify requested on ", this.name);
		callback(null);
	},
	// Required
	getName: function(callback) {
		this.log("getName :", this.name);
		var error = null;
		callback(error, this.name);
	},
	getProgrammableSwitchEvent: function(callback) {
		this.log("getProgrammableSwitchEvent :", this.outputState);
		var error = null;
		callback(error, this.outputState);
	},
	setProgrammableSwitchEvent: function(value, callback) {
		this.log("setProgrammableSwitchEvent :", value);
		this.outputState = value;
	  	this.log("outputState is now %s", this.outputState);
	  	callback(null); // success

	},
	getProgrammableSwitchOutputState: function(callback) {
		this.log("getProgrammableSwitchOutputState :", this.outputState);
		
		var error = null;
		callback(error, this.outputState);
	},
	setProgrammableSwitchOutputState: function(value, callback) {
		this.log("setProgrammableSwitchOutputState :", value);

		var options = {};
		options.args = value;
		options.scriptPath = this.pythonScriptPath;

		//this.log("Redy to start" , options.scriptPath, this.pythonScriptName, options.args);
		
		PythonShell.run(this.pythonScriptName, options, function (err, results) {
		  	if (err) {
		  		this.log("Script Error", options.scriptPath, options.args, err);
		  	 	callback(err);
		  	} else {
				// results is an array consisting of messages collected during execution
			  	this.log('%j', results);
			  	this.outputState = value;

			  	this.log("outputState is now %s", this.outputState);
			  	
			  	callback(null); // success
		  	}
		}.bind(this));
		
	},
	getOn: function(callback) {
		this.log("getOn :", this.outputState, "(real value)" , this.outputState > 0 ? 1 : 0, "sent for homekit ON/OFF expectations");
		var error = null;
		callback(error, this.outputState > 0 ? 1 : 0);
	},
	setOn: function(value, callback) {
		this.log("setOn :", value);
		//could be separated but using only one behavior
		this.setProgrammableSwitchOutputState(value, callback);
	},

	getServices: function() {

		this.service
			.getCharacteristic(Characteristic.Name)
			.on('get', this.getName.bind(this));

		this.switchService
        	.getCharacteristic(Characteristic.On)
			.on('get', this.getOn.bind(this))
			.on('set', this.setOn.bind(this));

		this.service
			.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
			.on('get', this.getProgrammableSwitchEvent.bind(this))
			.on('set', this.setProgrammableSwitchEvent.bind(this));

		this.service
			.getCharacteristic(Characteristic.ProgrammableSwitchOutputState)
			.on('get', this.getProgrammableSwitchOutputState.bind(this))
			.on('set', this.setProgrammableSwitchOutputState.bind(this));
	
		return [this.informationService, this.service, this.switchService];//, this.batteryService];
	}
};
