'use strict';

var express = require('express');
var samples = require('./samples').samples;
var categories = require('./samples').categories;


var router = express.Router();
router.get('/test/forever',function(req, res)
    {
      while(true);
})
    router.get('/', function(req, res)
    {
      res.send('lab is up');
    })
    router.get('/categories', function(req, res) {
        res.send(categories);
    });

     router.post('/search', function(req, res) {
		var samples_clone = [];
	if (req.body.category) {
	    //filter by category:
	    console.log("filter by category");
	    var c = 0;
	    for(var i in samples) {
		if(samples[i].categories.indexOf(req.body.category)>-1) {
		    samples_clone.push(samples[i]);
		}
		c++;
	    }
	}

	if (req.body.free) {
	    //filter by category:
	    console.log("filter by free");
	    var query = req.body.free;
	    var c = 0;
	    var i,j,sample,u={};
	    for(i in samples) {
		sample=samples[i];

		if(u.hasOwnProperty(sample.id)) {
		    continue;
		}

		// search in name:
		if(sample.name.toLowerCase().search(query.toLowerCase(),"i")>-1) {
		    samples_clone.push(sample);
		    u[sample.id] = 1;
		    continue;
		}


		// search in tags:
		for(j in sample.tags) {
		    if(u.hasOwnProperty(sample.id)) {
			continue;
		    }
		    if(sample.tags[j].toLowerCase().search(query.toLowerCase(),"i")>-1) {
			samples_clone.push(sample);
			u[sample.id] = 1;
		    }

        	}
		//////////////////


		c++;
	    }
	}

        res.send(samples_clone);
    });

    router.get('/tags', function(req, res) {
    	var query = req.query.q;

    	var tagsList=[];
        var i,j,sample,u={};
        for(i in samples) {
        	sample=samples[i];
        	//console.log(sample.tags)
        	for(j in sample.tags) {
        		if(u.hasOwnProperty(sample.tags[j])) {
     				continue;
  				}

  				if(sample.tags[j].toLowerCase().search(query.toLowerCase(),"i")>-1) {
	  				tagsList.push(sample.tags[j]);
					u[sample.tags[j]] = 1;
  				}

        	}
        }


        res.send(tagsList);
    });





module.exports = router;
