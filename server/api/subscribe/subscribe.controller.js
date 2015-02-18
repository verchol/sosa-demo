/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var mcapi = require('mailchimp-api');
var mc = new mcapi.Mailchimp('e58cff2e15d5b14514f5605e3da938be-us9');

// Get list of things
exports.index = function(req, res) {

};

exports.subscribe = function(req, res){

  console.log("subscribe to name:" + req.body.name);
  console.log("subscribe to email:" + req.body.email);


  var firstName = req.body.name.split(' ').slice(0, -1).join(' ');
  var lastName = req.body.name.split(' ').slice(-1).join(' ');


  mc.lists.subscribe(
                     {
                      id: "21e2b00b43",
                      email:{email:req.body.email},
                      merge_vars: {
                          EMAIL: req.body.email,
                          FNAME: firstName,
                          LNAME: lastName,
                          FULLNAME: req.body.name
                        }
                     }, function(data) {
                          console.log('User subscribed successfully! Look for the confirmation email.');
                          res.send(200);
    },
    function(error) {
      if (error.error) {
        console.log(error.code + ": " + error.error);
      } else {
        console.log('There was an error subscribing that user');
      }
      res.send(500);
    });
};
