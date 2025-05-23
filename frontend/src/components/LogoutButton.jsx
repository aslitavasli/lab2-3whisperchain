import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication token or user data
    localStorage.removeItem('token'); // or whatever key you use
    // Optionally clear all localStorage: localStorage.clear();

    // Redirect to login or home page
    navigate('/login'); // change path as needed
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
