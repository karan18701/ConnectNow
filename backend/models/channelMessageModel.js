const mongoose = require("mongoose");

const channelMessageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel;" },
    time: { type: String },
  },
  { timestamps: true }
);

const ChannelMessage = mongoose.model("Message", channelMessageModel);
module.exports = ChannelMessage;
