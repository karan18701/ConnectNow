const mongoose = require("mongoose");

const channelModel = mongoose.Schema(
  {
    channelName: { type: String, trim: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    channelAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelModel);
module.exports = Channel;
