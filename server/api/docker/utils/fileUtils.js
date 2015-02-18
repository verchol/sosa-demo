"use strict";
var sh =    require('shelljs/global');
var path =  require('path');
var nconf = require('nconf');

function fileUtils(usersFolder)
{
	if (!usersFolder){
		usersFolder = '../users';
	}
	var templates = path.resolve(usersFolder, './templates/');
	var config = path.resolve(usersFolder, './config/');
	var copyExample = function(target, example)
	{

		var from = path.resolve(templates, example);
		console.log(from);
		cp('-R', from, target);

		return  path.resolve(target , example);

	}

	function copyStart(from ,target)
	{
		if (!from)
			from = config;

		console.log("from : " + from);
		console.log("target : " + target);

		console.log(from);
		cp('-R', from, target);

		return  target;
	}


	var updateLaunchConfig = function(options)
	{
		var fs = require('fs');
		var workspace = options.workspace;
		var deployUrl = options.url;
		var launchDir = path.join(workspace , './launchConfigurations');
		var launchConfig = path.join(workspace , "./launchConfigurations/node.launch");
		console.log("lanch path " + launchConfig);

		var data = {
			"Name": "Run Example",
			"ServiceId":"io.codefresh.orion.client.node.runner",
			"Params": {
				"Name" : "Run",
				"Target" : {
					"Cmd": ["node","app.js"],
					"Module": "app.js",
					"Space": "Node"
				}
			},
			"Url": deployUrl,
			"Path":"",
			"Type":"NodeRunner"
		}
		fs.writeFileSync(launchConfig, JSON.stringify(data,null,2));
		console.log("url is" + nconf.get('Url'));

	}

	var testCopyStart = function()
	{
		console.log("testing ...");
		var testFolder = path.resolve(__dirname);
		var usersFolder = path.resolve(__dirname, "../config");
		var from = path.resolve(usersFolder, './shared/');
		var target = path.resolve(usersFolder, ".././test");

		console.log("from : " + from);
		console.log("target : " + target);
		copyStart(from, target);
		console.log("userFolder is " + usersFolder);
		console.log("tested!");

	}

//testCopyStart();



	return {copy : copyExample,
		initStart : copyStart,
		updateLaunch : updateLaunchConfig
	};

}

fileUtils();
module.exports = fileUtils;
