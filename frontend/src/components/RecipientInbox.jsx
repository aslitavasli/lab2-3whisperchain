import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
function RecipientInbox() {
  const [messages, setMessages] = useState([]);
  const [privateKey, setPrivateKey] = useState(null);
  const [userId, setUserId] = useState(null);
  const [decrypted, setDecrypted] = useState(false);
  const [modKey, setModKey] = useState(null);
  const [modID, setmodID] = useState(null)
  const [token, setToken] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setToken(token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }, []);

  const loadKey = async (e) => {
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const key = await window.crypto.subtle.importKey(
      'pkcs8',
      arrayBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt']
    );
    setPrivateKey(key);
    alert('Key loaded!');
  };

  async function getModeratorPublicKey(token) {
  try {
    const response = await axios.get('http://localhost:9090/api/moderation/mod-pub-key', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setmodID(response.data.id)
    console.log('mod id is', response.data.id)
    return response.data.publicKey;
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.error);
    } else {
      console.error('Network or server error:', error.message);
    }
    return null;
  }
} 

  const fetchMessages = async () => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `http://localhost:9090/api/messages/inbox/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const decryptedMessages = await Promise.all(
      res.data.map(async (msg) => {
        try {
          const decrypted = await window.crypto.subtle.decrypt(
            { name: 'RSA-OAEP' },
            privateKey,
            Uint8Array.from(atob(msg.encryptedMessage), c => c.charCodeAt(0)).buffer
          );
          const decodedMessage = new TextDecoder().decode(decrypted);
          return {
            id: msg._id,
            sender: msg.sender,
            text: decodedMessage,
            flagged: msg.flagged || false,
          };
        } catch (err) {
          console.error('Decryption failed:', err);
          return null;
        }
      })
    );
    setMessages(decryptedMessages.filter(Boolean));
    setDecrypted(true);
  };

  const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
};

  const sendToModerator = async ({ message, id, sender}) => {
    console.log('message is ', message)
  try {
     const res = await axios.post('http://localhost:9090/api/moderation/report', {
      message,
      id,
      sender,
      modID: modID
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    alert('Message sent to moderator.');
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('Error sending to moderator:', error);
    throw error;
  }
};

const handleFlag = async (flaggedMsg) => {
  try {
    console.log('tryna flag', flaggedMsg)
  
   
      const res_key = await getModeratorPublicKey(token)
      console.log('res key is, ', res_key)

      setModKey(res_key)

       const keyBuffer = base64ToArrayBuffer(res_key);

    const importedKey = await window.crypto.subtle.importKey(
      'spki',
      keyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      importedKey,
      new TextEncoder().encode(flaggedMsg.text)
    );

    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));

    // 6. Send `encryptedBase64` to your moderator endpoint…
    const res = await sendToModerator({message: encryptedBase64, id: flaggedMsg.id, sender: flaggedMsg.sender});
    
     setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === flaggedMsg.id ? { ...msg, flagged: true } : msg
      )
    );
  } catch (err) {
    console.error('Failed to encrypt flagged message:', err);
  }
};


  const inboxMessages = messages.filter((msg) => !msg.flagged);
  const flaggedMessages = messages.filter((msg) => msg.flagged);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3>📩 Inbox</h3>
      <input type="file" onChange={loadKey} accept=".txt" style={{ marginBottom: '10px' }} />
      <br />
      <button onClick={fetchMessages} disabled={!privateKey} style={{ marginBottom: '20px' }}>
        Load Messages
      </button>

     {decrypted && (
  <>
    {inboxMessages.length > 0 ? (
      inboxMessages.map((msg) => (
        <div
          key={msg.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9',
            position: 'relative',
          }}
        >
          <span
            style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
            onClick={() => handleFlag(msg)}
            title="Flag this message"
          >
            🚩
          </span>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>From:</strong> {msg.sender}
          </p>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
        </div>
      ))
    ) : (
      <p>No messages in inbox.</p>
    )}

    {flaggedMessages.length > 0 && (
      <>
        <h3>🚩 Flagged</h3>
        {flaggedMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              border: '1px solid #f99',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#fee',
              position: 'relative',
            }}
          >
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>From:</strong> {msg.sender}
            </p>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
          </div>
        ))}
      </>
    )}
  </>
)}

    </div>
  );
}

export default RecipientInbox;
