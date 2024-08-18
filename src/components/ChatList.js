import React, { useState, useEffect, useRef } from "react";
import { Alert } from "react-bootstrap";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState("");
  const loggdin = JSON.parse(localStorage.getItem("loggdin"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []); // Removed the dependency on localStorage.getItem("users")

  const getUserName = (uid) => {
    const user = users.find((user) => user.id === uid);
    return user ? user.name : "Unknown User";
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(storedMessages);
  }, []);

  const handleRefresh = () => {
    // Reload messages from localStorage or API
    const updatedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(updatedMessages);
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") {
      setError({ msg: "Message cannot be empty" });
      setTimeout(() => setError(""), 3000); // Hide the error message after 3 seconds
      return;
    }

    const newMessage = {
      id: Date.now(),
      uid: loggdin.id,
      message: messageInput,
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="chat-box-container container">
      <h1 className="text-center">Group Chat</h1>
      <div className="chat-box">
        <div id="messages" className="message-container mb-3">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                key={message.id}
                className={`message ${
                  message.uid === loggdin.id ? "own-message" : "other-message"
                }`}
              >
                <div className="message-header">
                  <span className="activeUser">{getUserName(message.uid)}</span>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="message-body">{message.message}</div>
              </div>
              <div className="clearfix"></div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {error && <Alert variant="danger">{error.msg}</Alert>}
        <div className="input-section">
          <label htmlFor="messageInput" className="user-label">
            {getUserName(loggdin.id)}
          </label>
          <input
            className="form-control message-input"
            type="text"
            id="messageInput"
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <div className="button-group">
            <button className="btn btn-info rounded-0" onClick={handleRefresh}>
              Refresh
            </button>
            <button
              className="btn btn-primary rounded-0"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
