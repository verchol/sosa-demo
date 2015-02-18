var cli = require("cli");

cli.parse({
	port   : ['p', 'port','number'],
	env    : ['e', 'environment (staging | development | production)', 'string', 'development'],
	api_url: ['u', 'orionexpress api url','string'],
	docker : ['d', 'docker ip','string'],
	mini   : ['m', 'client is minified (if set -m client is not minified)'],
	debug  : ['s', 'print to console and stop on error']
});

var cli_env;

cli.main(function(args, options) {

	cli_env = {
		env     : options.env
	};

	if(options.port)
		cli_env.port = options.port;

	if(options.api_url)
		cli_env.orion = {
			url : options.api_url
		};

	if(options.docker)
		cli_env.docker = {
			ip: options.docker
		};

	if(options.mini)
		cli_env.client_minified = '0';

	if(options.debug)
		cli_env.debug = true;


});

module.exports = cli_env;
