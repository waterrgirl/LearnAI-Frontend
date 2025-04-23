import React from 'react';
import SuggestionWidget from '../components/SuggestionWidget';

function SuggestionsPage() {
  return (
    <div className="suggestions-page">
      <h1>Personalized Study Suggestions</h1>
      <p className="page-description">
        These recommendations are generated based on your task history, study patterns, 
        and completion rates. They adapt as you use LearnAI more frequently.
      </p>
      
      <SuggestionWidget maxItems={10} showViewAll={false} />
      
      <div className="ml-info">
        <h2>How It Works</h2>
        <p>
          Our adaptive suggestion system uses machine learning to analyze your task management 
          patterns, study habits, and academic performance. As you use LearnAI more, the system 
          will get better at providing personalized recommendations tailored to your unique learning style.
        </p>
        <div className="ml-features">
          <div className="ml-feature">
            <i className="fas fa-user-check"></i>
            <h3>Personalized Analysis</h3>
            <p>We analyze your task completion patterns, subject areas, and productivity times.</p>
          </div>
          <div className="ml-feature">
            <i className="fas fa-robot"></i>
            <h3>Adaptive Learning</h3>
            <p>Our system improves over time as it learns more about your academic behavior.</p>
          </div>
          <div className="ml-feature">
            <i className="fas fa-lock"></i>
            <h3>Privacy First</h3>
            <p>All analysis is done securely and your data is never shared with third parties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuggestionsPage;