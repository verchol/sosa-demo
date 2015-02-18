var EventEmitter = require('events').EventEmitter;
var util = require('util');
var factoryEventBus = function(){
  EventEmitter.call(this);
}

util.inherits(factoryEventBus, EventEmitter);

var factoryBus = new factoryEventBus();

module.exports = factoryBus;
