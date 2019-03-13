const io = require('socket.io');
const validate = require('validator');

class ServerSocket {
  constructor(server) {
    this.io = io(server);
    this.sockets = {};
    this.socketsNumber = 0;
  }

  _recordConnect(id) {
    if (!this.sockets[id]) this._increase();
    this._addSocket(id);
  }

  _recordDisconnect(id) {
    if (this.sockets[id]) this._decrease();
    this._deleteSocket(id);
  }

  _addEventListenerAndServerEmit(socket, emitter, event) {
    socket.on(event, params => {
      emitter.emit(event, params);
    });
  }

  _addEventListenerAndBroadcast(socket, event) {
    socket.on(event, params => {
      socket.broadcast.emit(event, params);
    });
  }

  _subscribeToBookEvents(socket, emitter = null) {
    const deleteEvents = ServerSocket.BOOK_EVENTS.slice(1);

    deleteEvents.forEach(e => {
      this._addEventListenerAndBroadcast(socket, e);
    });

    if (emitter) this._addEventListenerAndServerEmit(socket, emitter, ServerSocket.BOOK_EVENTS[0]);
  }

  _emitToRoom(client, event) {
    client.on(event, params => {
      client.to(params).emit(event, params);
    });
  }

  _addRoomVisiting(client) {
    client.on('room-in', id => {
      if (validate.isUUID(id, 4)) client.join(id);      
    });

    client.on('room-out', id => {
      if (validate.isUUID(id, 4)) client.leave(id);            
    });        
  }
  
  _handleRoomEvents(client) {
    ServerSocket.ROOM_EVENTS.forEach(event => {
      if (event === 'new comment') {
        client.on('new comment', params => {
          client.to(params[0]).emit('new comment', params[1]);
        });
      } else {
        this._emitToRoom(client, event);
      }
    });
  }

  _enableRooms(client) {
    this._addRoomVisiting(client);
    this._handleRoomEvents(client);
  }

  _connectionRecords(client) {
    this._recordConnect(client.id);
    client.on('disconnect', () => this._recordDisconnect(client.id));
  }

  startListening() {
    const server = this.io.on('connection', client => {
      this._subscribeToBookEvents(client, server);    
      this._enableRooms(client);
      this._connectionRecords(client);
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
  ROOM_EVENTS: {
    value: ['new comment', 'typing comment', 'typing comment end', 'delete book']
  },
  BOOK_EVENTS: {
    value: ['new book', 'delete book', 'delete all books']
  }
});

module.exports = ServerSocket;