import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Suggestions.css';

function SuggestionWidget({ maxItems = 2, showViewAll = true }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for different suggestion types
  const getIconForType = (type) => {
    switch (type) {
      case 'schedule': return 'fa-clock';
      case 'subject': return 'fa-book';
      case 'productivity': return 'fa-chart-line';
      case 'technique': return 'fa-brain';
      default: return 'fa-lightbulb';
    }
  };

  // Background color for different suggestion types
  const getColorForType = (type) => {
    switch (type) {
      case 'schedule': return 'bg-schedule';
      case 'subject': return 'bg-subject';
      case 'productivity': return 'bg-productivity';
      case 'technique': return 'bg-technique';
      default: return '';
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!userData.uid) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/api/suggestions', {
          headers: {
            'X-User-ID': userData.uid
          }
        });
        
        if (response.data && response.data.suggestions) {
          setSuggestions(response.data.suggestions.slice(0, maxItems));
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError("Couldn't load personalized suggestions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [maxItems]);

  if (loading) {
    return (
      <div className="suggestions-widget">
        <div className="suggestions-header">
          <h3>Smart Suggestions</h3>
          <div className="suggestions-loading">
            <i className="fas fa-spinner fa-spin"></i> Learning about your study habits...
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="suggestions-widget">
        <div className="suggestions-header">
          <h3>Smart Suggestions</h3>
          <div className="suggestions-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="suggestions-widget">
      <div className="suggestions-header">
        <h3>Smart Suggestions</h3>
        {showViewAll && (
          <Link to="/suggestions" className="view-all-link">
            View All <i className="fas fa-chevron-right"></i>
          </Link>
        )}
      </div>
      
      <div className="suggestions-list">
        {suggestions.length === 0 ? (
          <div className="empty-suggestions">
            <i className="fas fa-lightbulb"></i>
            <p>Complete more tasks to get personalized suggestions!</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`suggestion-card ${getColorForType(suggestion.type)}`}
            >
              <div className="suggestion-icon">
                <i className={`fas ${getIconForType(suggestion.type)}`}></i>
              </div>
              <div className="suggestion-content">
                <h4>{suggestion.title}</h4>
                <p>{suggestion.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SuggestionWidget;