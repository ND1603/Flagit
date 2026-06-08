import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-yellow-400">
          🚩 Flagit
        </Link>

        <div className="hidden sm:flex gap-4 text-sm items-center">
          <Link to="/" className="hover:text-yellow-400 transition">Map</Link>
          <Link to="/feed" className="hover:text-yellow-400 transition">Feed</Link>
          <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
          {user ? (
            <>
              <Link to="/submit" className="hover:text-yellow-400 transition">+ Report</Link>
              {user?.role === 'admin' && (
  <Link to="/admin" className="hover:text-yellow-400 transition">Dashboard</Link>
)}
              <Link to="/profile" className="hover:text-yellow-400 transition">Profile</Link>
              <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
              <Link to="/register" className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-medium hover:bg-yellow-300 transition">Register</Link>
            </>
          )}
        </div>

        <button
          className="sm:hidden text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 pt-3 pb-1 text-sm border-t border-gray-700 mt-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Map</Link>
          <Link to="/feed" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Feed</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">About</Link>
          {user ? (
            <>
              <Link to="/submit" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">+ Report</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Profile</Link>
              <button onClick={handleLogout} className="text-left hover:text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
