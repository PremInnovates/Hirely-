
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import {
  FiGrid, FiUsers, FiBriefcase, FiFileText, FiMessageSquare, FiBell,
  FiBookmark, FiSettings, FiUser, FiLogOut, FiMenu, FiZap,
  FiChevronDown
} from 'react-icons/fi';

const ownerLinks = [
  { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/freelancers', label: 'Find talent', icon: FiUsers },
  { to: '/projects', label: 'My projects', icon: FiBriefcase },
  { to: '/hiring', label: 'Hiring requests', icon: FiFileText },
  { to: '/contracts', label: 'Contracts', icon: FiBookmark },
  { to: '/messages', label: 'Messages', icon: FiMessageSquare },
  { to: '/notifications', label: 'Notifications', icon: FiBell },
  { to: '/saved', label: 'Saved talent', icon: FiBookmark },
];

const freelancerLinks = [
  { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/projects', label: 'Explore projects', icon: FiBriefcase },
  { to: '/hiring', label: 'Invitations', icon: FiFileText },
  { to: '/contracts', label: 'My contracts', icon: FiBookmark },
  { to: '/messages', label: 'Messages', icon: FiMessageSquare },
  { to: '/notifications', label: 'Notifications', icon: FiBell },
];

export default function AppShell({ children, title, subtitle, action }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isOwner = user?.role === 'BUSINESS_OWNER';
  const links = isOwner ? ownerLinks : freelancerLinks;

  const signOut = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    toast.success('You have been logged out.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="mobile-scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <Link to="/" className="brand">
          <span className="brand-mark"><FiZap /></span>
          <span>hirely<span className="brand-period">.</span></span>
        </Link>

        <div className="workspace-label">WORKSPACE</div>

        <div className="workspace-switch">
          <span className="workspace-avatar">
            {(user?.businessName || user?.name || 'H').charAt(0).toUpperCase()}
          </span>
          <span className="workspace-copy">
            <b>{user?.businessName || user?.name || 'My workspace'}</b>
            <small>{isOwner ? 'Business workspace' : 'Freelancer account'}</small>
          </span>
          <FiChevronDown size={15} />
        </div>

        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `side-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Notifications' && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><FiZap /></div>
            <b>Build something great</b>
            <p>Great work starts with the right connection.</p>
            <Link to={isOwner ? '/projects/new' : '/projects'}>
              {isOwner ? 'Post a project' : 'Explore projects'} <span>↗</span>
            </Link>
          </div>

          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `side-link ${isActive ? 'active' : ''}`
            }
          >
            <FiSettings size={18} />
            <span>Profile & settings</span>
          </NavLink>

          {/* Permanent logout button */}
          <button
            type="button"
            className="side-link sidebar-logout"
            onClick={signOut}
          >
            <FiLogOut size={18} />
            <span>Sign out</span>
          </button>

          <button
            type="button"
            className="profile-mini"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className="avatar">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="profile-mini-copy">
              <b>{user?.name || 'Your account'}</b>
              <small>{isOwner ? 'Business owner' : 'Freelancer'}</small>
            </span>
            <FiChevronDown size={15} />
          </button>

          {menuOpen && (
            <div className="account-pop">
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <FiUser /> My profile
              </Link>
              <button type="button" onClick={signOut}>
                <FiLogOut /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <b>{title || 'Overview'}</b>
          </div>

          <div className="topbar-actions">
            <span className="availability">
              <i /> All systems operational
            </span>
            <Link
              to="/notifications"
              className="icon-button"
              aria-label="Notifications"
            >
              <FiBell /><i />
            </Link>
            <span className="avatar avatar-small">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {isOwner ? 'YOUR BUSINESS, IN MOTION' : 'YOUR NEXT OPPORTUNITY'}
              </div>
              <h1>{title || 'Overview'}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {action && <div className="heading-action">{action}</div>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
