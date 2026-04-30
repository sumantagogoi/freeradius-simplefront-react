import { useState, useEffect } from 'react';
import { listUsers } from '../api/users';

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listUsers()
      .then((users) => setTotalUsers(users.length))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const Card = ({ title, value, sub }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-3xl font-bold mt-2">
        {loading ? '...' : value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total RADIUS Users" value={totalUsers} sub="Registered in database" />
        <Card title="Active Sessions Today" value="—" sub="Coming with accounting" />
        <Card title="Logged In Yesterday" value="—" sub="Coming with accounting" />
      </div>
    </div>
  );
}
