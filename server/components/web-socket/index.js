var EventEmitter =  require('events').EventEmitter;
var utils =         require('util');
var http =          require('http');
var socketio =      require('socket.io');
var express =       require('express');
var factoryBus =    require('../../api/factory/factoryBus');

function channel()
{
   EventEmitter.call(this);
}

utils.inherits(channel, EventEmitter);
function initApp(app)
{

}

channel.prototype.start = function(app){
  app.get('io').on('connection', function (socket) {

    channelIns.setup(socket);
    socket.on('clientEvent', function (data) {
      console.log("[server]" + JSON.stringify(data));
      channelIns.emit("serverEvent", data);
      if (data.command === "start")
          console.log("subscribied to git event " + data.git);
          factoryBus.on(data.git.url, function callback(d){
             if (d.phase === "completed"){
                  factoryBus.removeListener(data.git.url, callback);
                  console.log("removing listener");
                }
             socket.emit('serverEvent', d);
          });
    });
  });

}

channel.prototype.debugstart = function(port){

  var app = require('express')();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  app.use(express.static(__dirname));

  server.listen(port);

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    channelIns.setup(socket);
    socket.on('clientEvent', function (data) {
      console.log("[server]" + JSON.stringify(data));

      channelIns.emit("serverEvent", data);
    });
  });
}
channel.prototype.setup  = function(socket)
{
  this.socket = socket;
}
channel.prototype.emit = function(event , arg)
{
  //console.log("channel->emit", event);
  if (this.socket)
  this.socket.emit(event, arg);
}

var channelIns = new channel();
channelIns.on('serverEvent', function(arg){
  console.log("[" + new Date() + "channel]-passed with status" + arg.status);
})
channelIns.emit('serverEvent', {status:"test"});




module.exports = channelIns;
