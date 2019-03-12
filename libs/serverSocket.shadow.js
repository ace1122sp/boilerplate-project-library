const io = require('socket.io');

class ServerSocket {
  constructor(server) {
    this.io = io(server);
    this.sockets = {};
    this.socketsNumber = 0;
  }

  recordConnect(id) {
    if (!this.sockets[id]) this._increase();
    this._addSocket(id);
  }

  recordDisconnect(id) {
    if (this.sockets[id]) this._decrease();
    this._deleteSocket(id);
  }

  _addEventListenerAndServerEmit(socket, emitter, event) {
    socket.on(event, params => {
      // need to sanitize and validate params
      emitter.emit(event, params);
    });
  }

  _addEventListenerAndBroadcast(socket, event) {
    socket.on(event, params => {
      // need to sanitize and validate params
      socket.broadcast.emit(event, params)
    });
  }

  subscribeToBookEvents(socket, emitter = null) {
    const deleteEvents = ServerSocket.BOOK_EVENTS.slice(1);

    deleteEvents.forEach(e => {
      this._addEventListenerAndBroadcast(socket, e);
    });

    if (emitter) this._addEventListenerAndServerEmit(socket, emitter, ServerSocket.BOOK_EVENTS[0]);
  }

  listenOnServer() {    
    this.startSocket();
  }

  startSocket() {
    const server = this.io.on('connection', client => {
      client.on('room-in', id => {
        client.join(id);
      });

      client.on('room-out', id => {
        client.leave(id);        
      });
      this.subscribeToBookEvents(client, server);
      this.recordConnect(client.id);
      client.on('disconnect', () => this.recordDisconnect(client.id));

      client.on('new comment', params => {
        client.to(params[0]).broadcast.emit('new comment', params[1]);
      });

      client.on('typing comment', room => {
        client.to(room).emit('typing comment');
      });

      client.on('typing comment end', room => {
        client.to(room).broadcast.emit('typing comment end');
      });

      client.on('delete book', room => {
        client.to(room).broadcast.emit('delete book');
      });
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