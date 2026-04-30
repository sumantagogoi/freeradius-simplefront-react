import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">RADIUS Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.username}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/users" className={linkClass}>Users</NavLink>
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
