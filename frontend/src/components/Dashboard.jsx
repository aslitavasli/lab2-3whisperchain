import React, { useState, useEffect } from 'react';
import SenderForm from './SenderForm';
import RecipientInbox from './RecipientInbox';
import LogoutButton from './LogoutButton';
import ModeratorPanel from './ModeratorPanel';

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
      <h2>Dashboard</h2>
    
      <div>
        <LogoutButton />
      </div>
      {userInfo.isModerator && <>
        <h3>Welcome, {userInfo.username || 'user'}. Please review all current flagged messages.</h3>
        <ModeratorPanel/> </>}

      {!userInfo.isModerator &&
      <>
      <SenderForm />
      <RecipientInbox /> 
      </>}  

    </div>
  );
}

export default Dashboard;
