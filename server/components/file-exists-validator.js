var path  = require('path');
var fs    = require('fs');
var Q     = require('q');

var _ = require('lodash');

function fileExistsValidatorFactory(relativePath) {

  var validatorInstance = function fileExistsValidator(basePath) {

    var deferred = Q.defer();

    var fullPath = path.resolve(basePath, relativePath);
    fs.exists(fullPath, function (exists) {
      if (exists) {
        deferred.resolve(null);
      }
      else {
        deferred.reject('path ' + relativePath + ' does not exist');
      }
    });

    return deferred.promise;

  };

  validatorInstance.description = 'validate that file ' + relativePath + ' exists';

  return validatorInstance;
}

module.exports = fileExistsValidatorFactory;
