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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
