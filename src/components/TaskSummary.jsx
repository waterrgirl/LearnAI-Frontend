import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function TaskSummary() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    dueSoon: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/tasks');
        const allTasks = response.data || [];
        
        // Get 5 most recent tasks
        const sortedTasks = [...allTasks].sort((a, b) => {
          return new Date(b.created_at || b.deadline) - new Date(a.created_at || a.deadline);
        });
        
        setTasks(sortedTasks.slice(0, 5));
        
        // Calculate statistics
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        
        const stats = {
          total: allTasks.length,
          completed: allTasks.filter(t => t.completed).length,
          pending: allTasks.filter(t => !t.completed).length,
          dueSoon: allTasks.filter(t => {
            if (t.completed) return false;
            const deadline = new Date(t.deadline);
            return deadline <= tomorrow;
          }).length
        };
        
        setStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-section task-summary">
      <div className="section-header">
        <h2>Task Summary</h2>
        <Link to="/tasks" className="view-all">View All</Link>
      </div>
      
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card urgent">
          <div className="stat-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.dueSoon}</span>
            <span className="stat-label">Due Soon</span>
          </div>
        </div>
      </div>
      
      <div className="recent-tasks">
        <h3>Recent Tasks</h3>
        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="no-data">No tasks yet. <Link to="/tasks">Create your first task</Link></p>
        ) : (
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-status">
                  <span className={`status-dot ${task.completed ? 'completed' : 'pending'}`}></span>
                </div>
                <div className="task-info">
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-deadline">Due: {formatDate(task.deadline)}</p>
                </div>
                <div className="task-priority">
                  <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
                    {task.priority || 'Medium'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TaskSummary;