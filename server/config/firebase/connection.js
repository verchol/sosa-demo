/**
 * Created by AVB on 1/6/2015.
 */
var config = require('../environment');
var Firebase = require('firebase');
var secret  = "KKpNIcXhDNSfGMjaDrzXeAoWQMzOId1HoXwxHP5e";
var firebase_ob = {
	get_env: function() {
		switch(config.env) {
			case "development":
				return new Firebase("https://codefresh-io-develop.firebaseio.com/");
			case "staging":
				return new Firebase("https://codefresh-io-staging.firebaseio.com/");
			case "production":
				return new Firebase("https://codefresh-io.firebaseio.com/");
			default:
				return new Firebase("https://codefresh-io-develop.firebaseio.com/");
		}
	}
};

module.exports = firebase_ob.get_env();
