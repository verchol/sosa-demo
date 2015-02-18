var express    = require('express');
var router     = express.Router();
var subscribe  = require('./submitService');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/upload', jsonParser, function(req, res) {
	var e = req.body;

	console.log('/upload');

  subscribe.upload(e ,function(err) {
		if (err) {
			res.status(500).end();
		} else {
			res.status(200).end();
		}
  });
});

router.post('/request', jsonParser, function(req, res) {
	var e = req.body;

	console.log('/request');

	subscribe.request(e, function(err) {
		if (err) {
			res.status(500).end();
		} else {
			res.status(200).end();
		}
  });
});

router.post('/comment', jsonParser, function(req, res) {
	var c = req.body;
	var p = req.params;

	console.log('insisde submit comment');

	if (req.body) {
		console.log('=======================')
		console.log('req has body');
	}

	console.log('=======================')
	console.log('comment: ' + JSON.stringify(c));
	console.log('=======================')
	console.log('params: ' + JSON.stringify(p));

	subscribe.comment(c, function(err) {
		if (err) {
			res.status(500).end();
		} else {
			res.status(200).end()
		}
	});
});

module.exports = router;
