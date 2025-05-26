import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDash() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
    // Fetch messages received by the moderator
//     axios.get('http://localhost:5173/api/messages/received', {
//       headers: { Authorization: 'Admin? ' + localStorage.getItem('token') }
//     })
//       .then(res => {
//         setMessages(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         alert('Failed to fetch messages.');
//         setLoading(false);
//       });
//   }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f7fa'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Messages Received by Moderator</h2>
        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888' }}>No messages received.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((msg, idx) => (
              <li key={msg._id || idx} style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                background: '#f1f3f6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  From: {msg.senderUsername || 'Unknown'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.message || '[No message content]'}
                </div>
                <div style={{ fontSize: '0.85em', color: '#888', marginTop: '0.5rem' }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDash;
