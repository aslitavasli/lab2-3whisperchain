import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

function SenderForm() {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:9090/api/users/all', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    }).then(res => setUsers(res.data));
  
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      setUsername(payload.username);
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }, 
  []);

  
  const handleSend = async (e) => {
    try{
    e.preventDefault();

    const recipient = users.find(u => u.username === recipientUsername);
    if (!recipient || !recipient.publicKey) {
      alert('Recipient or public key missing');
      return;
    }

    const publicKeyBinary = Uint8Array.from(atob(recipient.publicKey), c => c.charCodeAt(0));

    const importedKey = await window.crypto.subtle.importKey(
      'spki',
      publicKeyBinary.buffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      importedKey,
      new TextEncoder().encode(message)
    );

    console.log(encrypted)

    await axios.post('http://localhost:9090/api/messages/send', {
      recipientUsername,
      senderUsername: username,
      encryptedMessage: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    alert('Message sent');
    setMessage('');
  } catch (err){
     if (err.response?.status === 480) {
      console.log(err.response)
        alert(err.response.data.message);
      } else {
        alert('Error, please try again.');
      }
  }
  };

   return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <form onSubmit={handleSend} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '40px',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '350px'
      }}>
        <h3 style={{ margin: 0, color: '#333', textAlign: 'center' }}>
          Hello, {username}!
        </h3>
        <h3 style={{ margin: 0, color: '#4f46e5', textAlign: 'center' }}>
          Send Encrypted Message
        </h3>
        <select
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">Select Recipient</option>
          {users
            .filter(user => user.username !== username)
            .map(user => (
              <option key={user._id} value={user.username}>
                {user.username}
              </option>
            ))}
        </select>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something nice..."
          style={{
            padding: '10px',
            height: '100px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            resize: 'vertical'
          }}
        />
        <button type="submit" style={{
          padding: '10px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#4f46e5',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </form>
    </div>
  );
}


export default SenderForm;
