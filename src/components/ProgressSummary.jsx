import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProgressSummary() {
  const [progressData, setProgressData] = useState({
    completed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/tasks');
        const tasks = response.data || [];
        
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.filter(task => !task.completed).length;
        
        setProgressData({ completed, pending });
        setError(null);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgressData();
  }, []);

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [progressData.completed, progressData.pending],
        backgroundColor: ['#4CAF50', '#FFC107'],
        borderColor: ['#388E3C', '#FFB300'],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '70%'
  };
  
  const totalTasks = progressData.completed + progressData.pending;
  const completionRate = totalTasks > 0 
    ? Math.round((progressData.completed / totalTasks) * 100) 
    : 0;

  return (
    <div className="dashboard-section progress-summary">
      <div className="section-header">
        <h2>Progress Overview</h2>
        <Link to="/progress" className="view-all">Full Analytics</Link>
      </div>
      
      <div className="progress-content">
        {loading ? (
          <p className="loading">Loading progress data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : totalTasks === 0 ? (
          <p className="no-data">No tasks data available to display progress.</p>
        ) : (
          <div className="progress-chart-container">
            <div className="chart-wrapper">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="completion-rate">
                <span className="rate-value">{completionRate}%</span>
                <span className="rate-label">Complete</span>
              </div>
            </div>
            <div className="progress-stats">
              <div className="progress-stat">
                <span className="stat-label">Completed Tasks:</span>
                <span className="stat-value completed">{progressData.completed}</span>
              </div>
              <div className="progress-stat">
                <span className="stat-label">Pending Tasks:</span>
                <span className="stat-value pending">{progressData.pending}</span>
              </div>
              <div className="progress-stat">
                <span className="stat-label">Total Tasks:</span>
                <span className="stat-value">{totalTasks}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressSummary;