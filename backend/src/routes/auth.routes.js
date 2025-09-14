const express = require('express')
const multer = require('multer');
const {registerController, loginController, profileController, logoutController, profileUploadController} = require('../controllers/auth.controller')
const {authUser} = require("../middlewares/auth.middleware");
const router = express.Router()
const upload = multer();

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/profile', authUser, profileController)
router.post('/logout', authUser, logoutController)
router.post('/upload-profile', authUser, upload.single('profilePic'), profileUploadController)

module.exports = router