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
    console.log("Incoming request body:", req.body); // Log incoming data

    const { sender, message } = req.body;

    // Validate request body
    if (!sender || !message) {
      console.log("Validation failed: Missing sender or message.");
      return res.status(400).json({ error: "Sender and message are required" });
    }

    console.log("Validation passed. Saving message...");
    const newMessage = new Chat({ sender, message });

    await newMessage.save(); // Attempt to save
    console.log("Message saved successfully:", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error while saving message:", err); // Log detailed error
    res.status(500).json({ error: "Could not send message" });
  }
};
