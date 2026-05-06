import { useState, useEffect } from 'react';
import { getUser, updateUser } from '../api/users';

export default function UserModal({ user, onClose, onUpdated }) {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUser(user.username)
      .then((u) => {
        setData(u);
        setPassword(u.password);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.username]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(user.username, { password });
      onUpdated();
      onClose();
    } catch (e) {
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 shadow-2xl">
          <p className="text-gray-500 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 shadow-2xl">
          <p className="text-red-400 text-center">User not found</p>
          <button onClick={onClose} className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{data.username}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">ID</label>
            <p className="text-gray-300">{data.id}</p>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Username</label>
            <p className="text-white font-medium">{data.username}</p>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
            />
          </div>

          {data.full_name && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              <p className="text-gray-300">{data.full_name}</p>
            </div>
          )}
          {data.email && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <p className="text-gray-300">{data.email}</p>
            </div>
          )}
          {data.phone && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <p className="text-gray-300">{data.phone}</p>
            </div>
          )}
          {data.notes && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Notes</label>
              <p className="text-gray-300">{data.notes}</p>
            </div>
          )}
          {!data.full_name && !data.email && !data.phone && !data.notes && (
            <p className="text-gray-500 text-sm">No additional details</p>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded text-white transition"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
