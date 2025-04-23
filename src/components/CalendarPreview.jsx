import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function CalendarPreview() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/tasks');
        const tasks = response.data || [];
        
        // Get tasks with upcoming deadlines (within next 7 days)
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        
        const upcoming = tasks
          .filter(task => {
            const deadline = new Date(task.deadline);
            return !task.completed && deadline >= now && deadline <= nextWeek;
          })
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5); // Take top 5
        
        setUpcomingEvents(upcoming);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-section calendar-preview">
      <div className="section-header">
        <h2>Upcoming Deadlines</h2>
        <Link to="/calendar" className="view-all">View Calendar</Link>
      </div>
      
      <div className="calendar-content">
        {loading ? (
          <p className="loading">Loading calendar events...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : upcomingEvents.length === 0 ? (
          <p className="no-data">No upcoming deadlines in the next week.</p>
        ) : (
          <ul className="event-list">
            {upcomingEvents.map(event => (
              <li key={event.id} className="event-item">
                <div className="event-date">
                  <span className="date-number">{new Date(event.deadline).getDate()}</span>
                  <span className="date-month">{new Date(event.deadline).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className="event-info">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-time">{formatDate(event.deadline)}</p>
                </div>
                <div className="event-priority">
                  <span className={`priority-badge ${event.priority?.toLowerCase()}`}>
                    {event.priority || 'Medium'}
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

export default CalendarPreview;