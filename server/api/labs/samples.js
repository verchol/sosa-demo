var categories = [
	{
		id: "nodeschool-promise-it-wont-hurt",
		name: "NodeSchool <br> promise-it-wont-hurt",
		logo: "nodeschool.png",
		desc: "Learn the basics of <br> node.js",
		color: "blue",
		active: true,
		class: "new"
	},
	{
		id: "nodeschool-async-you",
		name: "NodeSchool <br> async-you",
		logo: "nodeschool.png",
		desc: "Learn the basics of <br> node.js",
		color: "blue",
		active: true,
		class: "new"
	},
	{
		id: "nodeschool-count-to-6",
		name: "NodeSchool <br> count-to-6",
		logo: "nodeschool.png",
		desc: "Learn the basics of <br> node.js",
		color: "blue",
		active: true,
		class: "new"
	},
	{
		id: "nodeschool-learnyounode",
		name: "NodeSchool <br> learnyounode",
		logo: "nodeschool.png",
		desc: "Learn the basics of <br> node.js",
		color: "blue",
		active: true,
		class: "new"
	},
	{
		id: "nodeschool-javascripting",
		name: "NodeSchool <br> javascripting",
		logo: "nodeschool.png",
		desc: "Learn the basics of <br> JavaScript",
		color: "gray",
		active: true,
		class: "new"
	},
	{
		id: "node-mail",
		name: "mail <br> example",
		logo: "node-mail-logo.png",
		desc: "Sending email using nodemailer",
		color: "",
		active: true,
		class: ""
	},
	{
		id: "jade",
		name: "jade <br> template",
		logo: "jade.png",
		desc: "example of usage of jade with node.js",
		color: "blue",
		active: true,
		class: ""
	},
	{
		id: "express-angular",
		name: "express angular",
		logo: "express-angular-logo.png",
		desc: "Simple express and angular application",
		color: "gray",
		active: true,
		class: ""
	},
	{
		id: "socketio-example",
		name: "socket.io example",
		logo: "socketio-logo.png",
		desc: "Simple express and angular application",
		color: "",
		active: true,
		class: ""
	},
	{
		id: "express-angular-mongo",
		name: "express angular mongo",
		logo: "express-angular-mongo-logo.png",
		desc: "Simple express angular and mongo application",
		color: "blue",
		active: false,
		class: "soon"
	},
	{
		id:"",
		name: "heroku",
		logo: "heroku.png",
		desc: "An cloud platform as a service supporting node",
		color: "orange",
		active: false,
		class: "soon"
	},
	{
		id: "express-mongo",
		name: "express <br> mongo",
		logo: "express-mongo-logo.png",
		desc: "Simple express and mongo application",
		color: "",
		active: false,
		class: "soon"
	},
	{
		id:"",
		name: "testing",
		logo: "testing.png",
		desc: "Testing tools for javascript",
		color: "gray",
		active: false,
		class: "soon"
	},
	{
		id:"",
		name: "Sails",
		logo: "sails.png",
		desc: "Node.js framework",
		color: "yellow",
		active: false,
		class: "soon"
	},
	{
		id:"",
		name: "Total.js",
		logo: "total.png",
		desc: "Node.js framework",
		color: "",
		active: false,
		class: "soon"
	},
	{
		id:"",
		name: "Partial.js",
		logo: "partial.png",
		desc: "Node.js framework",
		color: "gray",
		active: false,
		class: "soon"
	}
];



var samples=[
	{
		"id": "express1",
		"name": "express example 1",
		"type": "1",
		"ready": true,
		"caption-text": "Web application framework for node",
		"caption-image": "express.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"",
			"link": ""
		},
		"tags":["nodejs","node","node.js","express","web"],
		"categories": ["express"]
	},
	{
		"id": "express2",
		"name": "express example 2",
		"type": "1",
		"ready": true,
		"caption-text": "Web application framework for node",
		"caption-image": "express.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"",
			"link": ""
		},
		"tags":["nodejs","node","node.js","express","web"],
		"categories": ["express"]
	},
	{
		"id": "mongo1",
		"name": "mongo example 1",
		"type": "1",
		"ready": false,
		"caption-text": "An open source NoSQL database",
		"caption-image": "mongo.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"",
			"link": ""
		},
		"tags":["nodejs","node","node.js","rest","mongo","mongodb","mongoose"],
		"categories": ["mongo"]
	},
	{
		"id": "mongo2",
		"name": "mongo example 2",
		"type": "1",
		"ready": false,
		"caption-text": "An open source NoSQL database",
		"caption-image": "mongo.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"",
			"link": ""
		},
		"tags":["nodejs","node","node.js","rest","mongo","mongodb","mongoose"],
		"categories": ["mongo"]
	},
	{
		"id": "mongo3",
		"name": "mongo example 3",
		"type": "1",
		"ready": false,
		"caption-text": "An open source NoSQL database",
		"caption-image": "mongo.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"",
			"link": ""
		},
		"tags":["nodejs","node","node.js","rest","mongo","mongodb","mongoose"],
		"categories": ["mongo"]
	},
	{
		"id": "heroku1",
		"name": "heroku example 1",
		"type": "1",
		"ready": false,
		"caption-text": "An cloud platform as a service supporting node",
		"caption-image": "heroku.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"",
			"link": ""
		},
		"tags":["cloud","cloud platform","heroku","server","node","nodejs","node.js"],
		"categories": ["heroku"]
	},
	{
		"id": "spyjs1",
		"name": "spyjs example",
		"type": "1",
		"ready": false,
		"caption-text": "spy-js is a tool for JavaScript developers that allows to simply debug/trace/profile JavaScript",
		"caption-image": "spyjs.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"spy-js/spy-js",
			"link": "https://github.com/spy-js/spy-js"
		},
		"tags":["spyjs","spy","js","javascript"],
		"categories": ["testing"]
	},
	{
		"id": "mocha1",
		"name": "mocha example",
		"type": "1",
		"ready": false,
		"caption-text": "Mocha is a simple, flexible, fun JavaScript test framework for node.js and the browser. ",
		"caption-image": "mocha.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"mochajs/mocha",
			"link": "https://github.com/mochajs/mocha"
		},
		"tags":["mocha","js","javascript","node","nodejs","node.js"],
		"categories": ["testing"]
	},
	{
		"id": "restify1",
		"name": "restify",
		"type": "1",
		"ready": false,
		"caption-text": "Restify is a node.js module built specifically to enable you to build correct REST web services.",
		"caption-image": "npmblank.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"mcavage/node-restify",
			"link": "https://github.com/mcavage/node-restify"
		},
		"tags":["rest","restify","node","nodejs","node.js"],
		"categories": []
	},
	{
		"id": "jade1",
		"name": "jade",
		"type": "1",
		"ready": false,
		"caption-text": "Jade is a high performance template engine heavily influenced by Haml and implemented with JavaScript for node.",
		"caption-image": "jade.png",
		"caption-links":
		{
			"id": 0,
			"type": "github",
			"name" :"jadejs/jade",
			"link": "https://github.com/jadejs/jade"
		},
		"tags":["jade","templates","node","nodejs","node.js","js","javascript"],
		"categories": []
	}
];

module.exports = {smaples :samples, categories : categories};
