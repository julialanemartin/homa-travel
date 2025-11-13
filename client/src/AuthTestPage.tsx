import React, { useState } from 'react';

export default function AuthTestPage() {
  const [result, setResult] = useState<string>('');

  async function handleSubmit(e: React.FormEvent, url: string) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setResult(err.message);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Homa Travel Auth Test</h1>

      <section>
        <h2>Signup</h2>
        <form onSubmit={e => handleSubmit(e, '/api/signup')}>
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Signup</button>
        </form>
      </section>

      <section>
        <h2>Login</h2>
        <form onSubmit={e => handleSubmit(e, '/api/login')}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </section>

      <section>
        <h2>Forgot Password</h2>
        <form onSubmit={e => handleSubmit(e, '/api/forgot-password')}>
          <input type="email" name="email" placeholder="Email" required />
          <button type="submit">Send Reset Link</button>
        </form>
      </section>

      <section>
        <h2>Reset Password</h2>
        <form onSubmit={e => handleSubmit(e, '/api/reset-password')}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="newPassword" placeholder="New Password" required />
          <button type="submit">Reset Password</button>
        </form>
      </section>

      <h3>Result:</h3>
      <pre style={{ background: '#f0f0f0', padding: 10 }}>{result}</pre>
    </div>
  );
}
