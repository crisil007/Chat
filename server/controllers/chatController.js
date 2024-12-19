const Chat = require("../db/models/Chat");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sender, message } = req.body;
    const newMessage = new Chat({ sender, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Could not send message" });
  }
};
