import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f9f9fb',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '1rem',
        color: '#333'
      }}>
        Welcome to Whisper Chain
      </h1>
      <p style={{
        fontSize: '1.2rem',
        marginBottom: '2rem',
        color: '#555'
      }}>
        A place to share thoughts anonymously and connect authentically.
      </p>
      <div>
        <Link to="/register">
          <button style={{
            marginRight: '10px',
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4f46e5',
            color: 'white',
            cursor: 'pointer'
          }}>
            Register
          </button>
        </Link>
        <Link to="/login">
          <button style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #4f46e5',
            backgroundColor: 'white',
            color: '#4f46e5',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
