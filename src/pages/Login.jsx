import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Log in to CineMatch</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handle}
            required
          />
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handle}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p style={styles.link}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent)" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "1rem" },
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", width: "100%", maxWidth: "400px" },
  title: { fontSize: "1.5rem", marginBottom: "0.25rem" },
  sub: { color: "var(--text-dim)", marginBottom: "1.5rem", fontSize: "0.9rem" },
  error: { background: "#e2555522", color: "#e25555", padding: "0.6rem 1rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.875rem" },
  form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  input: { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.95rem", width: "100%" },
  btn: { background: "var(--accent)", color: "#0f0f13", fontWeight: "600", padding: "0.75rem", borderRadius: "8px", fontSize: "0.95rem", marginTop: "0.25rem" },
  link: { textAlign: "center", marginTop: "1.25rem", color: "var(--text-dim)", fontSize: "0.875rem" },
};
