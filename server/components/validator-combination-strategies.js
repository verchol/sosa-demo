
var _ = require('lodash');
var Q = require('q');

function simultaneousBaseValidator (resolutionStrategy, validators) {

  var validatorInstance = function (/*invocationArgs...*/) {

    var invocationArgs = arguments;
    var argsString = JSON.stringify(_.toArray(invocationArgs));

    var resolvedValidatorsCount = 0;

    var validatorPromises = _.map(validators, function (validator) {

      console.log(resolutionStrategy.description + ': invoking validator ' + validator.description + ' with ' + argsString);
      var validatorPromise = validator.apply(_, invocationArgs);
      validatorPromise.finally(function notifyProgress() {
        resolvedValidatorsCount++;
        console.log(resolutionStrategy.description + ': validator ' + validator.description + ' finished with args ' + JSON.stringify(_.toArray(arguments)));
        deferred.notify(resolvedValidatorsCount + '/' + validators.length + ' validations completed');
      });

      return validatorPromise;
    });

    var deferred = Q.defer();

    Q.allSettled(validatorPromises).then(resolutionStrategy.bind(null, deferred));

    return deferred.promise;
  }
  validatorInstance.description = 'fail iff ' + resolutionStrategy.description  + ' of the following validators failed: ' + _.pluck(validators, 'description');

  return validatorInstance;
}


function anyFailedStrategy (deferred, promiseResults) {

  var failures = _.select(promiseResults, {state: 'rejected'});

  if (_.isEmpty(failures)) {

    deferred.resolve(null);
  }

  else {
    deferred.reject(_.select(_.pluck(failures, 'reason')));
  }
}
anyFailedStrategy.description = 'any';


function allFailedStrategy (deferred, promiseResults) {

  function combineStringArray (strings) {
    return _.reduce(strings, function (concatenatedString, reason) {
          return concatenatedString + '* ' + reason + '\r\n';
        }, '');
  }

  var passing = _.select(promiseResults, {state: 'fulfilled'});

  if (_.isEmpty(passing)) {
    var failures = promiseResults; //alias, if there are no passing then all promiseResults are failures.
    var errorString = _.select(_.pluck(promiseResults, 'reason'));
    deferred.reject('the following errors occurred simultaneously and that makes them invalid: \r\n' + errorString);
  }

  else {
    deferred.resolve(null);
  }
}
allFailedStrategy.description = 'all';

var any = simultaneousBaseValidator.bind(null, anyFailedStrategy);
var all = simultaneousBaseValidator.bind(null, allFailedStrategy);


function chainFactory(validators) {

  var validatorInstance = function chain(/*validatorArguments...*/) {

    var validatorArguments = arguments;
    var argsString = JSON.stringify(_.toArray(validatorArguments));

    var deferred = Q.defer();

    function handleValidator(validatorIndex) {

      var validator = validators[validatorIndex];

      console.log('chain: invoking validator ' + validator.description + ' with ' + argsString);

      var validatorPromise = validator.apply(_, validatorArguments);
      validatorPromise.finally(function notifyProgress() {
        console.log('chain: validator ' + validator.description + ' finished with args ' + JSON.stringify(_.toArray(arguments)));
        deferred.notify((validatorIndex + 1) + '/' + validators.length + ' validations completed');
      });

      validatorPromise.then(function () {

        if (validatorIndex >= validators.length) {
          deferred.resolve(null);
        }

        else {
          handleValidator(validatorIndex + 1);
        }
      },
      function (reason) {
        deferred.reject(reason);
      });
    }

    handleValidator(0);

    return deferred.promise;
  };
  validatorInstance.description = 'chain execute the following validators: ' + _.pluck(validators, 'description');

  return validatorInstance;
}

function warnFactory(validator) {

  var validatorInstance = function warn(/*validatorArguments...*/) {

    var validatorArguments = arguments;

    function logAndContinue(arg) {
      console.log('warn: validator ' + validator.description + ' finished with ' + JSON.stringify(_.toArray(arguments)));
      return arg;
    }

    return validator.apply(_, validatorArguments).then(logAndContinue, logAndContinue);
  };
  validatorInstance.description = 'warn on failure of ' + validator.description;

  return validatorInstance;
}

module.exports = {
  any: any,
  all: all,
  chain: chainFactory,
  warn: warnFactory
};
