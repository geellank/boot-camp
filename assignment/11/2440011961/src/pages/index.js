// src/pages/index.js (or pages/index.js)
import Head from 'next/head';
import { useSettings } from '../context/SettingsContext'; // Adjust path if needed
import { useTasks } from '../hooks/useTasks';           // Adjust path if needed
import TaskForm from '../components/TaskForm';         // Adjust path if needed
import TaskItem from '../components/TaskItem';         // Adjust path if needed

export default function Home() {
  // Destructure theme from useSettings to apply styles
  const { theme, toggleTheme, toggleLanguage } = useSettings(); // Keep toggle functions if you want to reuse
  // (Note: you only need 'theme' for styling in this main component)

  // Destructure task-related state and functions from useTasks
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();

  // Basic styling based on theme for the overall container
  const containerStyle = {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    color: theme === 'dark' ? '#eee' : '#333',
    fontFamily: 'Arial, sans-serif'
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: theme === 'dark' ? '#eee' : '#333'
  };

  // Display loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <p style={headingStyle}>Loading tasks...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div style={containerStyle}>
        <p style={headingStyle}>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Head>
        <title>Task Management App</title>
        <meta name="description" content="A simple task management app with Next.js and Firebase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ maxWidth: '600px', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', backgroundColor: theme === 'dark' ? '#444' : 'white' }}>
        <h1 style={headingStyle}>My Tasks</h1>

        <div style={{ padding: '20px' }}>
          {/* Task Form to add new tasks */}
          <TaskForm onAddTask={addTask} />

          {/* Task List */}
          <div style={{ marginTop: '20px' }}>
            {tasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: theme === 'dark' ? '#bbb' : '#666' }}>No tasks yet. Add one above!</p>
            ) : (
              // Map through tasks and render TaskItem for each
              tasks.map((task) => (
                <TaskItem
                  key={task.id} // Important for React list rendering
                  task={task}
                  onToggleComplete={updateTask} // Pass updateTask function for completion toggle
                  onDelete={deleteTask}         // Pass deleteTask function for deletion
                />
              ))
            )}
          </div>
        </div>

        {/* Optional: Keep theme/language toggles for testing or if desired */}
        <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #eee', marginTop: '20px' }}>
          <p>Current Theme: {theme}</p>
          <button onClick={toggleTheme} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>
            Toggle Theme
          </button>
          {/* <button onClick={toggleLanguage} style={{ padding: '8px 15px', cursor: 'pointer' }}>
            Toggle Language
          </button> */}
          {/* Language toggle commented out as it's not directly part of task logic, but you can uncomment */}
        </div>
      </main>
    </div>
  );
}