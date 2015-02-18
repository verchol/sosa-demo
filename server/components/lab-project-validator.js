
var Q = require('q');
var _ = require('lodash');

//TODO validators should get a parameter saying if they should "warn" or "fail" by rejecting or resolving, and shouldn't determined this by themselves.

var combineValidators = require('./validator-combination-strategies');

var alwaysValidValidator = _.constant(Q([]));
alwaysValidValidator.description = 'always valid';


var validateRemoteLsGit = require('./git-ls-remote-validator');
var validateProjectUrl = combineValidators.any([validateRemoteLsGit]);


var fileExistsValidator = require('./file-exists-validator');
var jsonFilePropertyValidator = require('./property-validator').jsonFilePropertyValidator;


var workspaceDefaultlyRunnableValidators = [

  jsonFilePropertyValidator('./package.json', 'scripts.start', function notUndefined(value) { return _.isUndefined(value) ? 'value is undefined' : null; }),

  fileExistsValidator('./app.js'),
  fileExistsValidator('./server.js'),
  fileExistsValidator('./main.js'),

  fileExistsValidator('./server/app.js'),
  fileExistsValidator('./server/server.js'),
  fileExistsValidator('./server/main.js'),

  fileExistsValidator('./app/app.js'),
  fileExistsValidator('./app/server.js'),
  fileExistsValidator('./app/main.js'),

  fileExistsValidator('./js/app.js'),
  fileExistsValidator('./js/server.js'),
  fileExistsValidator('./js/main.js')
];
var validateProjectStructure = combineValidators.warn(combineValidators.all(workspaceDefaultlyRunnableValidators));


var validateProjectRuntime = alwaysValidValidator;


module.exports = {
  validateProjectUrl: validateProjectUrl,
  validateProjectStructure: validateProjectStructure,
  validateProjectRuntime: validateProjectRuntime
};
