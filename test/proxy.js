

  // load the controller's module
  var express = require('express');
  var logger = require('log4js');
  var http  = require("http");
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  var counter = 0;

  app = express();
  app.use(bodyParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  logger.configure({
    appenders: [
        { type: 'console',
          pattern : "[Log4JS]-MM-dd",
          category : 'console'}
         ]
    ,replaceConsole: true
});


  var httpProxy = require('http-proxy');
  var proxy = httpProxy.createProxyServer({target:"http://localhost:5555"});
  proxy.listen("9000", function(){
    console.log("proxy is up");
  })
  proxy.on('error', function (err, req, res) {
  console.log("err occured : " + err);
  res.writeHead(500, {
  'Content-Type': 'text/plain'
  });
  });
   var port = "5555";
   app.listen(port, function()
   {
     console.log("listening on port " + port);
   });

  app.post('/test',
     function (req, res) {
        console.log("in");
        console.log("body: " + JSON.stringify(req.body));
        counter++;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
        res.end();
        if (counter === 10)
           process.exit();

      console.log("out");

    });
