import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Login from './Login';
import Dashboard from './Dashboard';

const Auth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Dashboard user={user} /> : <Login />;
};

export default Auth;
