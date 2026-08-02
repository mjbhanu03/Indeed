import { useRef, useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import ThemeToggle from "../../components/common/ThemeToggle";

const NAV_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/applications", label: "Applications" }
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg sticky-top theme-navbar"
        style={{ boxShadow: "var(--shadow-nav)" }}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-bold"
            to="/admin/dashboard"
            style={{ color: "var(--navbar-text)" }}
          >
            🛠️ Admin Panel
          </Link>

          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Desktop Menu */}
            <ul className="navbar-nav d-none d-lg-flex flex-row gap-1 me-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to} className="nav-item">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "fw-bold" : ""}`
                    }
                    style={{ color: "var(--navbar-text)" }}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div ref={dropRef} style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(!open)}
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "var(--navbar-text)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 20,
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#dc3545",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {initial}
                </span>

                <span className="d-none d-md-inline fw-semibold">
                  {user?.name}
                </span>

                <span>{open ? "▴" : "▾"}</span>
              </button>

              {open && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                    minWidth: 240,
                    borderRadius: 12,
                    boxShadow: "var(--shadow-card)",
                    zIndex: 1050,
                  }}
                >
                  {/* Profile Header */}
                  <div
                    className="px-3 py-3"
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: "#dc3545",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        {initial}
                      </span>

                      <div>
                        <div className="fw-semibold">{user?.name}</div>
                        <small>{user?.email}</small>
                        <br />
                        <span className="badge bg-danger mt-1">
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item py-2"
                    onClick={() => setOpen(false)}
                  >
                    📊 Dashboard
                  </Link>

                  <Link
                    to="/admin/users"
                    className="dropdown-item py-2"
                    onClick={() => setOpen(false)}
                  >
                    👥 Manage Users
                  </Link>

                  <Link
                    to="/admin/skills"
                    className="dropdown-item py-2"
                    onClick={() => setOpen(false)}
                  >
                    🏷️ Skills
                  </Link>
                  <Link
                    to="/admin/changePassword"
                    className="dropdown-item py-2"
                    onClick={() => setOpen(false)}
                  >
                    🔑 Change Password
                  </Link>

                  <div
                    style={{
                      borderTop: "1px solid var(--border-color)",
                    }}
                  >
                    <button
                      className="dropdown-item text-danger py-2"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main
        className="container py-4"
        style={{
          color: "var(--text-primary)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}