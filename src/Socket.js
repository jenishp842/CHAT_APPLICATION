import { io } from "socket.io-client";

export const Socket = io("https://6851-2405-201-2005-8095-c574-51c8-d092-c08a.ngrok-free.app");
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
