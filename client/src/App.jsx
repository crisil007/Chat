import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatOne from "./components/chatone"; // Update the path

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat/:receiverId" element={<ChatOne />} />  {/* Update to accept receiverId */}
      </Routes>
    </Router>
  );
};

export default App;
