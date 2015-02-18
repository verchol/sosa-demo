'use strict';

var path = require('path');


// Development specific configuration
// ==================================
module.exports = {

	port: 9000,

	ide: {
		url: 'http://54.153.22.162:8081'
	},

	workspaces: {
		root: path.normalize(__dirname + '/../../../../workspaces')
	},

	docker : {
		ip : "localhost",
		timeout: 60 * 60 // in second - one hour
	},

	client_minified: '0'

};
