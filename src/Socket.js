import  {io}  from "socket.io-client";

const Socket = io(
  "http://localhost:5000", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 3,
  transports: ['websocket']
}
);
Socket.on("connect", (socket) => {
  console.log("connected socket connection status::", socket);
});
// eslint-disable-next-line no-unused-vars
Socket.on("connect_error", (err) => {
  console.log("socket connection error", err);
});

Socket.on("disconnect", () => {
  console.log("Disconnected socket connection status: ", Socket.connected);
});

export {Socket};