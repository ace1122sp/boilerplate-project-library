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
      this.io.emit(event, params);
    });
  }

  _addEventBroadcast(socket, event) {
    socket.on(event, params => {
      socket.broadcast.emit(event, params)
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
    
      this._addEventServerEmit(socket, 'new book');
    
      // this needs to be cleaned of with use of nsp or rooms

      this._addEventBroadcast(socket, 'delete book');
    
      this._addEventBroadcast(socket, 'delete all books');
    
      // this needs to be cleaned up with use of nsp or rooms
      
      this._addEventBroadcast(socket, 'new comment');
    
      this._addEventBroadcast(socket, 'typing comment');
    
      this._addEventBroadcast(socket, 'typing comment end');
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

module.exports = ServerSocket;