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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard - Manage Users</h2>

      <table className="min-w-full border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Username</th>
            <th className="p-3 border-b">Current Role</th>
            <th className="p-3 border-b">Change Role to</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userId = user._id;
            const actualRole = originalRoles[userId] ?? 0;
            const selectedRole = roleChanges[userId] ?? actualRole;

            return (
              <tr key={userId} className="hover:bg-gray-50">
                <td className="p-3 border-b text-center">{user.username}</td>
                <td className="p-3 border-b text-center">{getRoleLabel(user)}</td>
                <td className="p-3 border-b text-center">
                  <select
                    value={selectedRole}
                    onChange={(e) =>
                      handleSelectChange(userId, parseInt(e.target.value, 10))
                    }
                    className="border px-2 py-1 rounded"
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
        <button
          onClick={handleUpdateRoles}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Roles
        </button>
      )}
    </div>
  );
};

export default AdminDash;
