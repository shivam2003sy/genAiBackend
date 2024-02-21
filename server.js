const express = require("express");
const http = require("http");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');
const socketIo = require('socket.io');
const { addEmailToSocketId } = require("./socket/helper");


require('dotenv').config();
connectDb();
const app = express();
const server = http.createServer(app);
const io = socketIo(server , {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const corsOptions ={
  origin: '*', 
  credentials: true,      
  optionSuccessStatus: 200
}
app.use(cors(corsOptions)); // allowing CORS for all domains

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use(errorHandler);



// from backed

const users = {};

const port = process.env.PORT || 5000;

const socketToRoom = {};

io.on("connection", (socket) => {
  socket.on("join room", ({ roomID, user }) => {
    console.log("join room", roomID , user);
    if (users[roomID]) {
      users[roomID].push({ userId: socket.id, user });
    } else {
      users[roomID] = [{ userId: socket.id, user }];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter(
      (user) => user.userId !== socket.id
    );
    socket.emit("all users", usersInThisRoom);
  });
  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      user: payload.user,
    });
  });
  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });
  socket.on("send message", (payload) => {
    console.log("send message", payload);
    io.emit("message", payload);
  });

  // disconnect
  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((item) => item.userId !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

console.clear();
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
