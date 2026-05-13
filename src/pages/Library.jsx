// NEW: Shows saved and watched movies pulled from mood session history
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard.jsx";

const API = import.meta.env.VITE_API_BASE_URL || "";

export default function Library() {
  const [saved, setSaved] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`${API}/api/mood/history`);

        const savedMap = new Map();
        const watchedMap = new Map();

        // Flatten all sessions to extract feedback-matched movies
        data.forEach((session) => {
          session.feedback?.forEach((fb) => {
            const movie = session.recommendedMovies?.find(
              (m) => m.tmdbId === fb.tmdbId,
            );
            if (!movie) return;
            if (fb.action === "saved") savedMap.set(movie.tmdbId, movie);
            if (fb.action === "watched") watchedMap.set(movie.tmdbId, movie);
          });
        });

        setSaved([...savedMap.values()]);
        setWatched([...watchedMap.values()]);
      } catch (err) {
        console.error("Failed to load library:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={styles.loading}>Loading your library...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Your Library</h2>

      <Section
        title="🔖 Saved"
        movies={saved}
        empty="No saved movies yet. Hit Save on any recommendation!"
      />
      <Section
        title="✓ Watched"
        movies={watched}
        empty="No watched movies yet. Mark movies as watched from your recommendations!"
      />
    </div>
  );
}

function Section({ title, movies, empty }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>
        {title} <span style={styles.count}>({movies.length})</span>
      </h3>
      {movies.length === 0 ? (
        <p style={styles.empty}>{empty}</p>
      ) : (
        <div style={styles.grid}>
          {movies.map((m) => (
            <MovieCard key={m.tmdbId} movie={m} sessionId={null} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "4rem",
    color: "var(--text-dim)",
  },
  pageTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "2rem" },
  section: { marginBottom: "2.5rem" },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "0.5rem",
  },
  count: { color: "var(--text-dim)", fontWeight: "400", fontSize: "0.9rem" },
  empty: {
    color: "var(--text-dim)",
    fontSize: "0.875rem",
    padding: "1.5rem 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1rem",
  },
};
