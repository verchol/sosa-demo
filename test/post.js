'use strict';

describe('comments post test', function () {

  // load the controller's module
  var request  = require("request");

  it('should post comment', function (done) {
    request({
    method: 'POST',
    'Content-Type':'application/json',
    uri: 'http://localhost:5555/test',
    body: JSON.stringify({a : "b"})
  }, function(error, response, body){
     console.log(error + "," + response + "," + body);
     done();
  });
});

});
