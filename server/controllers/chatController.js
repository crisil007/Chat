const Chat = require("../db/models/Chat");

// Fetch messages between two users
exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages); // Return the list of messages
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Could not fetch messages" });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const newMessage = new Chat({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json(newMessage); // Return the saved message
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Could not send message" });
  }
};
