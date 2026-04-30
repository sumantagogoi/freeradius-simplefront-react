import { useState, useEffect } from 'react';
import { updateUser } from '../api/users';
import client from '../api/client';

const EXTRA_FIELDS = ['Full-Name', 'Email', 'Phone', 'Notes'];
const FIELD_LABELS = {
  'Full-Name': 'Full Name',
  Email: 'Email',
  Phone: 'Phone',
  Notes: 'Notes',
};

export default function UserModal({ user, onClose, onUpdated }) {
  const [value, setValue] = useState(user.value);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all radcheck entries for this user
  useEffect(() => {
    client
      .get('/radius/users', { params: { username: user.username, all: true } })
      .then(({ data }) => {
        setExtras(data.filter((e) => e.attribute !== 'Cleartext-Password'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.username]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(user.id, { value });
      onUpdated();
      onClose();
    } catch (e) {
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{user.username}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Static details */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">ID</label>
            <p className="text-gray-300">{user.id}</p>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Username</label>
            <p className="text-white font-medium">{user.username}</p>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
            />
          </div>

          {/* Extra fields from radcheck */}
          {loading ? (
            <p className="text-gray-500 text-sm">Loading details...</p>
          ) : extras.length === 0 ? (
            <p className="text-gray-500 text-sm">No additional details</p>
          ) : (
            extras.map((entry) => (
              <div key={entry.id}>
                <label className="block text-xs text-gray-400 mb-1">
                  {FIELD_LABELS[entry.attribute] || entry.attribute}
                </label>
                <p className="text-gray-300">{entry.value}</p>
              </div>
            ))
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
