import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./chat"; // Assuming this is your Chat component

const ChatOne = () => {
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  useEffect(() => {
    // Fetch users from the backend
    axios.get("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Use JWT token for authentication
      },
    })
    .then((response) => {
      setUsers(response.data); // Update state with the list of users
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
  }, []);

  const selectReceiver = (receiverId) => {
    setSelectedReceiver(receiverId); // Set the selected user as the receiver for the chat
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", paddingRight: "20px" }}>
        <h2>Contacts</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => selectReceiver(user._id)}
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor: selectedReceiver === user._id ? "#ddd" : "transparent",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: "65%" }}>
        {selectedReceiver ? (
          <Chat receiverId={selectedReceiver} />
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatOne;
