const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/auth.routes')
const chatRoutes = require('./src/routes/chat.routes')
const cookieParser = require("cookie-parser");
const messageRoutes = require("./src/routes/message.routes");

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

app.use("/api/auth/", authRoutes)
app.use("/api/chat/", chatRoutes )
app.use("/api/message", messageRoutes)


module.exports = app