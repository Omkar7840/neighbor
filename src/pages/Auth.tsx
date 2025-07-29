import React, { useState } from 'react';
import AuthForm from '../components/Auth/AuthForm';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return <AuthForm mode={mode} onToggleMode={toggleMode} />;
};

export default Auth;