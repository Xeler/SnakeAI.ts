

var express = require('express');
var app = express();
var http = require('http').createServer(app);



app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    app.use(express.static(__dirname + '/public'));
//    res.render(__dirname + "/public/index.html");
});

//app.use(express.static(__dirname + '/public'));



http.listen(3000, function () {
  console.log('Example appss listening on port 3000!')
});



