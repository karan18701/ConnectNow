const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  sendMail,
  updateUser,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.post("/forgot-password", sendMail);
router.post("/reset-password/:id/:token", updateUser);

module.exports = router;
