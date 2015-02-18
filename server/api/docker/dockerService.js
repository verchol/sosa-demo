var firebase_connection = require(global.appRoot + '/config/firebase/connection');
var examples_conn = firebase_connection.child('examples-api');


function saveApiCall(call_data, callback)
{

	console.log(JSON.stringify(call_data));
	var example_id = call_data.example;
	var exampleRef = examples_conn.child(example_id);


	exampleRef.once("value", function(data) {
		var counter_data = data.val();
		if(!counter_data) {
			console.log("== no data for " + example_id +  " creating... ==")
			examples_conn.child(example_id).set({
				counter: 1,
				last_update: new Date().toString(),
				calls: []
			},function(){
				pushCall(call_data, callback);
			});
		}
		else {
			var counter = parseInt(counter_data.counter) + 1;
			exampleRef.update({
				counter: counter,
				last_update: new Date().toString()
			},function(){
				pushCall(call_data, callback);
			});
		}
	});
}

function pushCall(call_data, callback) {
	var example_id = call_data.example;
	var exampleRef = examples_conn.child(example_id);
	var exampleRefCalls = examples_conn.child("calls");
	exampleRefCalls.push(call_data, function(err){
		if (err)
			console.log("error occured during saveing")
		else
			console.log("object was created");
		callback.call(null, err);
	});
}

module.exports = {
	saveApiCall: saveApiCall
};
