var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;
var textArea = '<textarea rows="9" cols="15"></textarea>';
var actionButtons = '<div class="actionButtons"><button class="post" onClick="buttonClick(this)">Y</button></div>';

var boxArray = [
  //{"id": "box0", "x": 5, "y": 10, "text": "potato"}
];

var diffArray = [];

var wrapper = {
  //index : 0
  box : currBox
};

var socket = io();

board.addEventListener('click', createBox, false);

function buttonClick(el) {
  var currBox = el.parentElement.parentElement;
  var textValue = currBox.firstChild.value;
  socket.emit('send message', textValue);
}

function createBox(e) {
  console.log(e.pageX + "createbox");
  if (timerStarted) {
    if (!mouseHold) {
      var val = Math.random();
      drawBox("box" + boxArray.length, e.pageX, e.pageY, val);
      boxArray.push({"id": ("box" + boxArray.length), "x": e.pageX, "y": e.pageY, "text": val});
      socket.emit('new box', boxArray);
      socket.on('new box', function(boxes) {
        for(var i = boxArray.length; i < boxes.length; i++) {
          box = boxes[i];
          drawBox(box.id, box.x, box.y, box.text);
          boxArray.push(box);
        }
      });
    }
    mouseHold = false;
  }
}

function drawFromArray() {
  for (var i = 0; i < boxArray.length; i++) {
    var box = boxArray[i];
    console.log(box, "box");
    drawBox(box.id, box.x + "px", box.y + "px", box.text);
  }
}

function drawBox(id, x, y, text) {
  console.log(x + "drawbox");
  var box = document.createElement('div');
  box.innerHTML = textArea + actionButtons;
  box.style.left = x + "px";
  box.style.top = y + "px";

  box.firstChild.value = text;

  box.id = id;
  box.className = "box";

  box.addEventListener('mousedown', mouseDown, false);
  box.addEventListener('mouseup', mouseUp, false);

  board.appendChild(box);
}

function mouseUp(e) {
  wrapper.box = currBox;
  board.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  mouseHold = true;
  currBox = e.target;
  console.log(e.pageX + "mousedown");
  xPos = e.pageX - currBox.offsetLeft;
  yPos = e.pageY - currBox.offsetTop;
  board.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  currBox.style.left = (e.pageX - xPos) + 'px';
  currBox.style.top = (e.pageY - yPos)  + 'px';
}


var seconds = 0;
var minutes = 5;
var watch = document.getElementById('h1');
var start = document.getElementById('start');
var timerStarted;


function countDown() {
  seconds--;
  if (seconds < 0 && minutes > 0) {
    seconds = 59;
    minutes--;
  }
  if (seconds < 10) {
    document.getElementById('clock').innerHTML = minutes + ":0" + seconds;
  } else {
    document.getElementById('clock').innerHTML = minutes + ":" + seconds;
  }

  if (seconds == 0 && minutes == 0) {
    seconds = 10;
    minutes = 0;
    timerStarted = false;
    document.getElementById('clock').innerHTML = "Time's up";

    var textareas = document.getElementsByTagName("textarea");

    for (var i = 0; i < textareas.length; i++) {
      textareas[i].readOnly = true;
    }
    return;

  }
  timer();
}

start.onclick = function() {
  if (!timerStarted)
    timer();
}

function timer() {
  timerStarted = true;
  setTimeout(countDown, 1000);
}