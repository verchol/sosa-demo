var firebase_connection = require(global.appRoot + '/config/firebase/connection');
var comments = firebase_connection.child('comments');



function saveComment(data, callback)
{
  data.type = "comment";
  save(data, callback)
}

function uploadExample(data , callback)
{
  data.type = "example";
  save(data, callback)
}

function requestExample(data , callback)
{
  data.type = "request";
  save(data, callback)
}

function save(comment, callback)
{
  comment.date = new Date().toString();
  console.log(JSON.stringify(comment));
  comments.push(comment, function(err){
  if (err)
    console.log("error occured during saveing")
  else
    console.log("object was created");

    callback.call(null, err);

})
}

module.exports = {
  comment : saveComment,
  upload:  uploadExample,
  request : requestExample
}
