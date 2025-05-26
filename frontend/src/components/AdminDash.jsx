import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDash = () => {
  const [users, setUsers] = useState([]);
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
      })
      .catch((err) => console.error('Failed to fetch users:', err));
  }, [currUserId]);

  const getRoleLabel = (user) => {
    if (user.isAdmin) return 'Admin';
    if (user.isModerator) return 'Moderator';
    return 'User';
  };

  const handleRoleChange = (userId, roleValue) => {
    const token = localStorage.getItem('token');

    axios
      .put(
        `http://localhost:9090/api/admin/user/role/${userId}`,
        { role: roleValue },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      .then((res) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === res.data.user._id ? res.data.user : u
          )
        );
      })
      .catch((err) => console.error('Role update failed:', err));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard - Manage Users</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Username</th>
            <th className="p-3 border-b">Role</th>
            <th className="p-3 border-b">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const currentRole = user.isAdmin ? 2 : user.isModerator ? 1 : 0;
            return (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-3 border-b text-center">{user.username}</td>
                <td className="p-3 border-b text-center">{getRoleLabel(user)}</td>
                <td className="p-3 border-b text-center">
                  <select
                    value={currentRole}
                    onChange={(e) =>
                      handleRoleChange(user._id, parseInt(e.target.value, 10))
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
    </div>
  );
};

export default AdminDash;
