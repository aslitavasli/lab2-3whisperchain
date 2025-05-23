import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const generateKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    const pubBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
    const privBlob = new Blob([privateKey], { type: 'application/octet-stream' });

    return { pubBase64, privBlob };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Generate key pair
      const { pubBase64, privBlob } = await generateKeyPair();

      // Step 2: Attempt registration
      const res = await axios.post('/auth/register', {
        username,
        password,
        publicKey: pubBase64,
      });

      // Step 3: If successful, allow private key download
      if (res.status === 201) {
        const url = URL.createObjectURL(privBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mykeyforwhisperchain.txt';
        a.click();

        alert('Registered successfully. Your private key has been downloaded. Now, please log in.');
        navigate('/login');
      } else {
        alert('Unexpected response. Please try again.');
      }
    } catch (err) {
      if (err.response?.status === 500) {
        alert('This username already exists, pick a new one.');
      } else {
        alert('Error, please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>Register</button>
    </form>
  );
}

export default Register;
