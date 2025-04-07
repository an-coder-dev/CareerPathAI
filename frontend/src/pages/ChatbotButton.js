import React from "react";
import "./ChatbotButton.css";

const ChatbotButton = () => {
  const handleClick = () => {
    // This could open a chatbot popup or redirect
    window.open("https://your-chatbot-url.com", "_blank"); // Change this
  };

  return (
    <div className="chatbot-button" onClick={handleClick} title="Chat with CareerBot">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png" // sample human bot icon
        alt="Chatbot"
        className="chatbot-icon"
      />
    </div>
  );
};

export default ChatbotButton;
