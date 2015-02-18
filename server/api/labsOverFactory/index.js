var express = require('express');
var fs = require('fs');
var router = express.Router();
var fork =    require('child_process').fork;
var spawn =   require('child_process').spawn;
var nconf =   require('nconf');
var path =    require('path');
var git  = require('gift');
var request = require('request');

var config = require('../../config/environment');
var imageToRepoMapping = require('./imageToRepoMappings.json');
var logger =  require('../docker/utils/logger').server;
var reqf = require('../docker/dockerService');


function runDockerWithImage(image_id, cb, git_repo_url) {
  console.log("Running Environment - " + image_id);

  var execPath = path.resolve(__dirname + './../docker/');
  console.log(JSON.stringify(config.docker));
  var configFolder = path.resolve(execPath, "./config");
  var arguments = [
    '--usersFolder', configFolder,
    '--ip', config.docker.ip,
    '--timeout', config.docker.timeout || 10*60 /* default 10 minutes */,
    '--template', image_id
  ];
  if (git_repo_url) {
    arguments.push('--git_repo_url');
    arguments.push(git_repo_url);
  }

  var docker = fork('../docker/dockerCli', arguments, {cwd : execPath});

  docker.on('message', function(data) {
    cb(data);
  });
}

function runDockerOverFactory(cb, git_repo_url) {
  console.log('run docker over factory with ' + git_repo_url);
  request({
    url: config.ide.url + '/factory',
    qs: {git: git_repo_url },
    method: 'GET',
    json: true
  }, function (error, rsp) {
    if (!error) {
      var info = rsp.body;
      if (info && info.status === 'ok') {
        cb({url: info.factoryURL});
      }
    }
  });
}

var runDocker = function(image_id, cb, git_repo_url) {

  var git_repo_url = git_repo_url || imageToRepoMapping[image_id];
  if (git_repo_url) {
    runDockerOverFactory(cb, git_repo_url);
  }
  else {
    runDockerWithImage(image_id, cb, git_repo_url);
  }

};

/* GET home page. */
// http://codefresh.io/labs/api/env/express-mongo


router.get('/:image_id', function(req, res) {

  var image_id = req.params.image_id || "default";
  var save_data = {
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    example: image_id,
    time: new Date().toString()
  };

  runDocker(image_id, function(data) {
    // api logs analytics:
    console.log("~~~~~~ increasing counter ~~~~~~");
    console.log(save_data);
    //if(save_data.ip == "127.0.0.1") {
    if(false) {
      console.log("Not saved, local call");
    }
    else {
      reqf.saveApiCall(save_data,function(){});
    }
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    //////////////////////

    res.json({url: data.url});
    //res.redirect(data.url);
  },
  req.query.git_repo_url);
});

router.get('/', function(req, res) {

  var git_repo_url = req.query.git_repo_url;

  if (!git_repo_url) {
    // TODO - return error
    return;
  }

  createInstance(git_repo_url, function(err, url) {
    if (err) {
      // TODO - return error
      return;
    }

    res.redirect(url);
  })
});

router.post('/', function(req, res)
{
  var image_id = req.body.id || "default";
  runDocker(image_id, function(data) {
    res.json({url:data.url});
  });
});


module.exports = router;
