import React, { useState } from "react";
import { signup } from "../lib/api.js";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signup({ email, password });
      alert("Signup successful! Welcome, " + res.data.email);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Signup failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

return (
<form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}> <h2>Signup</h2>
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
{loading ? "Signing up..." : "Sign Up"} </button> </form>
);
}
