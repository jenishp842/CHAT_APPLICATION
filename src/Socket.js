import { io } from "socket.io-client";

export const Socket = io(
  "https://6394-2409-40c1-d-73f7-9c05-2f9c-faf1-15c2.ngrok-free.app"
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
