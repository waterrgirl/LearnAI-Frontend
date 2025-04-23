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
        nextWeek.setDate(now.getDate() + 14); // Show tasks for next two weeks
        
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
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDay = (dateString) => {
    return new Date(dateString).getDate();
  };
  
  const formatMonth = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
  };
  
  const formatWeekday = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading) {
    return (
      <div className="calendar-preview-loading">
        <i className="fas fa-calendar fa-spin"></i>
        <p>Loading your deadlines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-preview-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="calendar-preview-empty">
        <i className="far fa-calendar"></i>
        <p>No upcoming deadlines in the next two weeks.</p>
        <Link to="/tasks" className="add-task-btn">
          <i className="fas fa-plus"></i> Add a task
        </Link>
      </div>
    );
  }

  return (
    <div className="calendar-preview-content">
      <div className="upcoming-events">
        {upcomingEvents.map((event, index) => (
          <div key={event.id || index} className="event-item">
            <div className="event-date">
              <div className="date-number">{formatDay(event.deadline)}</div>
              <div className="date-month">{formatMonth(event.deadline)}</div>
            </div>
            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              <div className="event-meta">
                <span className="event-day">{formatWeekday(event.deadline)}, {formatDay(event.deadline)} {formatMonth(event.deadline)}</span>
                {event.priority && (
                  <span className={`priority-badge ${event.priority.toLowerCase()}`}>
                    {event.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarPreview;