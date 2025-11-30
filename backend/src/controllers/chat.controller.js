const chatModel = require("../models/chat.model")

async function createChat(req, res) {
    const {title} = req.body
    const user = req.user

    const chat = await chatModel.create({
        user: user._id,
        title
    })

    res.status(201).json({
        message: "chat created successfully.",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    })
}

async function getChats(req, res) {
    const user = req.user

    try {
        const chats = await chatModel.find({ user: user._id }).sort({ updatedAt: -1 })
        res.status(200).json({ chats })
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats", error: error.message })
    }
}


module.exports = {
    createChat,
    getChats
}