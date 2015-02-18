#!/usr/bin/env node
//192.168.59.103:2376
//http://localhost:9000/labs/api/env?id=test
var cli   		= require("cli");
var spawn 		= require('child_process').spawn;
var dockerTools	= require('./utils/dockerTools');
var path 		= require('path');
var http 		= require('http');
var Docker = require('dockerode');

var templates = require("./templates");

var nconf =    require('nconf');
var fs =      require('fs');
cli.parse({
	openInBrowser : ['s', 'run'],
	interactive:    ['i', 'run in interactive mode'],
	example:        ['e', 'example', 'string', 'express'],
	usersFolder :   ['t', 'folder to keep users configuration', 'string'],
	verbose :       ['v', 'run in verbose mode', 'false'],
	terminal:       ['', 'run terminal'],
	template :      ['' , 'orion arguments' , 'string', 'ide'],
	timeout :      	['' , 'timeout' , 'string', -1],
	deployArgs : 	['ar' , 'local arguments' , 'string'],
	debug :      	['', 'debug', 'string'],
	runProcess : 	['' , 'run process name ', 'node'],
	port :       	['', 'port', 'string', 'auto'],
	adminPort : 	['', 'admin port', 'number', 2222],
	admin :      	['', 'use admin console', true],
	project :    	['', 'project name is ', 'string', '*'],
	ip      :    	['', 'ip of running machine ', 'string', '127.0.0.1'],
	git_repo_url :  ['git', 'git repo url', 'url'],
	log:         	[false, 'log']
});

