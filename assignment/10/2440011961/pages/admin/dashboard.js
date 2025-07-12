// assignment/10/2440011961/pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../firebase'; // Import auth and db
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Not authenticated, redirect to home/login
        router.push('/assignment/10/2440011961');
      } else {
        setUser(currentUser);
        // Check user role from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            // User is not an admin, redirect them
            alert('Access Denied: You must be an administrator to view this page.');
            router.push('/assignment/10/2440011961');
          }
        } catch (err) {
          console.error("Error fetching admin role:", err);
          alert('Error checking role. Access Denied.');
          router.push('/assignment/10/2440011961');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading admin dashboard...</p>;
  }

  if (!user || !isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #dc3545', borderRadius: '8px', boxShadow: '0 4px 8px rgba(220,53,69,0.2)' }}>
      <h1 style={{ color: '#dc3545' }}>Admin Dashboard ⚙️</h1>
      <p>Welcome, Administrator {user.email}! This is a highly restricted area.</p>
      {/* Admin specific content here */}
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        <li style={{ marginBottom: '10px', padding: '8px', border: '1px solid #f5c6cb', borderRadius: '4px', backgroundColor: '#f8d7da' }}>Manage Users</li>
        <li style={{ marginBottom: '10px', padding: '8px', border: '1px solid #f5c6cb', borderRadius: '4px', backgroundColor: '#f8d7da' }}>View System Logs</li>
        <li style={{ marginBottom: '10px', padding: '8px', border: '1px solid #f5c6cb', borderRadius: '4px', backgroundColor: '#f8d7da' }}>Configure Settings</li>
      </ul>
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

export default AdminDashboardPage;