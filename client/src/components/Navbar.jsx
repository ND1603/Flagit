import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg text-yellow-400">
        🚩 Flagit
      </Link>

      <div className="flex gap-4 text-sm items-center">
        <Link to="/" className="hover:text-yellow-400 transition">
          Map
        </Link>
        <Link to="/feed" className="hover:text-yellow-400 transition">
          Feed
        </Link>

        {user ? (
          <>
            <Link
              to="/submit"
              className="hover:text-yellow-400 transition"
            >
              + Report
            </Link>
            <Link
              to="/profile"
              className="hover:text-yellow-400 transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-yellow-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-medium hover:bg-yellow-300 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}