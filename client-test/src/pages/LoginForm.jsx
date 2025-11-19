import React, { useState } from "react";
import { login } from "../lib/api.js";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ⚡ missing

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password });
      alert("Login successful! " + JSON.stringify(res.data));
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Login failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2> {/* Fixed label */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button type="submit" disabled={loading} style={{ padding: "10px 15px" }}>
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
