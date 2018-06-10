var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var savedInputs = ["this will be the first entry",
"this wil be the second entry","this will be the third entry", "Justin got this feature working"];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    io.emit('chat message', "Use the number's to enter prerecorded text")
    for(var i = 0;i<savedInputs.length;i++){
      io.emit('chat message', (i+1) + " " + savedInputs[i])
    }
})

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    var shouldGivePredefinedInput = false;
    for(var i = 0;i<savedInputs.length;i++)
    {
      if (msg == "-" + (i+1))
      {
        shouldGivePredefinedInput = true;
      }
    }
    if(shouldGivePredefinedInput){
      const contentToSend = parseInt(msg.split("")[1]) - 1;
      io.emit('chat message', savedInputs[contentToSend]);
    } else {
      io.emit('chat message', msg);
    }
    });
});
http.listen(port, function(){
  console.log('listening on *:' + port);
});
