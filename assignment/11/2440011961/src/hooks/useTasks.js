// src/hooks/useTasks.js (or hooks/useTasks.js)
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase'; // Adjust path if not in src

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for tasks
  useEffect(() => {
    // Query to order tasks by creation time (newest first)
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setError(err);
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // Function to add a new task
  const addTask = async (title) => {
    try {
      setLoading(true); // Indicate loading state
      await addDoc(collection(db, 'tasks'), {
        title,
        completed: false,
        createdAt: serverTimestamp(), // Use Firestore's server timestamp
      });
      setLoading(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      setError(e);
      setLoading(false);
    }
  };

  // Function to update an existing task
  const updateTask = async (id, updates) => {
    try {
      setLoading(true); // Indicate loading state
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
      setLoading(false);
    } catch (e) {
      console.error("Error updating document: ", e);
      setError(e);
      setLoading(false);
    }
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    try {
      setLoading(true); // Indicate loading state
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
      setLoading(false);
    } catch (e) {
      console.error("Error deleting document: ", e);
      setError(e);
      setLoading(false);
    }
  };

  return { tasks, loading, error, addTask, updateTask, deleteTask };
}