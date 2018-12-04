var express = require('express');
var http = require('http');
var path = require("path");
var io = require('socket.io');
var bodyParser = require('body-parser')
var express = require('express');
var currplayer = 0;
var appTempo = 400;
var userID = 0;
var playerAmount = 0;
var globalbarType = 0;
var currtimesec = 30;
var currtimemin = 0;
var currtimesecrev = 0;
var currtimesminrev = 0;

var app = express();
var server  = http.createServer(app);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var width = 16;
var height = 13;
var seqarraystate = [];

//TODO create an array from var width and height


let AWS_config_accessKeyId = process.env.AWS_config_accessKeyId;
let AWS_config_secretAccessKey = process.env.AWS_config_secretAccessKey;


let port = process.env.PORT || 8080;




function init(){
  for (var i = 0; i < width*height; i++){
    //seqarraystate[i] = [];
    seqarraystate[i] = {instrument: '',
    color: 'white',
    activated: 0,
    serverUID: userID};
  }
}

init();


function resetGrid(){
  for (var i = 0; i < width*height; i++){
    seqarraystate[i].activated = 0;
  }
  currtimesec = 30;
  currtimemin = 0;
  globalbarType = 0;
  sockets.emit('resetAll', seqarraystate);
  console.log('reset all');

}


app.get('/GetGridSize', function(req,res){
  res.setHeader('Content-Type', 'application/json');
  var obj = {
    "array": seqarraystate,
    "width": width,
    "height": height,
    "userNumber": userID,
    "accessKey": AWS_config_accessKeyId,
    "secretAccessKey": AWS_config_secretAccessKey,
    "region": 'us-west-2'
  }
  res.send(obj)

});

server = app.listen(port, function () {
  console.log('Example app listening on port 8080!')
});


var sockets = io(server);
// configure socket handlers
sockets.on('connection', function(socket){
  //Hi this is all the users connected

  sockets.emit('usercount', sockets.engine.clientsCount);
  //console.log('User num: ', sockets.engine.clientsCount);

  playerAmount = playerAmount + 1;
  userID = userID+1;
  if (userID >= 11){
    userID = 1;
  }

  socket.send(socket.id);


  socket.on('disconnect', function(){
    //Hi somebody dissconencted we have a different count!
    playerAmount = playerAmount - 1;
    //console.log('playerAmount', playerAmount);

    sockets.emit('usercount', sockets.engine.clientsCount);
    //console.log('User num: ', sockets.engine.clientsCount);
  });
});
