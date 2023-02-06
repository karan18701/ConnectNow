const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

// asyncHandler is used for handle any error that occurs in this controller
const registerUser = asyncHandler(async (req, res) => {
  // this value is taken from frontend so tell the server(server.js) to accpt json data
  const { name, email, password, pic } = req.body;

  // check whether all entries are filled or not
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the feilds");
  }

  // check if userExist or not
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  // jwt helps to authorize user in backend
  if (user) {
    // sucess
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Failed to create new User");
  }
});

// user authentication
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // find email in database
  const user = await User.findOne({ email });

  // if email found in db then match password and if both are same then return json data
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  // query to find user that user search . query based on either email or name
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // user that logged in we don't want to find that user as he can't search him self
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
module.exports = { registerUser, authUser, allUsers };
