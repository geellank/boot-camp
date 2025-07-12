// assignment/10/2440011961/pages/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase'; // Import auth and db
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Firebase authenticated user
  const [userRole, setUserRole] = useState(null); // User role from Firestore
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login/register
  const router = useRouter();

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // User is logged in, fetch their role
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().role);
          } else {
            console.log("No user role found for this user, assigning default 'user'");
            // Optionally, assign a default role if not found (e.g., for new users)
            await setDoc(userDocRef, { role: 'user', email: currentUser.email });
            setUserRole('user');
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          setError("Failed to fetch user role.");
        }
      } else {
        setUserRole(null); // Clear role if no user
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (isRegistering) {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Store user role in Firestore immediately after registration
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          role: 'user', // Default role for new users
          createdAt: new Date()
        });
        alert('Registration successful! You are now logged in as a regular user.');
      } else {
        // Login existing user
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      }
      // Redirection logic will be handled by the useEffect above reacting to user state change
    } catch (err) {
      console.error("Authentication Error:", err);
      // Firebase error codes provide more specific messages
      let errorMessage = "Authentication failed. Please check your credentials.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      setError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/assignment/10/2440011961'); // Redirect to home page after logout
      alert('Logged out successfully!');
    } catch (err) {
      console.error("Logout Error:", err);
      setError("Failed to log out.");
    }
  };

  // HTML5 and JSX validation for forms
  const isFormValid = email.includes('@') && password.length >= 6; // Basic validation example

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      {user ? (
        <div>
          <h1 style={{ color: '#28a745' }}>Welcome, {user.email}! 👋</h1>
          <p>Your Role: <strong>{userRole || 'Loading Role...'}</strong></p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => router.push('/assignment/10/2440011961/user/profile')}
              style={{
                padding: '10px 15px', backgroundColor: '#007bff', color: 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px'
              }}
            >
              Go to Profile
            </button>
            {userRole === 'admin' && (
              <button
                onClick={() => router.push('/assignment/10/2440011961/admin/dashboard')}
                style={{
                  padding: '10px 15px', backgroundColor: '#dc3545', color: 'white',
                  border: 'none', borderRadius: '5px', cursor: 'pointer'
                }}
              >
                Go to Admin Dashboard
              </button>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px', padding: '10px 20px', backgroundColor: '#6c757d',
              color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h1 style={{ textAlign: 'center', color: '#007bff' }}>{isRegistering ? 'Register' : 'Login'}</h1>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {error && <p style={{ color: 'red', textAlign: 'center', margin: '0' }}>{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // HTML5 validation
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // HTML5 validation
              minLength={6} // HTML5 validation
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {!isFormValid && <p style={{ color: 'orange', fontSize: '0.9em', margin: '-10px 0 0 0' }}>Email must be valid and password at least 6 characters.</p>}
            <button
              type="submit"
              disabled={!isFormValid} // Manual validation in JSX
              style={{
                padding: '12px 20px', backgroundColor: '#007bff', color: 'white',
                border: 'none', borderRadius: '5px', cursor: isFormValid ? 'pointer' : 'not-allowed',
                opacity: isFormValid ? 1 : 0.6
              }}
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              marginTop: '15px', padding: '10px 15px', backgroundColor: '#6c757d',
              color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
              width: '100%'
            }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;