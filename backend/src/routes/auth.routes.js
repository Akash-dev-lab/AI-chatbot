const express = require('express')
const {registerController, loginController, profileController} = require('../controllers/auth.controller')
const {authUser} = require("../middlewares/auth.middleware");

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/profile', authUser, profileController)

module.exports = router