var fs = require('fs');
var path = require('path');
var Q = require('q');

var _ = require("lodash");
_.mixin(require("lodash-deep"));

var combineValidators = require('./validator-combination-strategies');
var fileExistsValidator = require('./file-exists-validator');

//TODO model as validator: make object an input parameter of an internal function. the factory gets the property path and the errorsFunc.
function propertyValidator(object, propertyPath, getErrorsFunc) {

  var expectedValue = getErrorsFunc; //alias
  var propertyValue = _.deepGet(object, propertyPath);

  //if it's a value, wrap it with a function
  if (!_.isFunction(getErrorsFunc)) {
    getErrorsFunc = function (propertyValue) {
      return propertyValue === expectedValue ?
        'value doesn\'t match ' + expectedValue :
        null;
    };
  }

  var ret;

  //get errors for value, and if there are errors, prefix them with some additional data string
  var errors = getErrorsFunc(propertyValue);
  if (errors !== null) {
    errors = 'value of path ' + propertyPath + ' was ' + propertyValue + ' and failed validation: ' + errors;
    ret = Q.reject(errors);
  }
  else {
    ret = Q.resolve(null);
  }

  return ret;
}

function jsonFilePropertyValidatorFactory(relativePath, propertyPath, predicate) {

  var validatorInstance = function jsonFilePropertyValidator(basePath) {
    var file = path.resolve(basePath, relativePath);
    return Q.nfcall(fs.readFile, file).then(function (fileData) {
      var object;
      try {
        object = JSON.parse(fileData);
      }
      catch (err) {
        throw new Error(relativePath + ' does not contain valid json: ' + err.message);
      }
      return propertyValidator(object, propertyPath, predicate);
    });
  };
  validatorInstance.description = 'validate property ' + propertyPath + ' in json file ' + relativePath + ' matches ' +
  (_.isFunction(predicate) ?
    'predicate ' + predicate.name :
    predicate);

  return validatorInstance;
}

module.exports = {
  jsonFilePropertyValidator: function (relativePath /*validatorConfiguration...*/) {
    var validatorConfiguration = arguments;
    return combineValidators.chain([fileExistsValidator(relativePath), jsonFilePropertyValidatorFactory.apply(null, validatorConfiguration)]);
  }
};
