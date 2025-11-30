require('dotenv').config()
const app = require('./app')
const connectDB = require('./src/db/db')
const httpServer = require("http").createServer(app)
const initSocketServer = require("./src/sockets/socket.server")

connectDB()
initSocketServer(httpServer)

httpServer.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running...")
})
