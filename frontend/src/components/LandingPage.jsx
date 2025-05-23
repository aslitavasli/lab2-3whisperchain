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
      width: '100vw'
    }}>
      <h1>Just trying this out!</h1>
      <div>
        <Link to="/register">
          <button style={{ marginRight: '10px' }}>Register</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
