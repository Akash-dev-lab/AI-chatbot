const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        }
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: String
}, {timestamps: true})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
