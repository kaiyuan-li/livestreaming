var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cam = require('linuxcam');
var Jpeg = require('jpeg-fresh').Jpeg;
 
cam.start("/dev/video0", 320, 240);
 
function update(socket) {
  var frame = cam.frame();
  var jpeg = new Jpeg(frame.data, frame.width, frame.height, 'rgb');
  var jpeg_frame = jpeg.encodeSync();
  socket.emit("frame", jpeg_frame.toString('base64'));
  setTimeout(function() {
    update(socket);
  }, 40);
}
 
io.on('connection', function(socket){
  socket.on('error', function(err){
    console.log("ERROR: "+err);
  });
  update(socket);
});
 
http.listen(9639, function(){
  console.log('listening on *:9639');
});