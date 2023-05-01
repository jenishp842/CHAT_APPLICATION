import { io } from "socket.io-client";

export const Socket = io(
  "https://df57-2405-201-2005-8095-216a-243-4ed7-372d.ngrok-free.app",
  {
    // extraHeaders: {
    //   "Access-Control-Allow-Origin": "*",
    // },
    transports: ["polling"],
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
