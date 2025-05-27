import React, { useState, useEffect } from 'react';
import SenderForm from './SenderForm';
import RecipientInbox from './RecipientInbox';
import LogoutButton from './LogoutButton';
import ModeratorPanel from './ModeratorPanel';
import AdminDash from './AdminDash'; 
import AdminPanel from './AdminPanel';

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
  <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
    <div style={{ marginBottom: '20px' }}>
      <LogoutButton />
      <h1> </h1>
    </div>

    {userInfo.isAdmin && (
      <>
        <h3 style={{ color: '#4f46e5', marginBottom: '20px' }}>
          Welcome, Admin {userInfo.username}
        </h3>
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <AdminPanel />
          <AdminDash />
        </div>
      </>
    )}

    {userInfo.isModerator && !userInfo.isAdmin && (
      <>
        <h3 style={{ color: '#4f46e5', marginBottom: '20px' }}>
          Welcome, {userInfo.username}. Please review all current flagged messages.
        </h3>
        <ModeratorPanel />
      </>
    )}

    {!userInfo.isModerator && !userInfo.isAdmin && (
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        <SenderForm />
        <RecipientInbox />
      </div>
    )}
  </div>
);

}

export default Dashboard;
