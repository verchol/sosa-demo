var firebase_connection = require(global.appRoot + '/config/firebase/connection');
var factories_conn = firebase_connection.child('factory');
var Q = require('q');

var factoryService = function() {
	this.checkIfGitExists = function(git_url) {
		var deferred = Q.defer();

		console.log("checking if factory already exists");

		factories_conn.on("value", function(data) {
			var data = data.val();

			if(!data) {
				deferred.resolve(git_url);
			}
			else {
				var exists = false;
				var factory_id;
				for(i in data) {
					if(data[i].git_url && data[i].git_url === git_url) {
						exists = true;
						factory_id = i;
						break;
					}
				}
				if(exists) {
					//console.warn("factory for git url already exists!");
					deferred.reject(factory_id);
				}
				else {
					deferred.resolve(git_url);
				}
			}
		});

		return deferred.promise;
	};

	this.saveFactory = function(session) {
		console.log("save factory data in the database");

		var factory_data = {
			git_url: session.git_url,
			branches: session.clone_data.branches,
			timestamp: new Date().getTime(),
			ip: session.ip
		};

		factories_conn.child(session.clone_data.workspaceId).set(factory_data, function(){
			console.log("Saved!");
		});
	};

	this.checkIfFactoryExists = function(factory_id) {
		var deferred = Q.defer();
		var factory_conn = factories_conn.child(factory_id);
		factory_conn.once("value", function(data) {
			var factory_data = data.val();
			if(!factory_data) {
				console.log("there is no such factory!");
				deferred.reject("there is no such factory!");
			}
			else {
				setTimeout(function(){
					deferred.resolve(factory_data);
				},2000);

			}
		});

		return deferred.promise;
	};
};

module.exports = new factoryService();
