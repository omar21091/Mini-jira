import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm'; // ADD THIS IMPORT
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false); // ADD THIS STATE

  const handleTaskAdded = () => {
    setRefresh(prev => !prev); // This will trigger TaskList to refresh
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Jira - Task Management</h1>
      </header>
      <main>
        <TaskForm onTaskAdded={handleTaskAdded} /> {/* ADD THIS LINE */}
        <TaskList refresh={refresh} /> {/* ADD refresh PROP */}
      </main>
    </div>
  );
}

export default App;