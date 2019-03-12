import io from 'socket.io-client';

class ClientSocket {
  constructor() {
    this.socket = io();
  }

  subscribe(event, cb) {
    this.socket.on(event, params => {
      cb(params);
    });
  }

  unsubscribe(event) {
    this.socket.off(event);
  }

  emit(event, params) {
    this.socket.emit(event, params);
  };

  enterRoom(id) {
    this.socket.emit('room-in', id);
  }

  leaveRoom(id) {
    this.socket.emit('room-out', id);
  }
};

export const clientSocket = new ClientSocket();