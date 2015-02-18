var channel = require('./index');
channel.start(1111);
var socket = require('socket.io-client')('http://localhost:1111');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.emit('testEvent', {status:"works"});
socket.on('disconnect', function(){});
