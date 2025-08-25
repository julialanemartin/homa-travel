import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    setResult('Testing...');
    
    try {
      console.log('Testing admin login with:', { username, passwordLength: password.length });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.text();
      console.log('Raw response:', data);
      
      if (response.ok) {
        try {
          const jsonData = JSON.parse(data);
          setResult(`SUCCESS: ${JSON.stringify(jsonData, null, 2)}`);
        } catch {
          setResult(`SUCCESS (non-JSON): ${data}`);
        }
      } else {
        setResult(`FAILED (${response.status}): ${data}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setResult(`NETWORK ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Admin Login Test</CardTitle>
          <CardDescription>Direct API test for admin authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          
          <Button 
            onClick={testLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Login'}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}