const express = require("express");
const http = require("http");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');
const socketIo = require('socket.io');
const { addEmailToSocketId } = require("./socket/helper");
connectDb();
const app = express();
const server = http.createServer(app);
const io = socketIo(server , {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,      
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

app.use(express.json());

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('user connected' , socket.id);

  // Example: Broadcasting a message to all connected clients
  socket.on("join" , (data) => {
    console.log(data)
    addEmailToSocketId(data.email , socket.id);
    io.to(socket.id).emit("join" , data)

  }
  );

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
