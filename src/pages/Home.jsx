import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MoodCheckin from "../components/MoodCheckin.jsx";

export default function Home() {
  const { user } = useAuth();

  if (user) return <MoodCheckin />;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.badge}>AI-powered recommendations</div>
        <h1 style={styles.title}>
          Find the perfect movie <br />
          <span style={{ color: "var(--accent)" }}>for this exact moment</span>
        </h1>
        <p style={styles.sub}>
          Not just what you've liked before — CineMatch matches movies to your
          current mood, energy, and who you're watching with.
        </p>
        <div style={styles.cta}>
          <Link to="/register">
            <button style={styles.btnPrimary}>Get started — it's free</button>
          </Link>
          <Link to="/login">
            <button style={styles.btnSecondary}>Log in</button>
          </Link>
        </div>
        <div style={styles.features}>
          {[
            ["🎭", "Mood check-in", "4 taps to tell us how you feel right now"],
            ["🤖", "AI ranking", "GPT-4o-mini picks the best fit from thousands of movies"],
            ["📈", "Taste profile", "Gets smarter every time you watch or skip"],
          ].map(([icon, label, desc]) => (
            <div key={label} style={styles.featureCard}>
              <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              <strong style={{ fontSize: "0.95rem" }}>{label}</strong>
              <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", lineHeight: 1.4 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", padding: "4rem 1rem" },
  hero: { maxWidth: "640px", width: "100%", textAlign: "center" },
  badge: { display: "inline-block", background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "20px", padding: "0.3rem 0.9rem", fontSize: "0.8rem", fontWeight: "500", marginBottom: "1.5rem" },
  title: { fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: "700", lineHeight: 1.2, marginBottom: "1rem" },
  sub: { color: "var(--text-dim)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" },
  cta: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" },
  btnPrimary: { background: "var(--accent)", color: "#0f0f13", fontWeight: "600", padding: "0.8rem 1.8rem", borderRadius: "8px", fontSize: "0.95rem" },
  btnSecondary: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)", padding: "0.8rem 1.8rem", borderRadius: "8px", fontSize: "0.95rem" },
  features: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" },
  featureCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" },
};
