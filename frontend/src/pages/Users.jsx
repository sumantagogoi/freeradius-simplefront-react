import { useState, useEffect, useMemo } from 'react';
import { listUsers, deleteUser } from '../api/users';
import UserModal from '../components/UserModal';
import AddUserModal from '../components/AddUserModal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('username');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    listUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.value.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      const va = (a[sortKey] || '').toString().toLowerCase();
      const vb = (b[sortKey] || '').toString().toLowerCase();
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [users, search, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="ml-1 text-gray-600">↕</span>;
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const handleDelete = async (e, id, username) => {
    e.stopPropagation();
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (e) {
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
        >
          + Add User
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by username or password..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
      />

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th
                className="text-left px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSort('id')}
              >
                ID <SortIcon col="id" />
              </th>
              <th
                className="text-left px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSort('username')}
              >
                Username <SortIcon col="username" />
              </th>
              <th className="text-left px-4 py-3">Password</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-gray-700 hover:bg-gray-750 cursor-pointer"
                    onClick={() =>
                      setSelectedUser(
                        users.find((x) => x.id === u.id)
                      )
                    }
                  >
                    <td className="px-4 py-3 text-gray-400">{u.id}</td>
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      <span
                        className="flex items-center gap-2"
                        onMouseEnter={() => setHoveredId(u.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <span>
                          {hoveredId === u.id
                            ? u.value
                            : '•'.repeat(Math.min(u.value.length, 20))}
                        </span>
                        <span className="text-gray-500 select-none text-sm">
                          {hoveredId === u.id ? '🙈' : '👁️'}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => handleDelete(e, u.id, u.username)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          username={selectedUser.username}
          onClose={() => setSelectedUser(null)}
          onUpdated={fetchUsers}
        />
      )}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
