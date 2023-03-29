import { io } from "socket.io-client";

export const Socket = io(
  "https://ec74-2406-b400-d5-4115-6d7b-c0a2-3b1d-c3d4.ngrok.io/api/v1"
);

// eslint-disable-next-line no-unused-vars
Socket.on("connect_error", (err) => {
  console.log("socket connection error", err.message);
});

Socket.on("disconnect", () => {
  console.log("Disconnected socket connection status: ", Socket.connected);
});
