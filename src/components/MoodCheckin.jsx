import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "";

const MOOD_OPTIONS = [
  {
    key: "energy",
    label: "How's your energy right now?",
    options: [
      { label: "Low — just chill", value: 1 },
      { label: "Medium", value: 2 },
      { label: "High — bring it on", value: 3 },
    ],
  },
  {
    key: "tone",
    label: "What kind of feeling do you want?",
    options: [
      { label: "Feel-good", value: "feel-good" },
      { label: "Thrilling", value: "thrilling" },
      { label: "Thoughtful", value: "thoughtful" },
      { label: "Funny", value: "funny" },
      { label: "Emotional", value: "emotional" },
    ],
  },
  {
    key: "context",
    label: "Who are you watching with?",
    options: [
      { label: "Just me", value: "solo" },
      { label: "Partner", value: "partner" },
      { label: "Friends", value: "friends" },
      { label: "Family", value: "family" },
    ],
  },
  {
    key: "availableTime",
    label: "How much time do you have?",
    options: [
      { label: "Under 90 min", value: 90 },
      { label: "~2 hours", value: 120 },
      { label: "All night", value: 999 },
    ],
  },
];

export default function MoodCheckin() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const select = (key, value) =>
    setSelections((prev) => ({ ...prev, [key]: value }));

  const allSelected = MOOD_OPTIONS.every(
    (q) => selections[q.key] !== undefined,
  );

  const submit = async () => {
    if (!allSelected) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/api/mood/session`, selections);
      navigate("/results", {
        state: { movies: data.movies, sessionId: data.sessionId },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>What are you in the mood for?</h2>
        <p style={styles.sub}>
          Answer 4 quick questions — AI picks your perfect movie
        </p>

        {MOOD_OPTIONS.map((section) => (
          <div key={section.key} style={styles.section}>
            <p style={styles.label}>{section.label}</p>
            <div style={styles.chips}>
              {section.options.map((opt) => {
                const active = selections[section.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    style={{
                      ...styles.chip,
                      ...(active ? styles.chipActive : {}),
                    }}
                    onClick={() => select(section.key, opt.value)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{ ...styles.findBtn, opacity: allSelected ? 1 : 0.4 }}
          onClick={submit}
          disabled={!allSelected || loading}
        >
          {loading ? "Finding your movies..." : "Find my movies →"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", padding: "2rem 1rem" },
  container: { width: "100%", maxWidth: "600px" },
  title: { fontSize: "1.6rem", fontWeight: "700", marginBottom: "0.4rem" },
  sub: { color: "var(--text-dim)", fontSize: "0.9rem", marginBottom: "2rem" },
  section: { marginBottom: "1.75rem" },
  label: {
    fontSize: "0.875rem",
    color: "var(--text-dim)",
    fontWeight: "500",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  chip: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    transition: "all 0.15s",
  },
  chipActive: {
    background: "var(--accent-dim)",
    border: "1px solid var(--accent)",
    color: "var(--accent)",
    fontWeight: "500",
  },
  error: {
    background: "#e2555522",
    color: "#e25555",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
  findBtn: {
    width: "100%",
    background: "var(--accent)",
    color: "#0f0f13",
    fontWeight: "600",
    padding: "0.9rem",
    borderRadius: "8px",
    fontSize: "1rem",
    marginTop: "0.5rem",
    transition: "opacity 0.2s",
  },
};
