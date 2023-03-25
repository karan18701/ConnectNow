const asyncHandler = require("express-async-handler");
const Channel = require("../models/channelModel");
const User = require("../models/userModel");

const createChannel = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .send({ message: "Please fill all the feilds require" });
  }

  // var users = JSON.parse(req.body.users);

  // if (users.length < 2) {
  //   return res
  //     .status(400)
  //     .send("More than 2 users are required to form a channel");
  // }

  // users.push(req.user);

  try {
    // create grou chat
    const groupChannel = await Channel.create({
      channelName: req.body.name,
      users: req.user,
      channelAdmin: req.user,
    });

    // send back full chat to user
    const fullChannel = await Channel.findOne({ _id: groupChannel._id })
      .populate("users", "-password")
      .populate("channelAdmin", "-password");

    res.status(200).json(fullChannel);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const addToChannel = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;

  const added = await Channel.findByIdAndUpdate(
    channelId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("channelAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("User not added");
  } else {
    res.json(added);
  }
});

const removeFromChannel = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;

  const removed = await Channel.findByIdAndUpdate(
    channelId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("channelAdmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error("User is not removed");
  } else {
    res.json(removed);
  }
});

const renameChannel = asyncHandler(async (req, res) => {
  const { channelId, channelName } = req.body;

  const updatedChannel = await Channel.findByIdAndUpdate(
    channelId,
    {
      channelName: channelName,
    },
    // if dont use this it will return old value
    { new: true }
  )
    .populate("users", "-password")
    .populate("channelAdmin", "-password");

  if (!updatedChannel) {
    res.status(400);
    throw new Error("Channel not found");
  } else {
    res.json(updatedChannel);
  }
});

const deleteChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  const deleted = await Channel.deleteOne({ _id: channelId });

  if (!deleted) {
    res.status(400);
    throw new Error("Channel not found");
  } else {
    res.status(200).send("Channel Deleted");
  }
});

module.exports = {
  createChannel,
  addToChannel,
  removeFromChannel,
  renameChannel,
  deleteChannel,
};
