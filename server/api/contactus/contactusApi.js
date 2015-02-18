var express = require('express');
var router = express.Router();
var reqf = require('./contactusService');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var nodemailer = require('nodemailer');


router.post('/contactus', jsonParser, function(req, res){
	console.log("submit contactus");
	if (req.body)
		console.log("req has body");
	var c = req.body;
	console.log("=======================")
	var p = req.params;
	console.log("=======================")
	console.log("comment: " + JSON.stringify(c));
	console.log("=======================")
	console.log("params: " + JSON.stringify(p));

	reqf.contactus(c ,function(err)
	{
		if (err)
			res.send(500);
		else {


			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'contact@codefresh.io',
					pass: 'contact100'
				}
			});


			var body = '<p><b>From:</b> ' + req.body.name + ' (<a href="mailto:' + req.body.email + '">' + req.body.email + '</a>)</p>' +
						'<p><b>Message:</b> ' + req.body.message + '</p>';


			var mailOptions = {
				from: 'Codefresh info <info@codefresh.io>', // sender address
				to: 'aviad@codefresh.io, oleg@codefresh.io', // list of receivers
				subject: 'New contact form', // Subject line
				text: 'Palin text here', // plaintext body
				html: body

			};


			console.log("sending emails.....");

			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
				}else{
					console.log('Message sent: ' + info.response);
				}
			});

			res.send (200);
		}

	});
});

module.exports = router;
