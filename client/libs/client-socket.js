import io from 'socket.io-client';

class ClientSocket {
  constructor(nsp) {
    this.socket = io(nsp);
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
};

export const home = new ClientSocket('/home');
export const books = new ClientSocket('/books');

