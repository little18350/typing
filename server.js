const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {}; // เก็บข้อมูลผู้เล่น เช่น progress

io.on("connection", (socket) => {
  console.log("ผู้เล่นใหม่:", socket.id);
  players[socket.id] = { progress: 0, name: "Player" };

  // ส่งรายชื่อผู้เล่นทั้งหมดให้ทุกคน
  io.emit("updatePlayers", players);

  // เมื่อผู้เล่นพิมพ์ไปเรื่อย ๆ
  socket.on("progress", (percent) => {
    players[socket.id].progress = percent;
    io.emit("updatePlayers", players);
  });

  // เมื่อผู้เล่นออก
  socket.on("disconnect", () => {
    console.log("ผู้เล่นออก:", socket.id);
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(3000, () => console.log("Server http://localhost:3000"));
