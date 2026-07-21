import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-3 border-t p-4 bg-white">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button
        onClick={send}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;