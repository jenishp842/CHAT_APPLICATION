import { io } from "socket.io-client";

export const Socket = io(
  "https://b810-2406-b400-d5-4115-e5fb-90fd-a68f-60ee.in.ngrok.io/api/v1"
);

// eslint-disable-next-line no-unused-vars
Socket.on("connect_error", (err) => {
  console.log("socket connection error", err.message);
});

Socket.on("disconnect", () => {
  console.log("Disconnected socket connection status: ", Socket.connected);
});
