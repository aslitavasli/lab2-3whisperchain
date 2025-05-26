import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlaggedMessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // get all flagged msgs
    axios.get('http://localhost:5000/messages/flagged-by-moderator')
      .then((response) => {
        setMessages(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading flagged messages...</div>;
  if (error) return <div>Error: Something went wrong ;/ {error.message}</div>;

  if (messages.length === 0) {
    return <div>No flagged messages sent by moderators.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>Flagged Messages (Moderator)</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg) => (
          <li
            key={msg._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 12,
              marginBottom: 12,
              background: "#fffbe6",
            }}
          >
            <div><strong>Message:</strong> {msg.text}</div>
            <div><strong>Flag Reason:</strong> {msg.flagReason}</div>
            <div><strong>Flagged By:</strong> {msg.flaggedBy}</div>
            <div><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlaggedMessagesScreen;
