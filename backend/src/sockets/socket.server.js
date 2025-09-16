const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const { generateResponse, generateVector } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token)
      return next(new Error("Authorization error: No token provided."));

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
      const user = await userModel.findById(decoded.id);

      socket.user = user;

      next();
    } catch (error) {
      console.log("Unauthorized, Invalid token.");
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
        // Save user message
        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: messagePayload.content || "",
            imageUrl: messagePayload.imageUrl || null,
            role: "user",
            type: messagePayload.imageUrl ? "image" : "text",
          }),
          messagePayload.content ? generateVector(messagePayload.content) : null,
        ]);

        await chatModel.findByIdAndUpdate(messagePayload.chat, {
          $push: { messages: message._id },
          $set: { lastActivity: Date.now() },
        });

        if (vectors) {
          await createMemory({
            vectors,
            messageId: message._id,
            metadata: {
              chat: messagePayload.chat,
              user: socket.user._id,
              text: messagePayload.content,
            },
          });
        }

        // Get memory + chat history
        const [memory, chatHistory] = await Promise.all([
          vectors
            ? queryMemory({
                queryVector: vectors,
                limit: 3,
                metadata: {
                  user: socket.user._id,
                },
              })
            : [],
          messageModel
            .find({
              chat: messagePayload.chat,
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
            .then((messages) => messages.reverse()),
        ]);

        const stm = chatHistory.map((item) => ({
          role: item.role,
          parts: item.content ? [{ text: item.content }] : [],
        }));

        const ltm = memory.length
          ? [
              {
                role: "user",
                parts: [
                  {
                    text: `These are some previous messages from the chat, use them to generate a response:\n${memory
                      .map((item) => item.metadata.text)
                      .join("\n")}`,
                  },
                ],
              },
            ]
          : [];

        // Generate AI response (with text + optional image)
        const responseText = await generateResponse(
          messagePayload.content || "",
          messagePayload.imageUrl || null
        );

        socket.emit("ai-response", {
          content: responseText,
          chat: messagePayload.chat,
        });

        // Save AI response
        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: responseText,
            role: "model",
          }),
          generateVector(responseText),
        ]);

        await chatModel.findByIdAndUpdate(messagePayload.chat, {
          $push: { messages: responseMessage._id },
          $set: { lastActivity: Date.now() },
        });

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: responseText,
          },
        });
      } catch (err) {
        console.error("Socket AI Error:", err.message);
        socket.emit("ai-response", {
          content: "⚠️ Something went wrong while generating response.",
          chat: messagePayload.chat,
        });
      }
    });
  });
}

module.exports = initSocketServer;
