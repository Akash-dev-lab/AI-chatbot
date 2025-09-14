const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
      },

      lastName: {
        type: String,
        required: true,
      },
    },

    profilePic: {
      type: String,
      default: "https://via.placeholder.com/40", // default image
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
