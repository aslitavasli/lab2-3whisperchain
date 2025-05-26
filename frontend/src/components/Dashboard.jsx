import React, { useState, useEffect } from 'react';
import SenderForm from './SenderForm';
import RecipientInbox from './RecipientInbox';
import LogoutButton from './LogoutButton';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded user info:', decoded);
        setUserInfo(decoded);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);



  return (
    <div>
      <h2>Das2h</h2>
      <p>Welcome, {userInfo.username || 'user'}!</p>
      <div>
        <LogoutButton />
      </div>
      {userInfo.role == }
      <SenderForm />
      <RecipientInbox />

    </div>
  );
}

export default Dashboard;
