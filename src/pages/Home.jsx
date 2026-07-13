import "../App.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser && selectedUser) {
      fetchMessages();
    }
  }, [currentUser, selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get(
        `/message?sender=${currentUser}&receiver=${selectedUser._id}`
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
        receiver: selectedUser._id,
        message: text,
      });

      setText("");
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app">

      {/* LEFT SIDE */}

      <div className="sidebar">

        <h2>MERN Chat</h2>

        <select
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        >
          <option value="">Select Current User</option>

          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        {users
          .filter((u) => u._id !== currentUser)
          .map((user) => (
            <div
              key={user._id}
              className={`user-card ${
                selectedUser?._id === user._id ? "active-user" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              👤 {user.name}
            </div>
          ))}
      </div>

      {/* RIGHT SIDE */}

  <div className="chat-area">
  {selectedUser ? (
    <>
      <div className="chat-header">
        <h2>👤 {selectedUser.name}</h2>
      </div>

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
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </>
  ) : (
    <div className="welcome">
      <h2>Welcome 👋</h2>
      <p>Select a user from the left to start chatting.</p>
    </div>
  )}
</div>

</div>
);
}

export default Home;