var spawn = require('child_process').spawn;
var Q = require('q');

function validateRemoteLsGit(gitUrl) {

  var deferred = Q.defer();

  var gitLsRemoteProcess = spawn('git',['-c', 'core.askpass=true', 'ls-remote', gitUrl]);

  var errString = '';

  gitLsRemoteProcess.stderr.on('data', function (data) {
    errString = errString + data;
  });

  gitLsRemoteProcess.on('close', function (errCode) {
    if (errCode === 0) {
      deferred.resolve();
    }
    else {
      deferred.reject(errString);
    }
  });

  return deferred.promise;
}
validateRemoteLsGit.description = 'validate that remote git is accessible via \'git ls-remote\'';


module.exports = validateRemoteLsGit;
