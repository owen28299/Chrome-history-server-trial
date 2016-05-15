'use strict';

const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      PORT           = process.env.PORT || 3000
      ;

app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

var urls = {};

app.post('/data', function(req,res){
  urls = JSON.parse(req.body.urls);
  res.send("sucess");
});

app.get('/data/:terms', function(req,res){
  var terms = req.params.terms;

  terms = terms.split(' ');

  var candidates = [];

  for (var i in urls){
    for (var j in terms){

      if (i.indexOf(terms[j]) !== -1){
        candidates.push(i);
      }
    }
  }

  console.log(candidates);

  res.send("hello");

});

app.listen(PORT, function(){
  console.log(`Server listening on port: ${PORT}`);
});