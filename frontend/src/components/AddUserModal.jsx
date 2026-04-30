import { useState, useRef, useEffect } from 'react';
import { createUser } from '../api/users';
import client from '../api/client';

export default function AddUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createUser({ username: form.username, password: form.password });

      const extras = [];
      if (form.fullName) extras.push({ attribute: 'Full-Name', value: form.fullName });
      if (form.email) extras.push({ attribute: 'Email', value: form.email });
      if (form.phone) extras.push({ attribute: 'Phone', value: form.phone });
      if (form.notes) extras.push({ attribute: 'Notes', value: form.notes });

      for (const ext of extras) {
        await client.post('/radius/users', {
          username: form.username,
          attribute: ext.attribute,
          op: ':=',
          value: ext.value,
        });
      }
      onCreated();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500';
  const labelClass = 'block text-xs text-gray-400 mb-1';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Add User</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className={labelClass} htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" value={form.fullName} onChange={set('fullName')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="username">Username *</label>
            <input ref={usernameRef} id="username" type="text" value={form.username} onChange={set('username')} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Password *</label>
            <input id="password" type="text" value={form.password} onChange={set('password')} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={set('email')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input id="phone" type="text" value={form.phone} onChange={set('phone')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="notes">Notes</label>
            <textarea id="notes" value={form.notes} onChange={set('notes')} rows={3} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button type="submit" disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded text-white transition">
            {saving ? 'Adding...' : 'Add User'}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
