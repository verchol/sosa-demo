var firebase_connection = require(global.appRoot + '/config/firebase/connection');
var contactsf = firebase_connection.child('contactsf');

function saveContactus(data, callback)
{
	data.type = "contactus";
	save(data, callback)
}

function save(comment, callback)
{
  comment.date = new Date().toString();
  console.log(JSON.stringify(comment));
	contactsf.push(comment, function(err){
  if (err)
    console.log("error occured during saveing")
  else
    console.log("object was created");

    callback.call(null, err);

})
}

module.exports = {
  contactus: saveContactus
};
