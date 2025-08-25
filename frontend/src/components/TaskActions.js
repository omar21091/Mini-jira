import React, { useState } from 'react';
import axios from 'axios';

const TaskActions = ({ task, onTaskUpdated, onTaskDeleted }) => {
  // Move ALL hooks to the TOP - no conditionals before hooks!
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Initialize state with task data AFTER hooks
  useState(() => {
    if (task) {
      setEditTitle(task.title || '');
      setEditDescription(task.description || '');
    }
  });

  // Safety check - if no task, show error
  if (!task) {
    return <div className="error">Error: Task not available</div>;
  }

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
        ...task,
        status: newStatus
      });
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
        ...task,
        title: editTitle,
        description: editDescription
      });
      setIsEditing(false);
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:8080/api/tasks/${task.id}`);
        onTaskDeleted();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="task-edit">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={handleEdit}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="task-actions">
      <select 
        value={task.status || 'TODO'} 
        onChange={(e) => updateStatus(e.target.value)}
        className="status-select"
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      
      <button onClick={() => setIsEditing(true)} className="edit-btn">
        Edit
      </button>
      
      <button onClick={deleteTask} className="delete-btn">
        Delete
      </button>
    </div>
  );
};

export default TaskActions;