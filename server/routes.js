/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var httpProxy = require('http-proxy');
var config = require('./config/environment');
//var labs = require('../../dockerServer');

var proxy = httpProxy.createProxyServer({});
proxy.on('error', function (err, req, res) {
	console.log("err occured : " + err);
	res.writeHead(500, {
		'Content-Type': 'text/plain'
	});
});

var allowCrossDomain = function (req, res, next) {
	console.log("allow CRPSS Domain");
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Orion-Version, X-Requested-With');
	next();
};


module.exports = function (app) {
	// Insert routes below
	app.use(allowCrossDomain);
	app.use('/api/things', require('./api/thing'));
	app.use('/subscribe', require('./api/subscribe'));
	app.use('/reqf', require('./api/contactus'));
	app.use('/labs/api/submit', require('./api/submit'));
	app.use('/labs/api', require('./api/labs'));
	//app.use('/labs/api/env', require('./api/docker'));
	//app.use('/labs/api/env_pr', require('./api/docker'));
	app.use('/labs/api/env_pr', require('./api/labsOverFactory'));
	app.use('/factory/api', require('./api/factory'));
	require('./api/channel')(app);


	// All undefined asset or api routes should return a 404
	app.route('/:url(api|auth|components|app|bower_components|assets)/*')
		.get(errors[404]);

	app.route('/env_var')
		.get(function (req, res) {
			res.send({
				ide: config.ide
			});
		});

	// All other routes should redirect to the index.html
	app.route('/*')
		.get(function (req, res) {
			res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
		});
};
