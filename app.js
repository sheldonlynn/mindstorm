var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var boxArray = [];
var timerStarted = false;
var timerFinish = false;

app.set('port', 3000);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.emit('update screen', boxArray);

  socket.on('send message', function(msg){
    io.emit('send message', msg);
  });

  socket.on('new box', function(boxes) {
    boxArray = boxes;
    socket.broadcast.emit('new box', boxes);
  });

  socket.on('delete box', function(boxId) {
    for (var i = 0; i < boxArray.length; i++) {
      if (boxId == boxArray[i].id) {
        boxArray[i].id = 'removed';
      }
    }
    socket.broadcast.emit('delete box', boxId);
  })

  socket.on('update text', function(data) {
    socket.broadcast.emit('update text', data);
  });

  socket.on('move box', function(box) {
    socket.broadcast.emit('move box', box);
  });

  var seconds = 0;
  var minutes = 5;

  socket.on('timer start', function() {
    if (!timerStarted) {
    timerStarted = true;
    var timer = setInterval(function() {
        seconds--;
        if (seconds < 0 && minutes > 0) {
          seconds = 59;
          minutes--;
        }
        io.emit('update clock', {'minutes': minutes, 'seconds': seconds});

        if (seconds <= 0 && minutes <= 0) {
          timerFinish = true;
          io.emit('timer finish', timerFinish);
          clearInterval(timer);
        }
      }, 1000);
    }
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on port', app.get('port'));
});