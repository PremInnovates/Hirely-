// components/Navbar.jsx
// Site-wide top navigation. Renders Login/Register when logged out, and
// the user's name + a profile dropdown (Profile, Settings, Logout) when
// logged in. Used on the landing page, auth screens, and the temporary
// Phase 2 dashboard - replaced by the full in-app Navbar + Sidebar in
// Phase 3, but this component keeps working as-is once that's added.

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close the dropdown when clicking anywhere outside it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast.success('Logged out.');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-ink">
            Hire<span className="text-primary-500">ly.</span>
          </span>
        </Link>

        {!isAuthenticated && (
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="/#how-it-works" className="hover:text-ink">How it works</a>
            <a href="/#categories" className="hover:text-ink">Categories</a>
            <NavLink to="/login" className="hover:text-ink">Log in</NavLink>
          </nav>
        )}

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <span className="max-w-[10rem] truncate">{user?.name || 'Account'}</span>
              <FiChevronDown size={14} className="text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-slate-50"
                >
                  <FiUser size={15} /> Profile
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-slate-50"
                >
                  <FiSettings size={15} /> Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-danger hover:bg-red-50"
                >
                  <FiLogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
