#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("chat:server");
var http = require("http");
const dotenv = require("dotenv");
const { ConnectMongo } = require("../connection/connection");
/**
 * Get port from environment and store in Express.
 */
dotenv.config();
var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
ConnectMongo(process.env.MONGOD_URL).then((e) => console.log("conncted to mongo db"));
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
    // credentials: true,
  }
});

global.customerObj = {};
io.on("connection", (socket) => {
  console.log("Socket connection established...", socket.id);
  socket.on("admit-user", (userId) => {
    console.log("New User: ", userId);
    customerObj[userId] = socket.id;
    console.log("customers: ", customerObj);
  });
  socket.on("chat", (data) => {
    console.log("data", data);
    socket.to(customerObj[data.receiver]).emit("receivedMessage", data.msg);
  });
});
console.log(customerObj);
io.on("error", () => console.log("error"));
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
