exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
      /**
       * it creates or joins a room
       */
      socket.on('create or join', function (room, userId) {
        socket.join(room);
        io.sockets.to(room).emit('joined', room, userId);
      });

      socket.on('chat', function (room, userId, chatText) {
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });

      socket.on('knowledge snippet', function (room, userId, header, body, colour){
        io.sockets.to(room).emit('knowledge snippet',room, userId, header, body, colour)
      });

      socket.on('draw', function (room,userId,canvasWidth,canvasHeight,prevX,prevY,currX,currY,color, thickness) {
        io.sockets.to(room).emit('draw',room, userId, canvasWidth, canvasHeight, prevX, prevY,currX, currY,color, thickness)
      });

      socket.on('clear canvas', function (room) {
        io.sockets.to(room).emit('clear canvas')
      })

      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });
}

