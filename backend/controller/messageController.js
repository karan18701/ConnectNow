const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const getDate = require("../config/getDate");

const allMessages = asyncHandler(async (req, res) => {
  // try {
  //   const messages = await Message.find({ chat: req.params.chatId })
  //     .populate("sender", "name pic email")
  //     .populate("chat");
  //   res.json(messages);
  // } catch (error) {
  //   res.status(400);
  //   throw new Error(error.message);
  // }
  try {
    var chat = await Chat.findById(req.params.chatId);
    var lastDel;
    chat.lastDeleted.forEach((element) => {
      if (String(req.user._id) === String(element.participant)) {
        lastDel = element.lastTime;
      }
    });
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    // console.log(lastDel);
    const newMsg = messages.filter((elem) => elem.time > lastDel);
    // console.log(newMsg);
    // console.log(messages)
    res.json(newMsg);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    time: getDate(),
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
