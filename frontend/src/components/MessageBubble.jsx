import React from "react";

const MessageBubble = ({ message }) => {
  const isMine = message.sender === "me";

  return (
    <div className={`flex mb-4 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-2xl shadow
        ${
          isMine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{message.text}</p>

        <p
          className={`text-xs mt-2 ${
            isMine ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;