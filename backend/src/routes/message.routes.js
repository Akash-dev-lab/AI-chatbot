// message.route.js
const router = require("express").Router();
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");

router.get("/:chatId", async (req, res) => {
  try {
      console.log("Fetching messages for chatId:", req.params.chatId);
    const chat = await chatModel
      .findById(req.params.chatId)
      .populate("messages");

    if (!chat) {
      console.log("Chat not found in DB!");
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
