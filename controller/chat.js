const Chat = require("../model/chat");
const Message = require("../model/message");
const catchAsync = require("../utils/catchAsync");
const { sendResponse } = require("../utils/sendresponse");

exports.sendChat = catchAsync(async (req, res) => {
  const { message, chat } = req.body;
  const newMessage = await Message.create({ message, sender: req.user, chat });
  await Chat.findByIdAndUpdate(chat, { $push: { messages: newMessage._id } });
  sendResponse(res, 200, newMessage);
});

exports.getChat = catchAsync(async (req, res) => {
  const { isGroup = false, chatuser } = req.body;
  const chats = await Chat.findOne({
    isGroup,
    users: { $all: [chatuser, req.user] },
  }).populate("messages");
  if (chats) {
    sendResponse(res, 200, chats);
  } else {
    // const chatuserdata = await Chat.findOne({ _id: chatuser });
    const newchat = await Chat.create({
      isGroup: false,
      name: "single",
      users: [req.user, chatuser],
      messages: [],
    });
    sendResponse(res, 200, newchat);
  }
});
