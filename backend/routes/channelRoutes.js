const express = require("express");
const {
  createChannel,
  addToChannel,
  removeFromChannel,
  renameChannel,
  deleteChannel,
} = require("../controller/channelController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/").post(protect, accessChat);
// router.route("/").get(protect, fetchChats);
router.route("/channelcreate").post(protect, createChannel);
router.route("/channelrename").put(protect, renameChannel);
router.route("/channelremoveUser").put(protect, removeFromChannel);
router.route("/channeladdUser").put(protect, addToChannel);
router.route("/channeldelete").delete(protect, deleteChannel);

module.exports = router;
