'use strict';

const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      PORT           = process.env.PORT || 3000
      ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


app.listen(PORT, function(){
  console.log(`Server listening on port: ${PORT}`);
});