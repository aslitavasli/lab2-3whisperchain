import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      '/auth/login',
      { username, password },
      { withCredentials: true }
    );

    const token = res.data.token; 
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      alert('Login failed: token not received');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed');
  }
};


 return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <form onSubmit={handleLogin} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '40px',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '300px'
      }}>
        <h2 style={{
          margin: 0,
          textAlign: 'center',
          color: '#333'
        }}>Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
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
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
