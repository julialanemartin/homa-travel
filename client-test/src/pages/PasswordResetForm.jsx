import React, { useState } from "react";
import { resetPassword } from "../lib/api.js";

export default function PasswordResetForm() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); // token sent via email

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ password, token });
      alert("Password reset successful! " + JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      alert("Reset failed. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input placeholder="Reset Token" value={token} onChange={e => setToken(e.target.value)} required />
      <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Reset Password</button>
    </form>
  );
}
