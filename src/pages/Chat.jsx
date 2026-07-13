import "../App.css";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import API from "../services/api";

function Chat() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const currentUser = searchParams.get("me");

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchReceiver();
    fetchMessages();
  }, []);

  const fetchReceiver = async () => {
    try {
      const res = await API.get("/users");
      const user = res.data.find((u) => u._id === id);
      setReceiver(user);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get(
        `/message?sender=${currentUser}&receiver=${id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await API.post("/message", {
        sender: currentUser,
        receiver: id,
        message: text,
      });

      setText("");
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">💬 Chat with {receiver?.name}</h2>

      <div className="chat-box">
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray" }}>
            No messages yet...
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={
                msg.sender === currentUser ? "sender" : "receiver"
              }
            >
              <span>{msg.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="bottom">
        <input
          type="text"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;