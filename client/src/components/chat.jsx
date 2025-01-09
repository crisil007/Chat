import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Decode the token to get sender info

const Chat = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(null);
  const [senderUsername, setSenderUsername] = useState(""); // State to store sender's username
  const [receiverUsername, setReceiverUsername] = useState(""); // State to store receiver's username

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setSender(decoded.id); // Assuming your token contains the user ID
      fetchSenderUsername(decoded.id); // Fetch sender's username
    }
    fetchReceiverUsername(receiverId); // Fetch receiver's username
  }, [receiverId]);

  useEffect(() => {
    if (sender) {
      fetchMessages(); // Fetch messages when sender is set
    }
  }, [sender, receiverId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/messages/${sender}/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch sender's username using the user ID
  const fetchSenderUsername = async (senderId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${senderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSenderUsername(response.data.username); // Store sender's username
    } catch (error) {
      console.error("Error fetching sender's username:", error);
    }
  };

  // Fetch receiver's username using the receiver ID
  const fetchReceiverUsername = async (receiverId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReceiverUsername(response.data.username); // Store receiver's username
    } catch (error) {
      console.error("Error fetching receiver's username:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/messages",
        { sender, receiver: receiverId, message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages((prevMessages) => [response.data, ...prevMessages]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      {/* Messages Section */}
      <div className="messages-section">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === sender ? "sent" : "received"}
          >
            <span>
              {msg.sender === sender
                ? senderUsername
                : receiverUsername || "Receiver"}:{" "}
            </span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
