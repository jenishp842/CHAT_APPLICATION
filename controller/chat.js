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
    users: { $in: [req.user] }
  }).populate("users");
  sendResponse(res, 200, chats);
});
exports.getChat = catchAsync(async (req, res) => {
  const { isGroup, chatuser, groupId } = req.body;
  if (isGroup) {
    const messages = await Message.find(
      {
        chat: groupId
      },
      { message: 1, sender: 1 }
    ).populate("sender");
    sendResponse(res, 200, { messages, _id: groupId });
  } else {
    const chat = await Chat.findOne({
      users: { $all: [chatuser, req.user] }
    });
    if (chat) {
      const messages = await Message.find(
        {
          chat: chat._id
        },
        { message: 1, sender: 1 }
      );
      sendResponse(res, 200, { messages, _id: chat._id });
    } else {
      // const chatuserdata = await Chat.findOne({ _id: chatuser });
      const newchat = await Chat.create({
        isGroup: false,
        name: "single",
        users: [req.user, chatuser],
        messages: []
      });
      sendResponse(res, 200, newchat);
    }
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
    messages: []
  });
  sendResponse(res, 200, newchat);
});
