module.exports = {

	test: {
		image : 'codefresh/full-stack',
		//command : "/bin/bash /config/start.sh",
		ports:['8081', '9090', '2222', '5555']
	},
	default : {
		image : 'codefresh/express-angular',
		ports: ['8081', '9090', '2222', '5555']
	},
	"express-mongo" : {
		image : 'codefresh/express-mongo',
		ports: ['8081', '9090', '2222', '5555']
	},
	"express-angular" : {
		image : 'codefresh/express-angular',
		ports: ['8081', '9090', '2222', '5555']
	},
	"express-angular-mongo" : {
		image : 'codefresh/express-angular-mongo',
		ports: ['8081', '9090', '2222', '5555']
	},
	angular : {
		image : 'codefresh/staging',
		ports: ['8081', '9090', '2222', '5555']
	},
	express : {
		image : 'codefresh/staging',
		ports: ['8081', '9090', '2222', '5555']
	},
	staging : {
		image : 'codefresh/staging',
		command: 'node ./modules/fresh-launcher/fcli.js --port 5678 --workspace /workspace --admin 2222',
		ports: ['5678', '8081', '2222', '5555']
	},
	orion :{
		image : 'codefresh/full-stack',
		command: 'node /orion/org.eclipse.orion.client/modules/orionode/server --port 8081 --workspace /example',
		ports: ['8081', '9090', '2222', '5555']
	},
	ide : {
		image : 'codefresh/orion-express',
		command: 'node ./modules/fresh-launcher/fcli.js --port 5678 --workspace /workspace',
		ports: ['5678', '8081', '8081']
	},
	terminal :{
		image : 'codefresh/terminal',
		command : 'node ./example/ --dir ../workspace',
		ports: ['8080']
	},
	mail:{
		image : 'codefresh/mail',
		ports: ['8081', '9090', '2222', '5555']
	},
	jade:{
		image : 'codefresh/jade-example',
		ports: ['8081', '9090', '2222', '5555']
	},
	"nodeschool-javascripting" :{
		image : 'codefresh/nodeschool-javascripting',
		ports: ['8081', '9090', '2222', '5555'],
		meta : {"noRun":"true"}
	},
	"nodeschool-learnyounode" :{
		image : 'codefresh/nodeschool-learnyounode',
		ports: ['8081', '9090', '2222', '5555'],
		meta : {"noRun":"true"}
	}
};
