const service = require("./message.service");
const createMessage = async (req, res) => {
  try {
    const result = await service.createMessage(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getMessages = async (req, res) => {
  try {
    const result = await service.getMessages();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { createMessage, getMessages };
