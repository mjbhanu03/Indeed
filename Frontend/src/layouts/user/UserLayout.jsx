import { useRef, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../../components/common/ThemeToggle';

const NAV_LINKS = [
  { to: '/user/dashboard', label: 'Dashboard'   },
  { to: '/user/jobs',    label: 'Jobs'      },
  { to: '/user/applications',  label: 'My Applications' },
  { to: "/user/ai-chat", label: "Chat with Ai" }
];


export default function UserLayout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
    toast.success('Logged out');
    navigate('/jobs');
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initial = user?.full_name?.charAt(0).toUpperCase() || '?';
  console.log(user)
  return (
    <div>
      <nav className="navbar navbar-expand-lg sticky-top theme-navbar" style={{ boxShadow: 'var(--shadow-nav)' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/user/dashboard" style={{ color: 'var(--navbar-text)' }}>
            🎉 Indeed
          </Link>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <ul className="navbar-nav d-none d-lg-flex flex-row gap-1 me-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to} className="nav-item">
                  <NavLink to={to} style={{ color: 'var(--navbar-text)' }}
                    className={({ isActive }) => `nav-link ${isActive ? 'fw-bold' : ''}`}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <ThemeToggle />

            {/* React-controlled avatar dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpen(o => !o)}
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'var(--navbar-text)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 20,
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#f59e0b', color: '#1e2130',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                }}>
                  {initial}
                </span>
                <span className="d-none d-md-inline small fw-semibold">{user?.name}</span>
                <span style={{ fontSize: 10 }}>{open ? '▴' : '▾'}</span>
              </button>

              {open && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  minWidth: 220, borderRadius: 12,
                  boxShadow: 'var(--shadow-card)',
                  zIndex: 1050,
                }}>
                  {/* Profile info header */}
                  <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: '#f59e0b', color: '#1e2130',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 18, flexShrink: 0,
                      }}>
                        {initial}
                      </span>
                      <div style={{ overflow: 'hidden' }}>
                        <p className="mb-0 fw-semibold small" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.name}
                        </p>
                        <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.email}
                        </p>
                        <span className="badge bg-primary mt-1" style={{ fontSize: 9 }}>User</span>
                      </div>
                    </div>
                  </div>

                  {[
                    { to: '/user/dashboard', icon: '📊', label: 'Dashboard' },
                    { to: '/user/applications',  icon: '🎟️', label: 'My Applications' },
                    { to: '/user/profile',   icon: '👤', label: 'Profile Settings' },
                    { to: '/user/changePassword',   icon: '🔑', label: 'Change Password' },
                  ].map(({ to, icon, label }) => (
                    <Link key={to} className="dropdown-item py-2" to={to}
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => setOpen(false)}>
                      {icon} {label}
                    </Link>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 4 }}>
                    <button className="dropdown-item py-2 text-danger w-100 text-start" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4" style={{ color: 'var(--text-primary)', transition: 'color 0.25s ease' }}>
        <Outlet />
      </main>
    </div>
  );
}
