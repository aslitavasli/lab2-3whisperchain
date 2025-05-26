import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  // On mount: retrieve token and decode userId
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    try {
      setToken(storedToken);
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      setUserId(payload.userId);
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }, []);

  // Once userId is set, fetch messages
  useEffect(() => {
    if (userId && token) {
      fetchMessages(userId, token);
    }
  }, [userId, token]);

  const fetchMessages = async (adminId, authToken) => {
    try {
      const res = await axios.get(
        `http://localhost:9090/api/messages/inbox/${adminId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch admin inbox:', err);
    }
  };

  const handleBan = async (userToBanId) => {
    try {
      await axios.delete(
      `http://localhost:9090/api/admin/admin-ban/${userToBanId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

      alert(`User with ID ${userToBanId} has been banned.`);

      // Remove from view
      setMessages((prev) => prev.filter((msg) => msg.userId !== userToBanId));
    } catch (err) {
      console.error('Ban failed:', err);
      alert('Failed to ban user.');
    }

      fetchMessages(userId, token);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🔒 Admin Panel</h2>
      <h4>Users requested to be banned by the moderators:</h4>

      {messages.length === 0 ? (
        <p>No users to review.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.userId}
            style={{
              border: '1px solid #faa',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#fee',
            }}
          >
            <p><strong>User ID:</strong> {msg.sender}</p>
            <button
              onClick={() => handleBan(msg.sender)}
              style={{
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🚫 Ban
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPanel;
