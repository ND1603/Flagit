import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
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
          🚩 {t.appName}
        </Link>
        <div className="hidden sm:flex gap-4 text-sm items-center">
          <Link to="/" className="hover:text-yellow-400 transition">{t.map}</Link>
          <Link to="/feed" className="hover:text-yellow-400 transition">{t.feed}</Link>
          <Link to="/about" className="hover:text-yellow-400 transition">{t.about}</Link>
          {user ? (
            <>
              <Link to="/submit" className="hover:text-yellow-400 transition">{t.report}</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-yellow-400 transition">{t.dashboard}</Link>
              )}
              <Link to="/profile" className="hover:text-yellow-400 transition">{t.profile}</Link>
              <button onClick={handleLogout} className="hover:text-red-400 transition">{t.logout}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">{t.login}</Link>
              <Link to="/register" className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-medium hover:bg-yellow-300 transition">{t.register}</Link>
            </>
          )}
          <button
            onClick={toggleLanguage}
            className="bg-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-600 transition"
          >
            {language === 'en' ? 'አማርኛ' : 'English'}
          </button>
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
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.map}</Link>
          <Link to="/feed" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.feed}</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.about}</Link>
          {user ? (
            <>
              <Link to="/submit" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.report}</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.dashboard}</Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.profile}</Link>
              <button onClick={handleLogout} className="text-left hover:text-red-400">{t.logout}</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.login}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">{t.register}</Link>
            </>
          )}
          <button
            onClick={toggleLanguage}
            className="text-left text-yellow-400"
          >
            {language === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>
      )}
    </nav>
  );
}
