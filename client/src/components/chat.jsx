import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";  // Default import for jwt-decode

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authorization token is missing!");
        return;
      }

      const response = await fetch("http://localhost:3000/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        alert("Failed to fetch messages.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token is missing!");
      return;
    }

    let sender;
    try {
      const decodedToken = jwt_decode(token);  // Using default import from jwt-decode
      sender = decodedToken.username || "Anonymous";  // Adjust based on your token's payload
    } catch (error) {
      console.error("Error decoding token:", error);
      alert("Failed to retrieve sender information.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender, message }),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => null);
        alert(`Failed to send message: ${errorDetails?.error || response.statusText}`);
        return;
      }

      const newMessage = await response.json();
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessage("");
    } catch (error) {
      console.error("Network error:", error);
      alert("An error occurred while sending the message.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
        <div className="flex items-center">
          <img src="/path/to/profile-pic.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          <h1 className="ml-3 text-xl font-semibold text-white">Chat</h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Settings
        </button>
      </header>

      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
              {/* Display the username */}
              <span className={`text-sm ${msg.sender === 'Me' ? 'text-blue-600' : 'text-gray-400'}`}>
                {msg.sender}
              </span>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-white ${msg.sender === 'Me' ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-900 shadow-md flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <i className="fa fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default Chat;
