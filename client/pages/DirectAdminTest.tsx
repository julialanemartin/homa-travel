import { useState } from 'react';

export default function DirectAdminTest() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult('Testing login...');
    
    try {
      console.log('Direct admin test - attempting login');
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        localStorage.setItem('admin_auth_token', data.token);
        setResult('SUCCESS! Redirecting to admin dashboard...');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        setResult(`FAILED: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(`ERROR: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <h1>DIRECT ADMIN TEST - BYPASS CACHE</h1>
        <p>Testing admin login API directly</p>
      </div>
      
      <div style={{ backgroundColor: 'yellow', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <strong>🚨 This is a direct API test page 🚨</strong>
      </div>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Testing...' : 'TEST ADMIN LOGIN'}
        </button>
      </form>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e9ecef', 
          border: '1px solid #ccc',
          maxWidth: '400px',
          margin: '20px auto 0'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Result:</h3>
          <p style={{ fontSize: '14px', wordBreak: 'break-all' }}>{result}</p>
        </div>
      )}
    </div>
  );
}