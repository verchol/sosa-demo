'use strict';

var path = require('path');


// Development specific configuration
// ==================================
module.exports = {

	port: 9000,

	ide: {
		url: 'http://stagingide.codefresh.io'
	},

	workspaces: {
		root: path.normalize(__dirname + '/../../../../workspaces')
	},

	docker : {
		ip : "staging.codefresh.io",
		timeout: 60 * 60 // in second - one hour
	},

	client_minified: '1'

};
