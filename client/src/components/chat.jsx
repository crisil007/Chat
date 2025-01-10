// Chat.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BsSend } from "react-icons/bs";

const Chat = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(null);
  const [senderUsername, setSenderUsername] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setSender(decoded.id);
      fetchSenderUsername(decoded.id);
    }
    fetchReceiverUsername(receiverId);
  }, [receiverId]);

  useEffect(() => {
    if (sender) {
      fetchMessages();
    }
  }, [sender, receiverId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      setSenderUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching sender's username:", error);
    }
  };

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
      setReceiverUsername(response.data.username);
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
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      <div className="flex items-center p-4 bg-teal-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
            {receiverUsername.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold">{receiverUsername}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === sender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${
                msg.sender === sender
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <span>{msg.message}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex p-4 bg-gray-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-l-full border-t border-l border-b border-gray-300 focus:outline-none text-black"
        />
        <button
          type="submit"
          className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600"
        >
          <BsSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;