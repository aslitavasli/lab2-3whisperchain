import React from 'react';
import SenderForm from './SenderForm';
import RecipientInbox from './RecipientInbox';
import LogoutButton from './LogoutButton';

function Dashboard() {

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
      <LogoutButton> </LogoutButton>
        </div>
    <SenderForm />
      <RecipientInbox />
      {/* Add moderator and admin views here later */}
    </div>
  );
}

export default Dashboard;