var port = parseInt(nconf.get('port'));
cli.main(function(args, options) {

	var config = require('./utils/configCreator')(options.usersFolder + "/users");
	var fileUtils = require('./utils/fileUtils')(options.usersFolder);

	if (options.verbose){
		this.debug(JSON.stringify(options));
	}

	if (options.terminal)
	{
		options.interactive = true;
	}


	var net  = require('net');
	var server = net.createServer();
	var dockerUrl = {}
	dockerUrl.host = options.ip;
	var dockerArgs = ["run"], dockerTemplate = templates[0];

	if (options.template)
	{

		// default template settings:
		var dockerTemplate = {
			image : 'codefresh/' + options.template,
			ports:['8081', '9090', '2222', '5555']
		};

		// if defined in the templates array take the specific definition:
		if(templates[options.template]) {
			dockerTemplate = templates[options.template];
		}

		console.log(JSON.stringify(dockerTemplate));
	}
	if (options.nodocker)
	{
		server = {}
		server.listen = function(callback)
		{
			callback.call(null);
		}
		server.address = function()
		{
			return 5678;
		}
	}

	var notifyReady = function() {
		//dockerUrl.url = "http://" + dockerUrl.host + ":" + dockerUrl.port + "?ex=" + options.template;
		dockerUrl.url = "http://" + dockerUrl.host + ":" + dockerUrl.port + "?ws=example";
		console.log("[url]" + "http://" + dockerUrl.host + ":" + dockerUrl.port);
		if (options.openInBrowser)
			spawn('open', ["http://" + dockerUrl.host + ":" + dockerUrl.port]);

		if (process.send) {
			process.send(dockerUrl);
		}

	}

	var requestCounter = 0;
	var maxCounter = 30;

	var retryServerRunner = function() {
		requestCounter++;
		if (requestCounter > maxCounter) {
			console.error('  Error: Looks like something is wrong, server is not ready after ' + maxCounter +' sec.');
		} else {
			console.log('  Error: Server not running. testing again in 1 sec.');
			setTimeout(validateServerRunning, 1000);
		}
	}

	var validateServerRunning = function() {
		console.log('Validating server is running');
		var statusUrl = "http://" + dockerUrl.host + ":" + dockerUrl.port + "/status.json";
		console.log('  GET: ' + statusUrl);
		http.get(statusUrl, function(response) {

			var body = '';
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {

				// Data reception is done, do whatever with it!
				var rc = JSON.parse(body);
				if (rc.status == "ready") {
					console.log('  Server is ready!!!');
					notifyReady();
				} else {
					console.error("  Error: looks like we have issue, let's try again");
					retryServerRunner();
				}
			});
			response.on('error', function(e) {
				console.error('  Error: ' + e);
				retryServerRunner();
			});
		}).on('error', function(e) {
			console.error('  Error: ' + e);
			retryServerRunner();
		});
	}

	var startContainer = function() {
		var containerOptions = dockerTools.getContainerCreateOptions();

		var docker = new Docker();

		console.log('Starting new docker container with the following info: ' + JSON.stringify(containerOptions, null, 2));
		docker.createContainer(containerOptions, function(err, container) {
			if (err) {
				return console.error('Error: failed to create container: ' + JSON.stringify(err));
			}

			console.log('>> Container Created');

			container.attach({
				stream: true,
				stdout: true,
				stderr: true,
				tty: true
			}, function(err, stream) {
				if (err) {
					return console.error('Error: failed to attach to container: ' + JSON.stringify(err));
				}
				console.log('>> Container Attached');

				stream.pipe(process.stdout);

				container.start(
						dockerTools.getContainerStartPortBindings(), function(err, data) {

					if (err) {
						return console.error('Error: failed to start container: ' + JSON.stringify(err));
					}

					console.log('>> Container Started');

					// We got container running and ready
					// notify the parent process
					validateServerRunning();

					if (options.timeout > 0) {
						console.log('>> Going to stop docker in ' + options.timeout + ' sec.');
						setTimeout(function() {
							console.log('>> Stopping container');

							container.stop(function(err, data) {
								if (err) {
									return console.error('Error: failed to stop container: ' + JSON.stringify(err));
								}
								console.log('>> Container Stopped');

								container.remove(function(err, data) {
									if (err) {
										return console.error('Error: failed to remove container: ' + JSON.stringify(err));
									}
									console.log('>> Container Removed');

									process.exit(0);

								});
							});
						}, options.timeout * 1000);
					}

				});
			});
		});
	};

	server.listen(0, function() {
		var address = server.address(),
				port  = address.port  + 2;
		console.log("port is " + address.port);
		dockerUrl.port = address.port + 1;
    var meta = dockerTemplate.meta;

		config.create({hostname:dockerUrl.host, terminalPort:address.port + 2}, meta, function(err, userFolder) {
			//build workspace
			var workspace = fileUtils.copy(userFolder, options.example);
			var startTemplate = path.resolve(options.usersFolder, "./shared/start.sh");
			var configFolder = path.resolve(workspace ,"../config");
			fileUtils.initStart(startTemplate , configFolder);

			var launchUrl = "http://" + dockerUrl.host + ":" + (address.port + 2);
			if (!meta || !meta.noRun)
			fileUtils.updateLaunch({
				url : launchUrl,
				workspace : configFolder});

			if (err){
				throw "missing user folder " + err;
				return;
			}

			dockerTools.args(dockerArgs)
					.mapVolume(userFolder , '/example')
					.mapVolume(configFolder , '/config')
					.mapPort(address.port + 1, dockerTemplate.ports[0])
					.mapPort(address.port + 2, dockerTemplate.ports[1])
					.mapPort(address.port + 3 , 2222)
					.mapPort(address.port + 4, dockerTemplate.ports[3])
			;

			if (options.terminal)
				dockerTools.param("-t").param("-i");

			dockerTools.image(dockerTemplate.image);


			dockerTools.envParam("NODE_ENV", "production");

			if (options.git_repo_url) {
				dockerTools.envParam("GIT_REPOSITORY", options.git_repo_url);
			}

			if (options.terminal){
				dockerTools.commandLine('/bin/bash');
			}else{
				dockerTools.commandLine(dockerTemplate.command);
			}

			startContainer();
/*
			var exec = {env: process.env, cwd :".", stdio:'pipe'}
			if (options.interactive){
				exec.stdio = 'inherit';
			}
			var docker = spawn("docker", dockerArgs, exec);

			if (!options.interactive)
			{

				docker.stdout.once('data', function(data)
				{
					//console.log("[output]" + data);
					console.log("docker is up");
					validateServerRunning();

				});
				docker.stderr.on('data', function(data)
				{
					console.log("[output]" + data);
				});

			}

			if (options.timeout > 0) {
				setTimeout(function() {
					console.log('Got timeout after ' + options.timeout + ' seconds - Going to stop docker and cli');

					// stop docker
					docker.kill('SIGKILL');

					// stop this current cli
					process.exit(0);
				}, options.timeout*1000);
			}
*/
		});

	});

});
/*
 var Docker = require('dockerode');
 var docker = new Docker({protocol:'tcp',host: '192.168.59.103', port: 2376});
 //var docker = new Docker({socketPath: '/var/run/docker.sock'});
 console.log("starting")
 docker.createContainer({Image: 'centos', Cmd: ['/bin/bash'], name: 'ubuntu-test'}, function (err, container) {
 if (!err)
 container.start(function (err, data) {
 console.log(data);
 });

 console.log(err);
 });
 */
