import React, { useState } from "react";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import PasswordResetRequestForm from "./pages/PasswordResetRequestForm";
import PasswordResetForm from "./pages/PasswordResetForm";

export default function App() {
  const [view, setView] = useState("signup");
  const [resetToken, setResetToken] = useState("");

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Test Frontend</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView("signup")}>Signup</button>
        <button onClick={() => setView("login")}>Login</button>
        <button onClick={() => setView("request-reset")}>Request Reset</button>
        <button onClick={() => setView("reset")}>Reset Password</button>
      </div>

      {view === "signup" && <SignupForm />}
      {view === "login" && <LoginForm />}
      {view === "request-reset" && <PasswordResetRequestForm />}
      {view === "reset" && <PasswordResetForm token={resetToken} />}

      {view === "reset" && (
        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Enter reset token"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
