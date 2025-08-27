require('dotenv').config()
const app = require('./app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/services/ai.services')

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("A user connected.")

  socket.on("disconnected", () => {
    console.log("A user disconnected.")
  })

  socket.on("ai-message", async (data) => {
    console.log("Prompt: ", data.prompt)
    const response = await generateResponse(data.prompt)
    console.log(response)
    socket.emit("ai-response", {response})
  })
});


httpServer.listen(3000, () => {
    console.log("Server is Running...")
})
