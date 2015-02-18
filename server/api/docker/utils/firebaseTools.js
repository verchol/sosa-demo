var Firebase    = require("firebase"),
    Mailgun     = require('mailgun-js');


var api_key = "key-4uyp9wg4ya0r7d30n0j47b7l-q-5il97";
var firebase_key = "8ifbx0Eje9mpTNhdbG5nTZjBsPzUPmpNyei7CtLH";
var domain = "app27040591.mailgun.org";
var from_who = "no-reply@Codefresh.net"

module.exports = function(app) {

    var usersRef = new Firebase('https://freshsite.firebaseIO.com/users');
    var contactUsRef = new Firebase('https://freshsite.firebaseIO.com/contactUs');

    usersRef.auth(firebase_key, function(err){
        if (err)
            console.log("unable to login to fireBase users", error);
        else {
            console.log("login to Firebase users base succeeded");
            contactUsRef.auth(firebase_key, function(err){
                if (err)
                    console.log("unable to login to fireBase contactUs", error);
                else
                    console.log("login to Firebase contactUs base succeeded");
            });
        }
    });



    var createArrayFromObject = function (object) {
        var result = [];
        for (var i in object){
            //console.log(user);
            result.push(object[i]);
        }
        return result;
    };

    app.post("/users", function(req, res){
        //var x = req.body.passowrd;

        if (req.body.passowrd === "oleg123"){
            usersRef.once('value', function (snapshot) {
                var users = snapshot.val();
                var result = createArrayFromObject(users);
                res.json(result);
            }, function (errorObject) {
                res.send(500);
            });
        }
        else
            return res.send(500);
    });

    app.post("/submit/request", function(req, res){
        //var x = req.body.passowrd;


        if (req.body.passowrd === "oleg123"){
            contactUsRef.once('value', function (snapshot) {
                var messages = snapshot.val();
                var result = createArrayFromObject(messages);
                res.json(result);
            }, function (errorObject) {
                res.send(500);
            });
        }
        else
            return res.send(500);
    });

    app.post("/submit/upload", function(req, res)
    {
        var user = req.body.name;
        var email = req.body.email.toLowerCase();
        if (!user || !email)
            res.send(500);

        addNewUser(user, email, res);

    });

    app.post("/sumbit/comment", function(req, res)
    {
        console.log("hanlding save comment");
        var user = req.body.form.name;
        var email = req.body.form.email.toLowerCase();
        var message = req.body.form.comment;
        console.log(user, email, message);
        if (!user || !email || !message)
            return res.send(500);

        contactUsRef.push({
            user: user,
            email : email,
            message: message,
            created : new Date().toString()
        },function(error){
            if (error)
                return res.send(500);
            else
                return res.send(200);
        });

        addNewUser(user, email);
    });

    app.get("/",function(req, res){
        res.redirect('/home.html');
    });


    var addNewUser = function(user, email, res) {

        var uniqueId = email.replace(/\./g, "_");

        var newUser= usersRef.child(uniqueId);

        // need to check if the user exists before this,
        // because the below function will not return error on duplicate

        newUser.once("value", function(snapshot){
            if (snapshot.val() && res)
                return res.send(400, "You have already signed up for the beta.");
            else {
                newUser.set({
                    user: user,
                    email : email,
                    created : new Date().toString()
                },function(error){
                    if (error && res)
                        res.send(500);
                    else {
                        // send email notification
                        var mailgun = new Mailgun({apiKey: api_key, domain: domain});

                        var data = {
                            from: from_who,
                            to: email,
                            subject: 'Hello from Codefresh',
                            html: 'Welcome to the mailing list'
                        };

                        //Invokes the method to send emails given the above data with the helper library
                        mailgun.messages().send(data, function (err, body) {
                            //If there is an error, render the error page
                            if (err)
                                console.log("got an error: ", err);
                            else
                                console.log(body);
                        });
                        if (res)
                            res.send(200);
                    }
                });
            }
        });
    }

};
