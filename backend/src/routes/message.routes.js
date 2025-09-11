// message.route.js
const router = require("express").Router();
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");

router.post("/", async (req, res) => {
  try {
    const { chatId, content, role } = req.body;
    const message = await messageModel.create({
      chat: chatId,
      content,
      role,
      user: req.user?._id, // agar auth middleware laga ho
    });

     await chatModel.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
      $set: { lastActivity: Date.now() }
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/:chatId", async (req, res) => {
  try {
    const chat = await chatModel
      .findById(req.params.chatId)
      .populate("messages");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
