'use strict';

var path = require('path');


// Development specific configuration
// ==================================
module.exports = {

	port: process.env.PORT,

	ide: {
		url: 'http://ide.codefresh.io'
	},

	workspaces: {
		root: path.normalize(__dirname + '/../../../../workspaces')
	},

	docker : {
		ip : "codefresh.io",
		timeout: 60 * 60 // in second - one hour
	},

	client_minified: '1'

};
