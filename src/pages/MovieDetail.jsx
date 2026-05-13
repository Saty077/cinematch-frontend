// NEW: Full movie detail page with trailer, cast, and similar movies
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer.jsx";
import MovieCard from "../components/MovieCard.jsx";

const API = import.meta.env.VITE_API_BASE_URL || "";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

export default function MovieDetail() {
  const { tmdbId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [movieRes, videoRes, similarRes] = await Promise.all([
          axios.get(`${API}/api/movies/${tmdbId}`),
          axios.get(`${API}/api/movies/${tmdbId}/videos`),
          axios.get(`${API}/api/movies/${tmdbId}/similar`),
        ]);
        setMovie(movieRes.data);
        setTrailerKey(videoRes.data.trailerKey);
        setSimilar(similarRes.data);
      } catch (err) {
        console.error("Failed to load movie:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [tmdbId]);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!movie) return <div style={styles.loading}>Movie not found.</div>;

  const backdropUrl = movie.backdropPath
    ? `${BACKDROP_BASE}${movie.backdropPath}`
    : null;
  const posterUrl = movie.posterPath
    ? `${POSTER_BASE}${movie.posterPath}`
    : null;

  return (
    <div style={styles.page}>
      {/* Backdrop */}
      {backdropUrl && (
        <div
          style={{ ...styles.backdrop, backgroundImage: `url(${backdropUrl})` }}
        >
          <div style={styles.backdropOverlay} />
        </div>
      )}

      <div style={styles.content}>
        {/* Hero section */}
        <div style={styles.hero}>
          {posterUrl && (
            <img src={posterUrl} alt={movie.title} style={styles.poster} />
          )}
          <div style={styles.info}>
            <h1 style={styles.title}>{movie.title}</h1>
            {movie.tagline && <p style={styles.tagline}>"{movie.tagline}"</p>}
            <div style={styles.meta}>
              <span>⭐ {movie.rating?.toFixed(1)}</span>
              <span>·</span>
              <span>{movie.year}</span>
              {movie.runtime && (
                <>
                  <span>·</span>
                  <span>{movie.runtime} min</span>
                </>
              )}
            </div>
            <div style={styles.genres}>
              {movie.genres?.map((g) => (
                <span key={g} style={styles.genreTag}>
                  {g}
                </span>
              ))}
            </div>
            <p style={styles.overview}>{movie.overview}</p>
            <div style={styles.btnRow}>
              {trailerKey && (
                <button
                  style={styles.btnPrimary}
                  onClick={() => navigate(`/watch/${tmdbId}`)}
                >
                  ▶ Watch Trailer
                </button>
              )}
              <button
                style={styles.btnSecondary}
                onClick={() => setShowTrailer((v) => !v)}
              >
                {showTrailer ? "Hide Trailer" : "Preview Trailer"}
              </button>
            </div>
          </div>
        </div>

        {/* Inline trailer preview */}
        {showTrailer && (
          <div style={styles.section}>
            <VideoPlayer trailerKey={trailerKey} />
          </div>
        )}

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Cast</h2>
            <div style={styles.castGrid}>
              {movie.cast.map((c) => (
                <div key={c.name} style={styles.castCard}>
                  <div style={styles.castImg}>
                    {c.profilePath ? (
                      <img
                        src={`${PROFILE_BASE}${c.profilePath}`}
                        alt={c.name}
                        style={styles.castPhoto}
                      />
                    ) : (
                      <div style={styles.castPlaceholder}>👤</div>
                    )}
                  </div>
                  <p style={styles.castName}>{c.name}</p>
                  <p style={styles.castChar}>{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar movies */}
        {similar.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Similar Movies</h2>
            <div style={styles.similarGrid}>
              {similar.map((m) => (
                <MovieCard key={m.tmdbId} movie={m} sessionId={null} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { position: "relative", minHeight: "100vh" },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "4rem",
    color: "var(--text-dim)",
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "420px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },
  backdropOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(15,15,19,0.5), rgba(15,15,19,1))",
  },
  content: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  hero: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginBottom: "2.5rem",
  },
  poster: {
    width: "220px",
    borderRadius: "var(--radius)",
    flexShrink: 0,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  info: { flex: 1, minWidth: "280px" },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
    fontWeight: "700",
    marginBottom: "0.4rem",
  },
  tagline: {
    color: "var(--text-dim)",
    fontStyle: "italic",
    marginBottom: "0.75rem",
    fontSize: "0.95rem",
  },
  meta: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    color: "var(--accent)",
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginBottom: "1rem",
  },
  genreTag: {
    background: "var(--accent-dim)",
    border: "1px solid var(--accent)44",
    color: "var(--accent)",
    padding: "0.2rem 0.7rem",
    borderRadius: "12px",
    fontSize: "0.775rem",
  },
  overview: {
    color: "var(--text-dim)",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },
  btnRow: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  btnPrimary: {
    background: "var(--accent)",
    color: "#0f0f13",
    fontWeight: "600",
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    fontSize: "0.9rem",
    border: "none",
  },
  btnSecondary: {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  section: { marginBottom: "2.5rem" },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1rem",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "0.5rem",
  },
  castGrid: {
    display: "flex",
    gap: "1rem",
    overflowX: "auto",
    paddingBottom: "0.5rem",
  },
  castCard: { minWidth: "90px", textAlign: "center" },
  castImg: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    overflow: "hidden",
    margin: "0 auto 0.4rem",
  },
  castPhoto: { width: "100%", height: "100%", objectFit: "cover" },
  castPlaceholder: {
    width: "100%",
    height: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  castName: { fontSize: "0.75rem", fontWeight: "500", marginBottom: "0.2rem" },
  castChar: { fontSize: "0.7rem", color: "var(--text-dim)" },
  similarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1rem",
  },
};
