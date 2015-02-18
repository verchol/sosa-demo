var log4js = require('log4js');
var morgan = require('morgan');
var path =   require('path');
var fs =     require('fs');

var logpath = path.resolve(process.cwd(), "./logs");
if (!fs.existsSync(logpath))
    fs.mkdir(logpath);
//console.log("log path is " + logpath);
//console.log("current dir is " + path.resolve(__dirname));
log4js.configure({
    appenders: [
        { type: 'console',
          pattern : "[Deploy]-yyyy-MM-dd",
          category : 'console'}
        ,
        {
            "type": "dateFile",
            "filename": logpath + "/server.log",
            "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": true,
            category: 'server'
        }

    ]
    ,replaceConsole: true
});

//var log = log4js.getLogger( 'config' );
//
//log.setLevel('ERROR');
//log.setLevel('ERROR');

var log = log4js.log = log4js.getLogger('console');
log.setLevel('TRACE');
var accessLog = log4js.accessLog = log4js.getLogger('access');
var serverLog = log4js.server = log4js.getLogger('server');
log4js.http  = morgan("dev",{
    "stream": {
        write: function(str) {
            console.log("[Deploy Http]" + str);
            serverLog.info(str.slice(0,str.length-1));
        }
    }
});



module.exports = log4js;
