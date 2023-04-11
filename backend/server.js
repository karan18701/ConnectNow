const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const channelRoutes = require("./routes/channelRoutes");
const channelMessageRoutes = require("./routes/channelMessageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// express app
const app = express();
//use of dotenv
dotenv.config();
connectDB();

app.use(express.json()); //to accept json data

// exporting port from .env file
const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.yellow.bold)
);

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/channelmessage", channelMessageRoutes);

app.use(notFound);
app.use(errorHandler);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // take user data from frontend
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // join a chat
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("join video", (room, name) => {
    socket.join(room);

    console.log(name + "User Joined Video Room: " + room);
  });

  socket.on("show calling", (room, user, channel) => {
    socket.in(room).emit("show calling");

    // console.log("new msg", channel);

    channel.users.forEach((u) => {
      if (user._id == u._id) return;
      // console.log("channel", channel);

      socket.in(u._id).emit("group video", channel);
    });
  });

  socket.on("group video", (newChannelMessage) => {
    var channel = newChannelMessage.channel;
    // console.log(channel);
    channel.users.forEach((u) => {
      if (u._id == newChannelMessage.sender._id) return;
      // console.log("channel", channel);

      socket.in(u._id).emit("group video recieved", newChannelMessage);
    });
  });

  socket.on("join channel", (room) => {
    socket.join(room);
    console.log("User Joined Channel: " + room);
  });

  socket.on("new channelmessage", (newMessageRecieved) => {
    var channel = newMessageRecieved.channel;

    if (!channel.users) return console.log("channel users not defined");

    channel.users.forEach((u) => {
      if (u._id == newMessageRecieved.sender._id) return;

      socket.in(u._id).emit("channelmessage recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
