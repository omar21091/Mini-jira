import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskActions from './TaskActions';

const TaskList = ({ refresh, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, searchTerm]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks');
      setTasks(response.data || []); // Ensure it's always an array
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
      console.error('Error fetching tasks:', err);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(task => task && task.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task && (
          (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }

    setFilteredTasks(filtered);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
    if (onTaskUpdate) onTaskUpdate();
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="task-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Tasks</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <h2>Tasks ({filteredTasks.length})</h2>
      
      {filteredTasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <h3>{task.title || 'Untitled Task'}</h3>
                <p>{task.description || 'No description'}</p>
                <span className={`status ${task.status || 'TODO'}`}>
                  {task.status || 'TODO'}
                </span>
                {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
              </div>
              
              {/* Only render TaskActions if task exists */}
              {task && (
                <TaskActions 
                  task={task}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;