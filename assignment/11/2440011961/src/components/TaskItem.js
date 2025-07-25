// src/components/TaskItem.js (or components/TaskItem.js)
import React from 'react';
// import styles from './TaskItem.module.css'; // If you use CSS Modules

function TaskItem({ task, onToggleComplete, onDelete }) {
  return (
    <div className="task-item" style={{ backgroundColor: task.completed ? (document.documentElement.getAttribute('data-theme') === 'dark' ? '#555' : '#f0f0f0') : (document.documentElement.getAttribute('data-theme') === 'dark' ? '#444' : 'white') }}>
      <span
        className={`task-item-title ${task.completed ? 'task-item-completed' : ''}`}
        onClick={() => onToggleComplete(task.id, !task.completed)}
      >
        {task.title}
      </span>
      <div className="task-item-actions">
        <input
          type="checkbox"
          className="task-item-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, !task.completed)}
        />
        <button
          onClick={() => onDelete(task.id)}
          className="task-item-delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;