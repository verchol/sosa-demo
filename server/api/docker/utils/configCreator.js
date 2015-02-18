"use strict";


  var uuid =          require('node-uuid'),
  mkdirp =          	require('mkdirp'),
  path =			        require('path'),
  nconf =             require('nconf');


function creator(usersFolder)
{
  if (!usersFolder){
    usersFolder = '../users';
  }
  var users = path.resolve(usersFolder);

  function createConfig(props, meta, callback)
  {
        var user =  uuid.v1();
        var userFolder = path.resolve(process.cwd() , users , user);
        console.log("userFolder:" + userFolder);
        mkdirp(userFolder, function (err) {
            if (err) {
              console.error(err);
              callback.call(null, err, null);
              return;
            }
            else console.log('user folder ' + userFolder + " created");

            nconf.file(path.join(userFolder, "global.json"));
            nconf.set('global', props);
            nconf.save();
            var config = path.join(userFolder , "./config/launchConfigurations");

            //skip launch build configuraiton if not need
            if (meta && meta.noRun)
              return   callback.call(null, null, userFolder);
            mkdirp(config, function(err)
            {
              if (err)
              {
                console.error("cant' create config folder, err: " + err);
                callback.call(null, err, null);
                return;
              }
              callback.call(null, null, userFolder);

            });
        });

  }


  return {create:createConfig}
}

module.exports = creator;
