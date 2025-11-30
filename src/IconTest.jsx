import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function IconTest() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      <h1>Icon System Test</h1>
      <p>If you see this, React is working</p>
      <AlertCircle size={48} color="#f59e0b" />
    </div>
  );
}
