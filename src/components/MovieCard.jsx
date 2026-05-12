import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "";
const POSTER_BASE = "https://image.tmdb.org/t/p/w300";
const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=No+Image";

export default function MovieCard({ movie, sessionId }) {
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  const sendFeedback = async (action) => {
    if (sending || feedback) return;
    setSending(true);
    try {
      await axios.post(`${API}/api/mood/feedback`, {
        sessionId,
        tmdbId: movie.tmdbId,
        action,
      });
      setFeedback(action);
    } catch (err) {
      console.error("Feedback error:", err.message);
    } finally {
      setSending(false);
    }
  };

  const posterUrl = movie.posterPath
    ? `${POSTER_BASE}${movie.posterPath}`
    : FALLBACK_POSTER;

  return (
    <div style={styles.card}>
      <div style={styles.posterWrap}>
        <Link to={`/movie/${movie.tmdbId}`}>
          <img
            src={posterUrl}
            alt={movie.title}
            style={styles.poster}
            onError={(e) => (e.target.src = FALLBACK_POSTER)}
          />
        </Link>
        <div style={styles.rating}>⭐ {movie.rating?.toFixed(1)}</div>
      </div>

      <div style={styles.body}>
        <Link
          to={`/movie/${movie.tmdbId}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3 style={styles.title}>{movie.title}</h3>
        </Link>
        <p style={styles.meta}>
          {movie.year} ·{" "}
          {Array.isArray(movie.genres)
            ? movie.genres.slice(0, 2).join(", ")
            : ""}
        </p>

        {movie.whyNow && (
          <div style={styles.whyTag}>
            <span style={{ marginRight: "0.3rem" }}>✨</span>
            {movie.whyNow}
          </div>
        )}

        <div style={styles.actions}>
          <ActionBtn
            label="✓ Watched"
            action="watched"
            active={feedback === "watched"}
            onClick={() => sendFeedback("watched")}
            disabled={!!feedback}
          />
          <ActionBtn
            label="🔖 Save"
            action="saved"
            active={feedback === "saved"}
            onClick={() => sendFeedback("saved")}
            disabled={!!feedback}
          />
          <ActionBtn
            label="✕ Skip"
            action="skipped"
            active={feedback === "skipped"}
            onClick={() => sendFeedback("skipped")}
            disabled={!!feedback}
          />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ label, action, active, onClick, disabled }) {
  const colors = {
    watched: "#4ade80",
    saved: "var(--accent)",
    skipped: "#9090a8",
  };
  return (
    <button
      style={{
        ...styles.actionBtn,
        ...(active
          ? {
              color: colors[action],
              borderColor: colors[action],
              background: colors[action] + "18",
            }
          : {}),
        opacity: disabled && !active ? 0.4 : 1,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  posterWrap: { position: "relative" },
  poster: {
    width: "100%",
    aspectRatio: "2/3",
    objectFit: "cover",
    display: "block",
    cursor: "pointer",
  },
  rating: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "#0f0f13cc",
    color: "var(--accent)",
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "0.2rem 0.5rem",
    borderRadius: "6px",
  },
  body: {
    padding: "0.9rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flex: 1,
  },
  title: {
    fontSize: "0.95rem",
    fontWeight: "600",
    lineHeight: 1.3,
    cursor: "pointer",
  },
  meta: { color: "var(--text-dim)", fontSize: "0.775rem" },
  whyTag: {
    background: "var(--accent-dim)",
    border: "1px solid var(--accent)33",
    color: "var(--accent)",
    fontSize: "0.775rem",
    padding: "0.4rem 0.6rem",
    borderRadius: "6px",
    lineHeight: 1.4,
    marginTop: "0.2rem",
  },
  actions: {
    display: "flex",
    gap: "0.4rem",
    marginTop: "auto",
    paddingTop: "0.5rem",
  },
  actionBtn: {
    flex: 1,
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-dim)",
    padding: "0.35rem 0",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "500",
    transition: "all 0.15s",
  },
};
