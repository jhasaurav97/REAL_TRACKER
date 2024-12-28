const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app) 
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("New User connected");
  socket.on("update-location", (msg) => {
    io.emit("updateLocation", msg);
  })
})

app.get("/", (req, res) => {
  return res.sendFile("index.html")
})

server.listen(3000, () => {
  console.log("Server is running on port 3000");
})