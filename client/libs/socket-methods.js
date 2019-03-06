export const unsubscribeSocketEvents = (socket, events) => {
  events.forEach(e => {
    socket.off(e);
  });
};