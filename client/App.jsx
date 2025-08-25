import React from "react";
import { Link, Route } from "wouter";
import Home from "./pages/Home.jsx";
import Destinations from "./pages/Destinations.jsx";
import Products from "./pages/Products.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <Link href="/" style={styles.brandLink}>HOMA Travel Co</Link>
        </div>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/destinations" style={styles.navLink}>Destinations</Link>
          <Link href="/products" style={styles.navLink}>Products</Link>
          <Link href="/about" style={styles.navLink}>About</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <Route path="/" component={Home} />
        <Route path="/destinations" component={Destinations} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/:rest*" component={NotFound} />
      </main>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} HOMA Travel Co — curated travel resources
      </footer>
    </div>
  );
}

const styles = {
  shell: { fontFamily: "system-ui, Arial, sans-serif", color: "#111" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 24px", borderBottom: "1px solid #eee", position: "sticky", top: 0, background: "#fff", zIndex: 10
  },
  brand: { fontWeight: 700, fontSize: 18 },
  brandLink: { textDecoration: "none", color: "#111" },
  nav: { display: "flex", gap: 16 },
  navLink: { textDecoration: "none", color: "#333" },
  main: { padding: "24px", maxWidth: 980, margin: "0 auto" },
  footer: { padding: "24px", borderTop: "1px solid #eee", marginTop: 40, color: "#666", fontSize: 14 },
};
