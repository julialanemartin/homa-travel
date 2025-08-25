import { useState } from 'react';
import { useLocation } from 'wouter';

export default function NewAdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Attempting login...');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const responseText = await response.text();
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        localStorage.setItem('admin_auth_token', data.token);
        setMessage('SUCCESS! Redirecting to admin dashboard...');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        setMessage(`LOGIN FAILED: ${responseText}`);
      }
    } catch (error) {
      setMessage(`ERROR: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          color: 'white', 
          padding: '1.5rem',
          margin: '-2rem -2rem 2rem -2rem',
          borderRadius: '8px 8px 0 0',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            Homa Travel Co. Admin
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>
            Please log in to manage your website
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#10b981', 
          color: 'white', 
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          🚀 NEW LOGIN FORM - ADMIN USER READY
        </div>

        {message && (
          <div style={{ 
            backgroundColor: message.includes('SUCCESS') ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold' 
            }}>
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold' 
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: isSubmitting ? '#9ca3af' : '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}