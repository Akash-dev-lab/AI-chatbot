const mongoose = require('mongoose')

async function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB is connected.")
    })
}

module.exports = connectDB