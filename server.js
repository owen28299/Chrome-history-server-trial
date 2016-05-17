'use strict';

const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      PORT           = process.env.PORT || 3000
      ;

app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

//historical data
var urls = {};

//activity data
var activity = [];
var query = [];


app.post('/activity', function(req,res){
  if(req.body.committedData.transitionType === "link" ||
    req.body.committedData.transitionType === "typed"){

    var filter = false;

    if(req.body.committedData.transitionQualifiers){
      filter = req.body.committedData.transitionQualifiers.some(function(element){
        if(element === 'server_redirect' || element === 'client_redirect') {
          return true;
        }
      });
    }

    if(!filter){
      console.log("activity", req.body.committedData);
      activity.push(req.body.committedData);
    }
  }

  res.json({message : "You are being tracked"});
});

app.post('/query', function(req,res){

  var filter = false;

  if(req.body.committedData.transitionQualifiers){
    filter = req.body.committedData.transitionQualifiers.some(function(element){
      if(element === 'server_redirect' || element === 'client_redirect') {
        return true;
      }
    });
  }

  if(!filter){
    console.log("query", req.body.committedData);
    query.push(req.body.committedData);
  }

  res.json({message : "success"});
});

app.get('/queryactivity', function(req,res){
  var queryactivity = {};

  query.forEach(function(query){

    if (!queryactivity.hasOwnProperty(query.url)){
      queryactivity[query.url] = query;
      queryactivity[query.url].activity = [];
    }

    activity.forEach(function(activity){
      if (query.tabId === activity.tabId){
        queryactivity[query.url].activity.push(activity);
      }
    });
  });

  res.json(queryactivity);

});


//fetching
app.post('/data', function(req,res){
  urls = JSON.parse(req.body.urls);
  res.send("sucess");
});

app.get('/data/:terms', function(req,res){
  var terms = req.params.terms;

  terms = terms.split(' ');

  terms = terms.filter(function(term){
    if(term.indexOf("http") === -1){
      return term;
    }
  });

  var candidates = {};

  for (var i in urls){
    for (var j in terms){

      if (i.indexOf(terms[j]) !== -1){
        if(!candidates.hasOwnProperty(i)){
          candidates[i] = 1;
        }
        else {
          candidates[i] += 1;
        }
      }
    }
  }

  var best = 0;

  for (var b in candidates){
    if(candidates[b] > best){
      best = b;
    }
  }

  res.send({best : best});

});

app.listen(PORT, function(){
  console.log(`Server listening on port: ${PORT}`);
});