var express = require('express');
var http = require('http');
var path = require("path");
var io = require('socket.io');
var bodyParser = require('body-parser')
var express = require('express');
var Metronome = require('timepiece').Metronome;
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

var port = process.env.PORT || 3000;

let AWS_config_accessKeyId = process.env.AWS_config_accessKeyId;
let AWS_config_secretAccessKey = process.env.AWS_config_accessKeyId;



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

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


var sockets = io(server);
// configure socket handlers
sockets.on('connection', function(socket){
  //Hi this is all the users connected

  sockets.emit('usercount', sockets.engine.clientsCount);
  //console.log('User num: ', sockets.engine.clientsCount);


  playerAmount = playerAmount + 1;
  //console.log('playerAmount', playerAmount);
  userID = userID+1;
  if (userID >= 11){
    userID = 1;
  }

  //console.log(userID);
  socket.send(socket.id);


  socket.on('disconnect', function(){
    //Hi somebody dissconencted we have a different count!
    playerAmount = playerAmount - 1;
    //console.log('playerAmount', playerAmount);

    sockets.emit('usercount', sockets.engine.clientsCount);
    //console.log('User num: ', sockets.engine.clientsCount);
  });
});



////////////////tempo///////////
// By default, a metronome object is set to 60 bpm.
var metronome = new Metronome();
// But you could also initialize one at another tempo.
// It emits a 'tick' event on each beat
metronome.set(appTempo);

metronome.on('tick', function(){
  currplayer ++;
  if (currplayer == 16){
    currplayer = 0;
    globalbarType ++;
    sockets.emit('globalTimetype', globalbarType);
  }
  if (globalbarType >= 55){
    appTempo = 0;
  }



  sockets.emit('currplayer', currplayer);
});
metronome.start();
