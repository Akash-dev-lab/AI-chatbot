// message.route.js
const router = require("express").Router();
const chatModel = require("../models/chat.model");

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
