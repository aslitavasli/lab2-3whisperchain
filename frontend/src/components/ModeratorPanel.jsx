import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
function ModeratorPanel() {
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

  // 
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

const handleBan = async (sender) => {
  try {
    console.log('tryna ban person w id', sender)
  
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
    await sendToModerator({message: encryptedBase64, id: flaggedMsg.id, sender: flaggedMsg.sender});

  } catch (err) {
    console.error('Failed to encrypt flagged message:', err);
  }
};

const handleDontBan = async(msg)=>{
 
    //change the message's flag from the backend (make it true)
    try {
     const res = await axios.post(`http://localhost:9090/messages/change-review-status/${msg.msg.id}`, {
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    console.log(res)
}catch (error){
console.log(error)
    }
    //on the frontend, move the message to the 'reviewed messages' section

}

  const inboxMessages = messages.filter((msg) => !msg.flagged);
  const flaggedMessages = messages.filter((msg) => msg.flagged);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3>📩 Load Your Inbox</h3>
      <input type="file" onChange={loadKey} accept=".txt" style={{ marginBottom: '10px' }} />
      <br />
      <button onClick={fetchMessages} disabled={!privateKey} style={{ marginBottom: '20px' }}>
        Load Messages
      </button>

      {decrypted && (
        <> 
    
          {inboxMessages.length > 0 && (
  <>
    <h3>Messages to Review</h3>
    {inboxMessages.map((msg) => (
      <div key={msg.id} style={{ border: '1px solid #f99', borderRadius: '10px', padding: '15px', marginBottom: '15px', backgroundColor: '#fee', position: 'relative' }}>
        <p style={{ margin: '0 0 8px 0' }}><strong>From:</strong> {msg.sender}</p>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button
            style={{
              backgroundColor: '#ff4d4f',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onClick={()=> handleBan({sender:msg.sender})}
          >
            🚫 Ban
          </button>
          <button
            style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onClick={() => handleDontBan({msg})}
          >
            ✅ Don't Ban
          </button>
        </div>
      
      </div>
      

    ))}

     {flaggedMessages.length > 0 && (
  <>
    <h3>Reviewed Messages</h3>
    {flaggedMessages.map((msg) => (
      <div key={msg.id} style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginBottom: '15px', backgroundColor: '#f4f4f4' }}>
        <p><strong>From:</strong> {msg.sender}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
      </div>
    ))}
  </>
)}
  </>
)}

        </>
      )}
    </div>
  );
}

export default ModeratorPanel;
