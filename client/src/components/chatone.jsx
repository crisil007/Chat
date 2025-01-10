import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./chat"; // Your Chat component
import { FaUserCircle } from "react-icons/fa";
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";

const socket = io("http://localhost:3000");

const ChatOne = () => {
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    socket.on("online-status", (data) => {
      setOnlineStatus((prevState) => ({
        ...prevState,
        [data.userId]: data.status,
      }));
    });

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setLoggedInUserId(decoded.id);
      socket.emit("user-connected", decoded.id);
    }

    return () => {
      socket.off("online-status");
    };
  }, []);

  const selectReceiver = (receiverId) => {
    setSelectedReceiver(receiverId);
  };

  const isOnline = (userId) => onlineStatus[userId] === "online";

  const filteredUsers = users.filter((user) => user._id !== loggedInUserId);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      <div className="w-full md:w-1/3 bg-gray-800 p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white text-gray-800 flex items-center justify-center font-semibold">
            CC
          </div>
          <h2 className="text-2xl font-bold ml-3">Chit Chat</h2>
        </div>
        <h3 className="text-lg mb-4">Contacts</h3>
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              onClick={() => selectReceiver(user._id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedReceiver === user._id
                  ? "bg-green-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <FaUserCircle size={40} className="mr-3" />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p
                  className={`text-sm ${
                    isOnline(user._id) ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {isOnline(user._id) ? "Online" : "Offline"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-2/3 bg-gray-100 md:h-screen">
        {selectedReceiver ? (
          <Chat receiverId={selectedReceiver} setSelectedReceiver={setSelectedReceiver} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatOne;
