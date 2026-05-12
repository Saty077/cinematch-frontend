// NEW: YouTube trailer embed component
export default function VideoPlayer({ trailerKey }) {
  if (!trailerKey) {
    return (
      <div style={styles.noTrailer}>
        <span style={{ fontSize: "2rem" }}>🎬</span>
        <p>No trailer available for this movie.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <iframe
        style={styles.iframe}
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
        title="Movie Trailer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    paddingTop: "56.25%",
    background: "#000",
    borderRadius: "var(--radius)",
    overflow: "hidden",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
  noTrailer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "3rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-dim)",
  },
};
