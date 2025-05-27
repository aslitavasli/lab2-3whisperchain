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


  const sendToAdmin = async (sender, flaggedmsg) => {
      console.log(sender)
  try {
      const res = await axios.post(
      `http://localhost:9090/api/admin/ban/${sender}`,
      {}, 
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      }
    );

    alert('Ban request made to the admin.');
    console.log(res.data);
    
      //on the frontend, move the message to the 'reviewed messages' section
     setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === flaggedmsg.id ? { ...msg, flagged: true } : msg
      )
    )
  } catch (error) {
    console.error('Error sending to moderator:', error);
    throw error;
  }
};

const handleBan = async (sender, flaggedmsg) => {
  try {
    console.log('tryna ban person w id', sender)
  
    await sendToAdmin(sender, flaggedmsg);

  } catch (err) {
    console.error(err);
    alert("Something went wrong, please try again!")
  }
  //update the frontend and change review message to reviewed
  handleDontBan(flaggedmsg)
};

const handleDontBan = async(flaggedmsg)=>{
 
    //change the message's flag from the backend (make it true)
    try {
     const res = await axios.post(`http://localhost:9090/api/messages/change-review-status/${flaggedmsg.id}`, {
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    console.log(res)
}catch (error){
console.log(error)
    }
    //on the frontend, move the message to the 'reviewed messages' section
     setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === flaggedmsg.id ? { ...msg, flagged: true } : msg
      )
    );
    
}

  const inboxMessages = messages.filter((msg) => !msg.flagged);
  const flaggedMessages = messages.filter((msg) => msg.flagged);

 return (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
    fontFamily: 'sans-serif',
  }}>
    <div style={{
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      padding: '30px'
    }}>
      <h3 style={{ color: '#4f46e5', marginTop: 0 }}>📩 Load Your Inbox</h3>

      <input
        type="file"
        onChange={loadKey}
        accept=".txt"
        style={{
          marginBottom: '15px',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          width: '100%'
        }}
      />

      <button
        onClick={fetchMessages}
        disabled={!privateKey}
        style={{
          marginBottom: '25px',
          padding: '10px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: privateKey ? '#4f46e5' : '#ccc',
          color: 'white',
          fontWeight: 'bold',
          width: '100%',
          cursor: privateKey ? 'pointer' : 'not-allowed'
        }}
      >
        Load Messages
      </button>

      {decrypted && (
        <>
          {inboxMessages.length > 0 && (
            <>
              <h3 style={{ color: '#e11d48' }}>Messages to Review</h3>
              {inboxMessages.map((msg) => (
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
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleBan(msg.sender, msg)}
                    >
                      🚫 Ban
                    </button>
                    <button
                      style={{
                        backgroundColor: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleDontBan(msg)}
                    >
                      ✅ Don't Ban
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {flaggedMessages.length > 0 && (
            <>
              <h3 style={{ color: '#64748b' }}>Reviewed Messages</h3>
              {flaggedMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '15px',
                    backgroundColor: '#f4f4f4',
                  }}
                >
                  <p><strong>From:</strong> {msg.sender}</p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  </div>
);
}

export default ModeratorPanel;
