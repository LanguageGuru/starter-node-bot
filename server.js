var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})
 
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
//var s = "AT+HTTPPARA=\"URL\",\"http://139.59.249.126:4242/setstatus?deviceid=humidity&status=88\””;
 console.log("Example app listening at http://%s:%s", host, port)
})

app.get('/getUser/:name', function(req, res) {
    var jsonData = require( __dirname + "/" + "users.json"); 
    res.send(jsonData[req.params.name]);
  });

 
  
