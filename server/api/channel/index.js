'use strict';

var express = require('express');
function channel(app)
{
  var c = require('./../../components/web-socket');
  c.start(app);
}

module.exports = channel;
