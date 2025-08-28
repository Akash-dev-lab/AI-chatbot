const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/auth.routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use("/api/auth/", authRoutes)


module.exports = app