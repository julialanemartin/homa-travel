import React from "react";

const sampleProducts = [
  { title: "HOMA Carry-on Packing List (PDF)", price: "$7", url: "#" },
  { title: "2-Week Italy Itinerary (Notion Template)", price: "$19", url: "#" },
  { title: "Travel Credit Card Cheatsheet", price: "Free", url: "#" },
];

export default function Products() {
  return (
    <section>
      <h1>Digital Products</h1>
      <p>Guides, templates, and resources. Add real purchase links/affiliate URLs later.</p>
      <div style={grid}>
        {sampleProducts.map((p) => (
          <a key={p.title} href={p.url} style={card} rel="noopener noreferrer">
            <h3 style={{ marginTop: 0 }}>{p.title}</h3>
            <p style={{ color: "#555" }}>{p.price}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 16 };
const card = { display: "block", border: "1px solid #eee", borderRadius: 12, padding: 16, textDecoration: "none", color: "#111", background: "#fff" };
