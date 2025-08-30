const jwt = require("jsonwebtoken");
const userModel = require('../models/user.model')

async function authUser(req, res, next) {
  const {token} = req.cookies

  if(!token) return res.status(401).json({
    message: "Unauthorized"
  })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // console.log(decoded)

    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    req.user = user

    next()
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    })
  }
}

module.exports = {
  authUser
};
