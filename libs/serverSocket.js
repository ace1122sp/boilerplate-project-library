const io = require('socket.io');

class ServerSocket {
  constructor(server, namespaces) {
    this.io = io(server);
    this.namespaces = [...namespaces];
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

  subscribeToCommentEvents(socket) {
    ServerSocket.COMMENT_EVENTS.forEach(e => {
      this._addEventListenerAndBroadcast(socket, e);
    });
  }

  listenOnServer() {    
    this.startSocket('/home');
    this.recordRooms();
  }

  startSocket(nsp) {
    const server = this.io.of(nsp).on('connection', client => {
      this.subscribeToBookEvents(client, server);
      if (nsp !== '/home') this.subscribeToCommentEvents(client);
      this.recordConnect(client.id);
      client.on('disconnect', () => this.recordDisconnect(client.id));
    });
    
  }

  recordRooms() {
    this.io.of('/books').on('connection', client => {      
      client.on('room-in', id => {
        client.join(id);
      });

      client.on('room-out', id => {
        client.leave(id);        
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