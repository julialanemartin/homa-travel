export default function AdminQuickFix() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#000', color: '#fff', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>ADMIN QUICK FIX TEST</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>If you can see this page, routing works</p>
      <button 
        onClick={() => {
          fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
          })
          .then(r => r.json())
          .then(data => {
            alert('API Response: ' + JSON.stringify(data));
            if (data.token) {
              localStorage.setItem('admin_auth_token', data.token);
              window.location.href = '/admin';
            }
          })
          .catch(e => alert('Error: ' + e.message));
        }}
        style={{
          padding: '20px 40px',
          fontSize: '1.5rem',
          backgroundColor: '#ff0000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        TEST ADMIN LOGIN NOW
      </button>
    </div>
  );
}