const Message = require("./message.model");
const createMessage = async (payload) => {
  return await Message.create(payload);
};
const getMessages = async () => {
  return await Message.find().sort({ createdAt: -1 });
};
module.exports = { createMessage, getMessages };
