import React, { useState, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:3000/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
  
    try {
   
      const response = await fetch("http://localhost:3000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json().catch(() => "No JSON response");
        console.error("Error from server:", errorDetails);
        alert(`Failed to send message: ${errorDetails.error || response.statusText}`);
        return;
      }
  
      const newMessage = await response.json();
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessage("");
      
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message.");
    }
  };
  
  
  

  return (
    <div>
      <h1>Chat</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
