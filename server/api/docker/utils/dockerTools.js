var path  = require('path');


var builder  = function(){

	function args(a) {
		this.args =  a;
		this.imageName = null;
		this.portList = [];
		this.volumeList = [];
		return this;
	}

	var setCurrentDir = function(path , args) {

		if (args)
			this.args = args;
		else
			args = this.args;

		if (!dir) return this;

		args.push('-w=');
		args.push(dir)
		return this;
	}

	var mapPort = function(port1 , port2, args) {

		if (args)
			this.args = args;
		else
			args = this.args;

		if (!port1 || !port2) return this;

		this.portList.push({port1:port1, port2:port2});

		var map =  port1.toString() + ":" + port2.toString();
		args.push('-p');
		args.push(map)
		return this;
	}

	var mapVolume = function(localPath, dockerPath, args) {
		if (args)
			this.args = args;
		else
			args = this.args;

		var l = path.resolve(localPath);
		var volumeInfo = {localPath:l, dockerPath:dockerPath};
		this.volumeList.push(volumeInfo);
		args.push('-v');
		args.push(l  + ":" + dockerPath);
		return this;
	};

	var image = function(i, args) {
		if (args)
			this.args = args;
		else
			args = this.args

		this.imageName = i;
		args.push(i);

		return this;
	}

	var print = function() {
		console.log(JSON.stringify(this.args));
	}

	var commandLine = function(line, args) {
		if (!line || line.length === 0) return this;

		if (args)
			this.args = args;
		else
			args = this.args;
		var ar = line.split(' ');
		ar.forEach(function(a)
		{
			args.push(a);
		});

		return this;
	}

	var param = function(param, args) {
		if (args)
			this.args = args;
		else
			args = this.args;

		args.push(param);

		return this;
	}

	var getContainerCreateOptions = function() {
		var Volumes = {};
		var Binds = [];
		var PortBindings = {};
		var ExposedPorts = {};

		for (var pos=0; pos<this.portList.length; pos++) {
			var portsInfo = this.portList[pos];
			var internalPort = portsInfo.port2 + '/tcp';
			var externalPort = [{ "HostIp": "0.0.0.0", "HostPort": portsInfo.port1}];

			PortBindings[internalPort] = externalPort;
			ExposedPorts[internalPort] = {};
		}
		for (var pos=0; pos<this.volumeList.length; pos++) {
			var volumeInfo = this.volumeList[pos];
			Volumes[volumeInfo.dockerPath] = {};
			var volumeMap = volumeInfo.localPath + ':' + volumeInfo.dockerPath;
			Binds.push(volumeMap);
		}

		var containerOptions = {
			"Image": this.imageName,
			"Volumes": Volumes,
			"ExposedPorts": ExposedPorts
		}

		if (this.envParams) {
			console.log("adding environment parameters: " + JSON.stringify(this.envParams));
		}
		containerOptions["Env"] = this.envParams;

		return containerOptions;
	};

	var getContainerStartPortBindings = function() {
		var Volumes = {};
		var Binds = [];
		var PortBindings = {};
		var ExposedPorts = {};

		for (var pos=0; pos<this.portList.length; pos++) {
			var portsInfo = this.portList[pos];
			var internalPort = portsInfo.port2 + '/tcp';
			var externalPort = [{ "HostIp": "0.0.0.0", "HostPort": ''+portsInfo.port1}];

			PortBindings[internalPort] = externalPort;
			ExposedPorts[internalPort] = {};
		}
		for (var pos=0; pos<this.volumeList.length; pos++) {
			var volumeInfo = this.volumeList[pos];
			Volumes[volumeInfo.dockerPath] = {};
			var volumeMap = volumeInfo.localPath + ':' + volumeInfo.dockerPath;
			Binds.push(volumeMap);
		}

		var startOptions = {
			"Binds": Binds,
			"PortBindings": PortBindings
		}

		return startOptions;
	};

	function envParam (key, value) {
		if (!this.envParams) {
			this.envParams = [];
		}
		this.envParams.push(key + '=' + value);
	}

	var r =  {
		mapPort : mapPort,
		mapVolume : mapVolume,
		args: args,
		commandLine : commandLine,
		image : image,
		param : param,
		print : print,
		getContainerCreateOptions : getContainerCreateOptions,
		getContainerStartPortBindings: getContainerStartPortBindings,
		envParam: envParam
	};

	return r;

};


module.exports  = builder();
