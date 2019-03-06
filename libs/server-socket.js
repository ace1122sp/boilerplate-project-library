const socketio = require('socket.io');

class ServerSocket {
  constructor(server) {
    this.io = socketio(server);
    this.sockets = {};
    this.socketsNumber = 0;
  }

  recordConnect(id) {
    if (!this.sockets[id]) this._increase();
    this._addSocket(id);
  }

  recordDisconnect(id) {
    this._decrease();
    this._deleteSocket(id);
  }

  _addEventServerEmit(socket, event) {
    socket.on(event, params => {
      // need to sanitize and validate params
      this.io.emit(event, params);
    });
  }

  _addEventBroadcast(socket, event) {
    socket.on(event, params => {
      // need to sanitize and validate params
      socket.broadcast.emit(event, params)
    });
  }

  broadcastBookEvents(socket) {
    const deleteEvents = ServerSocket.BOOK_EVENTS.slice(1);

    deleteEvents.forEach(e => {
      this._addEventBroadcast(socket, e);
    });

    this._addEventServerEmit(socket, ServerSocket.BOOK_EVENTS[0]);
  }

  broadcastCommentEvents(socket) {
    ServerSocket.COMMENT_EVENTS.forEach(e => {
      this._addEventBroadcast(socket, e);
    });
  }

  listenOnServer() {
    this.io.on('connection', socket => {
    
      console.log('a user connected');
      this.recordConnect(socket.id);
    
      socket.on('disconnect', () => {
        console.log('user disconnected');
        this.recordDisconnect(socket.id);
      });

      this.broadcastBookEvents(socket);
      this.broadcastCommentEvents(socket);
    });  
  }

  _addSocket(id) {
    this.sockets[id] = id;
  }

  _increase() {
    this.socketsNumber++;
  }

  _decrease() {
    this.socketsNumber--;
  }

  _deleteSocket(id) {
    delete this.sockets[id];
  }

  loggerOn(interval) {
    this.logger = setInterval(() => {
      console.log(`connected sockets at ${Date()}: ${this.socketsNumber}`);
    }, interval*1000);
  }

  loggerOff() {
    clearInterval(this.logger);
  }
};

Object.defineProperties(ServerSocket, {
  COMMENT_EVENTS: {
    value: ['new comment', 'typing comment', 'typing comment end']
  },
  BOOK_EVENTS: {
    value: ['new book', 'delete book', 'delete all books']
  }
});

module.exports = ServerSocket;