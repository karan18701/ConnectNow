const express = require("express");
const { allMessages, sendMessage } = require("../controller/messageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// for sending message
router.route("/").post(protect, sendMessage);

// fetch all the message from a particular chat
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
