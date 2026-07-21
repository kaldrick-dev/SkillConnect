import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";

const Messages = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "employer",
      text: "Welcome to the internship!",
      time: "10:15 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Thank you! I'm excited to get started.",
      time: "10:18 AM",
    },
    {
      id: 3,
      sender: "employer",
      text: "Please submit your first task before Friday.",
      time: "10:25 AM",
    },
  ]);

  const sendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
  };

  const handleEndChat = () => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end this chat?"
    );

    if (confirmEnd) {
      alert("Chat ended successfully.");
      navigate("/profile"); // Change if your profile route is different
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg h-full flex flex-col">

        {/* Header */}
        <div className="border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Internship Discussion
            </h2>

            <p className="text-gray-500">
              Frontend Developer Internship
            </p>

            <p className="text-sm text-gray-400">
              Employer: Virtual Conquerors
            </p>
          </div>

          <button
            onClick={handleEndChat}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition shadow-md"
          >
            End Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
};

export default Messages;