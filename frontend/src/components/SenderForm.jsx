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
    <form onSubmit={handleSend}>
      <h3>Hello, {username}! </h3>
      <h3> Send Encrypted Message</h3>
      <select value={recipientUsername} onChange={(e) => setRecipientUsername(e.target.value)}>
        <option value="">Select Recipient</option>
       {users
      .filter(user => user.username !== username)
      .map(user => (
        <option key={user._id} value={user.username}>
        {user.username}
        </option>
))}
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type='submit'>Send</button>
    </form>
  );
}

export default SenderForm;
