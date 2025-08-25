import React, { useEffect, useState } from "react";

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false }));
  }, []);

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Welcome to HOMA</h1>
      <p style={{ marginBottom: 16 }}>
        Your hub for destination guides, digital products, and curated travel resources.
      </p>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Site Status</h3>
        <p>API health: <strong>{health ? String(health.ok) : "checking…"}</strong></p>
      </div>
    </section>
  );
}

const card = { border: "1px solid #eee", borderRadius: 12, padding: 16, background: "#fafafa" };
