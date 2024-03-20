
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser"); // Import body-parser middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json()); // Use body-parser middleware to parse JSON bodies

// Dummy data for demonstration
const channels = ["messages", "orders"];

// Function to send notifications to subscribed channels
const sendNotification = (channel, message) => {
  io.to(channel).emit("notification", message);
};

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("User connected");

  // Handle user subscription to channels
  socket.on("subscribe", (channel) => {
    if (channels.includes(channel)) {
      socket.join(channel);
      console.log(`User subscribed to ${channel}`);
    } else {
      console.log(`Channel ${channel} does not exist`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Error handling
  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
    // You can handle the error here
  });
});

// Dummy endpoint to simulate events triggering notifications
app.post("/send-notification", (req, res) => {
  const { channel, message } = req.body; // Destructure channel and message from req.body
  if (channel && message) {
    sendNotification(channel, message);
    return res.status(200).json({ success: true });
  } else {
    return res
      .status(400)
      .json({ success: false, error: "Missing parameters" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
