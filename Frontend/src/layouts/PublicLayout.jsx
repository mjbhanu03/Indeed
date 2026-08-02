import { useRef, useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import ThemeToggle from '../components/common/ThemeToggle';

export default function PublicLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
return (
    <div>
      <nav className="navbar navbar-expand-lg sticky-top theme-navbar" style={{ boxShadow: 'var(--shadow-nav)' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/events" style={{ color: 'var(--navbar-text)' }}>
            🎉 Indeed
          </Link>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <NavLink to="/jobs" style={{ color: 'var(--navbar-text)' }}
              className={({ isActive }) => `nav-link d-none d-lg-block ${isActive ? 'fw-bold' : ''}`}>
              Browse Jobs
            </NavLink>

            <ThemeToggle />
                <Link to="/signin" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-light btn-sm fw-semibold" style={{ color: '#0d6efd' }}>
                  Register
                </Link>

          </div>
        </div>
      </nav>

      <main className="container py-4" style={{ color: 'var(--text-primary)' }}>
        <Outlet />
      </main>
    </div>
  );
}
