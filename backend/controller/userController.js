const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      token: generateToken.generateToken(user._id),
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
      token: generateToken.generateToken(user._id),
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

const sendMail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      res.status(401);
      throw new Error("User Not Exists!!");
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = generateToken.generateTokenForPass(
      oldUser.email,
      oldUser._id,
      secret
    );
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
    console.log("link : ", link);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rahulpatelrahul1425@gmail.com",
        pass: "pjbpfpecjtglnimj",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: oldUser.email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    // to do
    res.status(200).json({ email: oldUser.email });
  } catch (error) {
    res.status(401);
    throw new Error("Email not sent!!");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  // const { id, token } = req.params;
  const id = req.params.id;
  const token = req.params.token;
  const { password } = req.body;

  // console.log("id ", id);

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;

  try {
    const verify = jwt.verify(token, secret);
    // console.log(verify);
    // output
    //    id: '63eb8ee931e8fdeb32cd2b94',
    // email: 'kishantanakhiya@gmail.com',
    // iat: 1676383739,
    // exp: 1676384039

    if (verify) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      try {
        await User.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              password: encryptedPassword,
            },
          }
        );
      } catch (error) {
        res.status(401);
        throw new Error("Password not updated!!");
      }

      res.send("verfied & updated");
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("token is not verfied!!");
  }
});

const getUser = asyncHandler(async (req, res) => {
  // const { id } = req.params.uId;
  const users = await User.findOne({ _id: req.params.uId });
  // console.log("xxid ", users);
  if (!users) {
    return res.json({ status: "User Not Exists!!" });
  } else {
    return res.send(users);
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  sendMail,
  updateUser,
  getUser,
};
