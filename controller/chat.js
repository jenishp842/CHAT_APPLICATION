const Chat = require("../model/chat");
const Message = require("../model/message");
const catchAsync = require("../utils/catchAsync");
const { sendResponse, sendError } = require("../utils/sendresponse");

exports.sendChat = catchAsync(async (req, res) => {
  const { message, chat } = req.body;
  const newMessage = await Message.create({ message, sender: req.user, chat });
  await Chat.findByIdAndUpdate(chat, { $push: { messages: newMessage._id } });
  sendResponse(res, 200, newMessage);
});
exports.getGroupChat = catchAsync(async (req, res) => {
  const chats = await Chat.find({
    isGroup: true,
    users: { $all: [req.user] },
  }).populate("messages");
  sendResponse(res, 200, chats);
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

exports.createGroup = catchAsync(async (req, res) => {
  const { users, name } = req.body;
  if (!users?.length) {
    return sendError(res, 400, "please select atleast one user");
  }
  if (!name) {
    return sendError(res, 400, "name is required");
  }
  const newchat = await Chat.create({
    isGroup: true,
    name,
    users: [req.user, ...users],
    messages: [],
  });
  sendResponse(res, 200, newchat);
});
