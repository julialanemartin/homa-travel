import React from "react";

const mockDestinations = [
  { name: "Santorini", blurb: "Blue domes, sunsets, Aegean charm." },
  { name: "Kyoto", blurb: "Temples, tea houses, and tranquil gardens." },
  { name: "Lisbon", blurb: "Tiled alleys, pastel de nata, ocean views." },
];

export default function Destinations() {
  return (
    <section>
      <h1>Destinations</h1>
      <p>Hand-picked places and practical resources for planning.</p>
      <ul style={{ paddingLeft: 18 }}>
        {mockDestinations.map((d) => (
          <li key={d.name} style={{ marginBottom: 8 }}>
            <strong>{d.name}:</strong> {d.blurb}
          </li>
        ))}
      </ul>
    </section>
  );
}
