import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDash = () => {
  const [users, setUsers] = useState([]);
  const [originalRoles, setOriginalRoles] = useState({});
  const [roleChanges, setRoleChanges] = useState({});
  const [currUserId, setCurrUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrUserId(payload.id);
    } catch (error) {
      console.error('Invalid token', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:9090/api/users/all-admin', {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((res) => {
        const filteredUsers = res.data.filter((user) => user._id !== currUserId);
        setUsers(filteredUsers);

        const rolesSnapshot = {};
        filteredUsers.forEach((user) => {
          rolesSnapshot[user._id] = user.isAdmin ? 2 : user.isModerator ? 1 : 0;
        });
        setOriginalRoles(rolesSnapshot);
      })
      .catch((err) => console.error('Failed to fetch users:', err));
  }, [currUserId]);

  const getRoleLabel = (user) => {
    if (user.isAdmin) return 'Admin';
    if (user.isModerator) return 'Moderator';
    return 'User';
  };

  const handleSelectChange = (userId, newRole) => {
    const originalRole = originalRoles[userId];
    if (newRole !== originalRole) {
      setRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
    } else {
      setRoleChanges((prev) => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleUpdateRoles = () => {
    const token = localStorage.getItem('token');
    const updateRequests = Object.entries(roleChanges).map(([userId, newRole]) =>
      axios.put(
        `http://localhost:9090/api/admin/user/role/${userId}`,
        { role: newRole },
        { headers: { Authorization: 'Bearer ' + token } }
      )
    );

    Promise.all(updateRequests)
      .then(() => {
        // Refresh user data
        axios
          .get('http://localhost:9090/api/users/all-admin', {
            headers: { Authorization: 'Bearer ' + token },
          })
          .then((res) => {
            const filteredUsers = res.data.filter((user) => user._id !== currUserId);
            setUsers(filteredUsers);

            const rolesSnapshot = {};
            filteredUsers.forEach((user) => {
              rolesSnapshot[user._id] = user.isAdmin ? 2 : user.isModerator ? 1 : 0;
            });
            setOriginalRoles(rolesSnapshot);
            setRoleChanges({});
          });
      })
      .catch((err) => {
        console.error('Failed to update roles:', err);
      });
  };

 return (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
    fontFamily: 'sans-serif',
  
  }}>
    <div style={{
      width: '100%',
      maxWidth: '900px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      padding: '30px'
    }}>
      <h2 style={{
        marginTop: 0,
        marginBottom: '30px',
        color: '#4f46e5',
        textAlign: 'center'
      }}>
        🔧 Admin Dashboard – Manage Users
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f9f9f9', color: '#555' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Current Role</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Change Role To</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userId = user._id;
            const actualRole = originalRoles[userId] ?? 0;
            const selectedRole = roleChanges[userId] ?? actualRole;

            return (
              <tr key={userId} style={{ borderBottom: '1px solid #eee', backgroundColor: '#fff' }}>
                <td style={{ padding: '12px' }}>{user.username}</td>
                <td style={{ padding: '12px' }}>{getRoleLabel(user)}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={selectedRole}
                    onChange={(e) =>
                      handleSelectChange(userId, parseInt(e.target.value, 10))
                    }
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      fontSize: '1rem'
                    }}
                  >
                    <option value={0}>User</option>
                    <option value={1}>Moderator</option>
                    <option value={2}>Admin</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {Object.keys(roleChanges).length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleUpdateRoles}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✅ Update Roles
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default AdminDash;
