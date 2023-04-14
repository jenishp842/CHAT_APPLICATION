import { io } from "socket.io-client";

export const Socket = io("https://107d-2406-b400-d5-b4c2-898c-8a26-db6c-5ca8.ngrok-free.app");
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
