require('dotenv').config()
const app = require('./app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/services/ai.services')

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const chatHistory = {};

io.on("connection", (socket) => {
  console.log("A user connected.")

  chatHistory[socket.id] = [];

  socket.emit("chat-history", chatHistory[socket.id]);

  socket.on("disconnect", () => {
    console.log("A user disconnected.")
    delete chatHistory[socket.id];
  })

  socket.on("ai-message", async (data) => {
    
    const userMessage = { sender: "user", text: data.prompt };
    chatHistory[socket.id].push(userMessage);

    console.log("Prompt: ", data.prompt)
    const response = await generateResponse(data.prompt)
    const botMessage = { sender: "bot", text: response };
    socket.emit("ai-response", {response})
    chatHistory[socket.id].push(botMessage);
    socket.emit("chat-history", chatHistory[socket.id]);
  })
});


httpServer.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running...")
})
