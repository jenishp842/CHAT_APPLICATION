import  {io}  from "socket.io-client";

const Socket = io(
  "https://ec74-2406-b400-d5-4115-6d7b-c0a2-3b1d-c3d4.ngrok.io", {
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