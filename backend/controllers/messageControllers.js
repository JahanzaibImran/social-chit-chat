const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!chatId || !content) {
    res.statusCode(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name photo");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "Chat.users",
      select: "name photo email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    let response;

    await Message.find({ chat: req.params.chatId })
      .populate("sender", "name photo email")
      .populate("chat")
      .then((res) => {
        response = res;
      });

    res.json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = { sendMessage, allMessages };
