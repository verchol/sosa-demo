'use strict';

var express = require('express');
var controller = require('./subscribe.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.subscribe)
module.exports = router;
