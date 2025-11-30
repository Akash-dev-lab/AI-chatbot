const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imagekit = require("../utils/imagekit.jsx");


async function registerController(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const userExist = await userModel.findOne({ email });

  if (userExist)
    return res.status(409).json({
      message: "User Already Exist.",
    });

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

  res.cookie("token", token);

  return res.status(201).json({
    message: "user registered successfully.",
    user: {
      fullName: {
        firstName,
      },
      email,
    },
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const isUserRegister = await userModel.findOne({ email });

  if (!isUserRegister)
    return res.status(401).json({
      message: "user not registered",
    });

  const isPasswordValid = await bcrypt.compareSync(
    password,
    isUserRegister.password
  );

  if (!isPasswordValid)
    return res.status(401).json({
      message: "Invalid Password",
    });

  const token = jwt.sign(
    { id: isUserRegister._id },
    process.env.JWT_SECRET_KEY
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  const user = {
    fullName: isUserRegister.fullName,
    email: isUserRegister.email,
  };

  return res.status(201).json({
    message: "user logged in successfully.",
    user: {
      id: user._id,
      name: user.fullName.firstName,
      email: user.email,
    },
  });
}

async function profileController(req, res) {
    try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await userModel.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

async function logoutController(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // prod me true
    sameSite: "strict",
  });

  return res.status(200).json({ message: "User logged out successfully" });
}

async function profileUploadController(req, res) {
   try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const uploadResponse = await imagekit.upload({
      file: file.buffer, // Buffer from multer
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "profile-pics",
    });

     const user = await userModel.findByIdAndUpdate(
      req.user.id, // middleware se aaya
      { profilePic: uploadResponse.url },
      { new: true }
    ).select("-password");

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}

module.exports = {
  registerController,
  loginController,
  profileController,
  logoutController,
  profileUploadController
};
