import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/tasks', {
        title,
        description,
        status: 'TODO'
      });
      setTitle('');
      setDescription('');
      onTaskAdded(); // This will refresh the task list
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="task-form">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;