// message.route.js
const router = require("express").Router();
const {RetrieveMessages} = require('../controllers/message.controller')


router.get("/:chatId", RetrieveMessages);

module.exports = router;
