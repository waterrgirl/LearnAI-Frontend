import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../styles/CalendarPage.css';

function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Math Homework', date: '2025-01-05' },
    { id: 2, title: 'Science Project', date: '2025-01-10' },
    { id: 3, title: 'English Essay', date: '2025-01-10' },
  ]);

  const handleDateChange = (date) => {
    setValue(date);
    const selectedDate = date.toISOString().split('T')[0];
    const tasksForDate = tasks.filter((task) => task.date === selectedDate);

    if (tasksForDate.length > 0) {
      alert(`Tasks for ${selectedDate}:\n${tasksForDate.map((task) => task.title).join('\n')}`);
    } else {
      alert(`No tasks for ${selectedDate}`);
    }
  };

  const tileContent = ({ date }) => {
    const task = tasks.find((task) => task.date === date.toISOString().split('T')[0]);
    return task ? <p className="tile-task-title">{task.title}</p> : null;
  };

  const tileClassName = ({ date }) => {
    const hasTask = tasks.some((task) => task.date === date.toISOString().split('T')[0]);
    return hasTask ? 'react-calendar__tile--hasTask' : null;
  };

  return (
    <div className="calendar-page-container">
      <h1>Task Deadlines Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
    </div>
  );
}

export default CalendarPage;
