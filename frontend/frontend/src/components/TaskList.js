import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
      console.error('Error fetching tasks:', err);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className={`status ${task.status}`}>{task.status}</span>
              {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;