import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🎬 CineMatch
      </Link>
      <div style={styles.right}>
        {user ? (
          <>
            <Link to="/search" style={styles.link}>
              Search
            </Link>
            <Link to="/library" style={styles.link}>
              Library
            </Link>
            <Link to="/profile" style={styles.link}>
              Profile
            </Link>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register">
              <button style={styles.registerBtn}>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: { fontWeight: "700", fontSize: "1.1rem", color: "var(--accent)" },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  link: { color: "var(--text-dim)", fontSize: "0.875rem" },
  logoutBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-dim)",
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
  },
  registerBtn: {
    background: "var(--accent)",
    color: "#0f0f13",
    fontWeight: "600",
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
  },
};
