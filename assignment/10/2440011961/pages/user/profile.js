// assignment/10/2440011961/pages/user/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth';

function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // No user is logged in, redirect to home/login
        router.push('/assignment/10/2440011961');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#007bff' }}>User Profile 👤</h1>
      <p>Welcome to your personal profile page!</p>
      <p>Email: <strong>{user.email}</strong></p>
      {/* You can add more user-specific data here */}
      <button
        onClick={() => router.push('/assignment/10/2440011961')}
        style={{
          marginTop: '20px', padding: '10px 15px', backgroundColor: '#6c757d',
          color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
        }}
      >
        Go Back Home
      </button>
    </div>
  );
}

export default UserProfilePage;