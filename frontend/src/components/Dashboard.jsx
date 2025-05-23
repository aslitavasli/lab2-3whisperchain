import React from 'react';
import SenderForm from './SenderForm';
import RecipientInbox from './RecipientInbox';

function Dashboard() {

  return (
    <div>
      <h2>Dashboard</h2>
    <SenderForm />
      <RecipientInbox />
      {/* Add moderator and admin views here later */}
    </div>
  );
}

export default Dashboard;
