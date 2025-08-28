require('dotenv').config()
const app = require('./app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require('./src/db/db')

connectDB()

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  console.log("A user connected.")


  socket.on("disconnect", () => {
    console.log("A user disconnected.")
  })
});


httpServer.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running...")
})
