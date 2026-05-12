import { useLocation, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard.jsx";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if someone lands here with no data
  if (!state?.movies?.length) {
    return (
      <div style={styles.empty}>
        <p>No results found.</p>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Your picks for right now</h2>
          <p style={styles.sub}>Ranked by AI for your current mood</p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          Check-in again
        </button>
      </div>
      <div style={styles.grid}>
        {state.movies.map((movie) => (
          <MovieCard key={movie.tmdbId} movie={movie} sessionId={state.sessionId} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" },
  title: { fontSize: "1.5rem", fontWeight: "700" },
  sub: { color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.25rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "4rem", color: "var(--text-dim)" },
  backBtn: { background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "0.6rem 1.2rem", borderRadius: "8px", fontSize: "0.875rem", whiteSpace: "nowrap" },
};
