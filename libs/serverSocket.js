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

  subscribeToCommentEvents(socket) {
    ServerSocket.COMMENT_EVENTS.forEach(e => {
      this._addEventListenerAndBroadcast(socket, e);
    });
  }

  listenOnServer() {    
    // this.io.on('connection', socket => {

    //   console.log('a user connected');
    //   this.recordConnect(socket.id);
    
    //   socket.on('disconnect', () => {
    //     console.log('user disconnected');
    //     this.recordDisconnect(socket.id);
    //   });

      this.startHomeSocket();
      this.startBookSocket();

      // this.subscribeToBookEvents(socket);
      // this.subscribeToCommentEvents(socket);

    // });  
  }

  startHomeSocket() {
    const homeSocket = this.io.of('/home').on('connection', socket => {
      this.subscribeToBookEvents(socket, homeSocket);
      this.subscribeToCommentEvents(socket);
      this.recordConnect(socket.id);
      socket.on('disconnect', () => this.recordDisconnect(socket.id));
    });
  }

  startBookSocket() { 
    const bookSocket = this.io.of('/books').on('connection', socket => {
      console.log(bookSocket.name);
      this.subscribeToBookEvents(socket, bookSocket);
      this.subscribeToCommentEvents(socket);
      this.recordConnect(socket.id);
      socket.on('disconnect', () => this.recordDisconnect(socket.id));
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