#!/usr/bin/env node

/**
 * Module dependencies.
 */
var cors = require("cors");
var app = require("../app");
app.use(cors({ origin: "*" }));
var debug = require("debug")("chat:server");
var http = require("http");
const dotenv = require("dotenv");
const { ConnectMongo } = require("../connection/connection");
/**
 * Get port from environment and store in Express.
 */
dotenv.config();
var port = normalizePort("5000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
ConnectMongo(process.env.MONGOD_URL).then((e) =>
  console.log("conncted to mongo db")
);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    // credentials: true,
  },
});

global.customerObj = {};
io.on("connection", (socket) => {
  console.log("Socket connection established...", socket.id);
  socket.on("admit-user", (userId) => {
    console.log("New User: ", userId);
    customerObj[userId] = socket.id;
    socket.broadcast.emit("newuser", userId);
    console.log("customers: ", customerObj);
  });
  socket.on("chat", (data) => {
    socket.to(customerObj[data.receiver]).emit("receivedMessage", {
      receiver: data.receiver,
      msg: data.msg,
      sender: data.sender,
    });
  });
  socket.on("typing", (data) => {
    console.log(data, "typing");
    socket.to(customerObj[data.receiver]).emit("istyping", data);
  });
  socket.on("remove", (id) => {
    delete customerObj[id];
    socket.broadcast.emit("remove-user", id);
  });
  socket.on("group-chat", (data) => {
    const users = data?.users
      ?.map((item) => customerObj[item])
      .filter((item) => item);
    socket.to(users).emit("receive-group-chat", {
      sender: data?.sender,
      id: data?.id,
    });
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
