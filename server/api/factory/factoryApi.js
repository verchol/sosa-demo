var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('node-uuid');
var shortId = require('shortid');
var git  = require('gift');
var Q = require('q');
var path = require('path');
var factoryBus = require('./factoryBus');


var config = require('../../config/environment');
var factoryService = require('./factoryService');

var validator = require(global.appRoot + '/components/lab-project-validator');

var factoryAPIHelper = {
	// wrappers for general git validators:
	validators: {
		validateProjectUrl: function(session) {
			var deferred = Q.defer();
			validator.validateProjectUrl(session.git_url).then(function(warnings){
				session.warnings = session.warnings.concat(warnings);

				factoryBus.emit(session.git_url ,{
					command:"statusChanged",
					url : session.git_url,
					phase : "in progress",
					actions: [
						{
							stage: 0,
							key: 'status',
							value: 'ready'
						}
					]
				});

				deferred.resolve(session);
			})
			.catch(function (error) {
				factoryBus.emit(session.git_url, {status:"validation", error: true});
				deferred.reject(error);
			});
			return deferred.promise;
		},
		validateProjectStructure: function(session) {
			var deferred = Q.defer();
			validator.validateProjectStructure(session.clone_data.workspacePath).then(function(warnings){
				session.warnings = session.warnings.concat(warnings);
				deferred.resolve(session);
			})
				.catch(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		},
		validateProjectRuntime: function(session) {
			var deferred = Q.defer();
			validator.validateProjectRuntime(session.clone_data.workspacePath).then(function(warnings){
				session.warnings = session.warnings.concat(warnings);
				deferred.resolve(session);
			})
				.catch(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		}
	},

	createFactory: function(git_url, req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		if(git_url) {
			factoryAPIHelper.create(git_url, ip)
				.then(function (session) {
					var url = req.protocol + '://' + req.get('host') + '/factory/api/workspace/' + session.factory_id;
					res.send({
						status: "success",
						url: url,
						branches: session.clone_data.branches,
						warnings: session.warnings
					});
				})
				.catch(function (error) {
					res.status(400).send({status: "failed", error: error});
				});
		}
		else
			res.send({status: "failed"});
	},

	create: function(git_url, ip) {
		var global_create_deferred = Q.defer();
		console.log("factory create call from " + ip + ", starting validation for git: " + git_url);

		var session = {
			ip: ip,
			git_url: git_url,
			factory_id: false,
			clone_data: false,
			warnings: []
		};


		// run validator #1
		factoryAPIHelper.validators.validateProjectUrl(session)

		// if validation #1 passed, clone repo
		.then(function(session){

				var deferred = Q.defer();

				//check if factory exists:
				factoryService.checkIfGitExists(session.git_url)
					.then(function() {
						factoryBus.emit(git_url ,{
							command:"statusChanged",
							url : git_url,
							phase : "in progress",
							actions: [
								{
									stage: 1,
									key: 'status',
									value: 'in-progress'
								}
							]
						});

						return session.git_url;
					})
					.catch(function (factory_id) {
						var ex_deferred = Q.defer();
						// if git exists in factory DB, populate session and stop create process.
						console.log(factory_id);
						session.factory_id = factory_id;
						session.warnings = session.warnings.concat(['factory for git url already exists!']);

						factoryBus.emit(session.git_url ,{
							command:"statusChanged",
							url : session.git_url,
							phase : "in progress",
							actions: [
								{
									stage: 1,
									key: 'status',
									value: 'warning'
								},
								{
									stage: 2,
									key: 'status',
									value: 'in-line'
								},
								{
									stage: 3,
									key: 'status',
									value: 'in-line'
								}
							]
						});

						global_create_deferred.resolve(session);
						ex_deferred.reject("factory for git url already exists!");
						return ex_deferred.promise;
					})
					.then(factoryAPIHelper.clone)
					.then(function(clone_data){
						session.clone_data = clone_data;
						session.factory_id = clone_data.workspaceId;

						factoryBus.emit(session.git_url ,{
							command:"statusChanged",
							url : session.git_url,
							phase : "in progress",
							actions: [
								{
									stage: 1,
									key: 'status',
									value: 'ready'
								},
								{
									stage: 2,
									key: 'status',
									value: 'in-progress'
								}

							]
						});

						deferred.resolve(session);
					})
					.catch(function (err) {

						factoryBus.emit(session.git_url ,{
							command:"statusChanged",
							url : session.git_url,
							phase : "in progress",
							actions: [
								{
									stage: 1,
									key: 'status',
									value: 'warning'
								},
								{
									stage: 2,
									key: 'status',
									value: 'in-line'
								},
								{
									stage: 3,
									key: 'status',
									value: 'in-line'
								}
							]
						});

						global_create_deferred.reject([err]);
					});
				//////////////////////////

				return deferred.promise;
		})

		// repo in files validators:
		.then(factoryAPIHelper.validators.validateProjectStructure)

		.then(factoryAPIHelper.validators.validateProjectRuntime)

		// resolve and return url || failed and destroy local directory
		.then(function (session){
			console.log("validation complete!");
			if(session.warnings.length > 0) {
				console.warn("warnings: ");
				console.warn(session.warnings);
			}

			factoryBus.emit(session.git_url ,{
				command:"statusChanged",
				url : session.git_url,
				phase : "in progress",
				actions: [
					{
						stage: 2,
						key: 'status',
						value: 'ready'
					},
					{
						stage: 3,
						key: 'status',
						value: 'ready'
					}

				]
			});

			factoryService.saveFactory(session);

			if(session.clone_data) {
				factoryAPIHelper.destroyDir(session.clone_data.workspacePath,function(){

				});
			}


			console.log("workspace url: " + session.clone_data.url);

			factoryBus.emit(session.git_url ,
			{command:"statusChanged", url : session.git_url, phase : "completed"});
			global_create_deferred.resolve(session);
			//res.send({status: "success", url: session.clone_data.url, warnings: session.warnings});

		})
		.catch(function (error) {
			console.error("validation failed!");
			console.error(error);

			factoryBus.emit(session.git_url ,{
				command:"statusChanged",
				url : session.git_url,
				phase : "in progress",
				actions: [
					{
						stage: 0,
						key: 'status',
						value: 'aborted'
					},
					{
						stage: 1,
						key: 'status',
						value: 'in-line'
					},
					{
						stage: 2,
						key: 'status',
						value: 'in-line'
					},
					{
						stage: 3,
						key: 'status',
						value: 'in-line'
					}

				]
			});
			// destroy clone if failed:
			if(session.clone_data) {
				factoryAPIHelper.destroyDir(session.clone_data.workspacePath,function(){

				});
			}
			/////////////////
			global_create_deferred.reject(error);
			//res.status(400).send({status: "failed", error: error});

		})
		.done();

		return global_create_deferred.promise;
	},

	createDir: function(path, callback) {
		fs.exists(path, function(exists) {
			if (!exists) {
				fs.mkdir(path, callback);
			} else {
				callback();
			}
		});
	},

	clone: function(git_url) {
		console.log("start cloning git url");

		var deferred = Q.defer();
		var workspaces = config.workspaces.root;

		factoryAPIHelper.createDir(workspaces, function(err) {
			if (err) {
				console.error("create workspaces dir failed");
				return deferred.reject(err);
			}


			// TODO - need to find a better name
			//var workspaceId = 'ws-' + new Date().getTime();
			//var workspaceId = uuid.v4(); //
			var workspaceId = shortId.generate();
			var workspacePath = path.join(workspaces, workspaceId);

			factoryAPIHelper.createDir(workspacePath, function(err) {
				if (err) {
					console.error("create factory dir failed");
					return deferred.reject(err);
				}


				// clone git repo
				git.clone(git_url, workspacePath, function(err, repo) {
					if (err) {
						console.error("git clone failed");
						return deferred.reject(err);
					}

					console.log("cloning git succeeded");
					var url = config.ide.url + '?ws=' + workspaceId;
					//var url = '/?ws=' + workspaceId;
					//deferred.reject('bla');

					// get more data:
					var branches = [];

					git.init(workspacePath, true, function(err, _repo){
						var repo = _repo;

						repo.branches(function(err, heads){
							for(i in heads) {
								branches.push(heads[i].name);
							}

							deferred.resolve({
								workspaceId: workspaceId,
								workspacePath: workspacePath,
								url: url,
								branches: branches
							});
						});



					});

					console.log(branches);
					/////////////////



				});
			});

		});

		return deferred.promise;
	},

	destroyDir: function(path, callback) {
		fs.exists(path, function(exists) {
			if (exists) {
				console.log("destroying dir " + path);

				var deleteFolderRecursive = function(path) {
					if( fs.existsSync(path) ) {
						fs.readdirSync(path).forEach(function(file,index){
							var curPath = path + "/" + file;
							if(fs.lstatSync(curPath).isDirectory()) { // recurse
								deleteFolderRecursive(curPath);
							} else { // delete file
								fs.unlinkSync(curPath);
							}
						});
						fs.rmdirSync(path);
					}
				};

				deleteFolderRecursive(path);
				callback();

			} else {
				callback();
			}
		});
	},

	getWorkSpace: function(factory_id, req, res) {
		var deferred = Q.defer();
		console.log("get factory workspace for factory: " + factory_id);
		factoryService.checkIfFactoryExists(factory_id)
			.then(function(factory_data){
				console.log("Factory exists, let's Rock");
				factoryAPIHelper.clone(factory_data.git_url)
					.then(function(clone_data){
						deferred.resolve(clone_data.url);
					})
					.catch(function (error) {
						deferred.reject(error)
					})

			})
			.catch(function (error) {
				deferred.reject(error)
			})
			.done();


		return deferred.promise;
	}

};


router.get('/create', function(req, res) {
	var git_url = req.query.u || false;

	factoryAPIHelper.createFactory(git_url,req, res);


});

router.post('/create', function(req, res) {

	var git_url = req.body.u || false;

	factoryAPIHelper.createFactory(git_url,req, res);

});

router.get('/workspace/:factory_id', function(req, res) {
	if(!req.params.factory_id) {
		res.status(400).send("Please provide factory ID");
	}
	else {
		var factory_id = req.params.factory_id;
		//console.log(factory_id);
		factoryAPIHelper.getWorkSpace(factory_id, req, res).
			then(function(url){
				res.redirect(url);
			})
			.catch(function (error) {
				res.status(400).send("Something goes wrong...");
			})
			.done();
	}


});

module.exports = router;
