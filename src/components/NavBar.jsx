import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useAuthStore';
import { xpToLevel } from '../utils/helpers';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/quiz-setup', label: 'Start Quiz', icon: '🚀' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/admin', label: 'Admin', icon: '⚙️' },
];

export default function NavBar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const level = user ? xpToLevel(user.xp) : 1;

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          {/* Logo */}
          <NavLink to="/dashboard" className="nav-logo" onClick={() => setOpen(false)}>
            🔢 MathQuiz
          </NavLink>

          {/* Desktop links */}
          <ul className="nav-links">
            {NAV_ITEMS.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `${isActive ? 'active' : ''}`}
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex-row">
            {user && (
              <div className="hide-mobile" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                background: 'var(--c-primary-lt)',
                borderRadius: 'var(--radius)',
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--c-primary)',
              }}>
                ⭐ {user.xp} XP &nbsp;·&nbsp; Lv.{level}
              </div>
            )}
            <button className="btn btn-ghost btn-sm hide-mobile" onClick={handleLogout}>
              Logout
            </button>
            {/* Hamburger */}
            <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
              <span style={{ transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
              <span style={{ opacity: open ? 0 : 1 }} />
              <span style={{ transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${open ? 'open' : ''}`}>
        {user && (
          <div style={{
            padding: '0.5rem 1rem 0.75rem',
            borderBottom: '1px solid var(--c-border)',
            marginBottom: '0.25rem',
          }}>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>
              Class {user.classLevel} · ⭐ {user.xp} XP · Lv.{level} · 🔥 {user.streak}d
            </div>
          </div>
        )}
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={() => setOpen(false)}>
            {item.icon} {item.label}
          </NavLink>
        ))}
        <button onClick={handleLogout} style={{ color: 'var(--c-wrong)', fontWeight: 700 }}>
          🚪 Logout
        </button>
      </div>
    </>
  );
}
