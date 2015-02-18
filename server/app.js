/**
 * Main application file
 */

'use strict';

// set root directory path as global:
var path = require('path');
global.appRoot = path.resolve(__dirname);

// add cli options
require('./config/cli');

var express = require('express');
var config = require('./config/environment');


if(config.debug) {
	console.log("+++++++++++++++~~~~~~~~~ config ~~~~~~~~~~+++++++++++++++++");
	console.log(config);
	console.log("+++++++++++++++~~~~~~~~~~~~~~~~~~~~~~~~~~~+++++++++++++++++");
}
else {
	process.on('uncaughtException', console.error.bind(console));
}

// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.set('io', io);





require('./config/express')(app);
require('./routes')(app);



// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode, client is%s minified, docker ip is "%s", orionexpress api: %s', config.port, app.get('env'), (config.client_minified == "1" ? "" : " not"), config.docker.ip, config.ide.url);
});

// Expose app
exports = module.exports = app;
