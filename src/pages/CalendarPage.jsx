// src/pages/CalendarPage.jsx

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import API from "../api";
import "../styles/CalendarPage.css";

// Format a Date object into a "YYYY-MM-DD" string (local time)
function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarPage() {
  // selected calendar date
  const [value, setValue] = useState(new Date());
  // list of tasks fetched from backend
  const [tasks, setTasks] = useState([]);
  // loading / error flags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Task details modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState("");

  // on-mount: fetch tasks once
  useEffect(() => {
    API.get("/api/tasks")
      .then((res) => {
        // map each task to { id, title, date }
        const mapped = res.data.map((t) => ({
          id: t.id,
          title: t.title,
          date: t.deadline,
        }));
        setTasks(mapped);
      })
      .catch((err) => {
        console.error("Error fetching tasks for calendar:", err);
        setError("Could not load calendar tasks.");
      })
      .finally(() => setLoading(false));
  }, []);

  // when user clicks a date cell
  const handleDateChange = (date) => {
    setValue(date);
    const selected = formatLocalDate(date);
    const tasksForDate = tasks.filter((t) => t.date === selected);
    setSelectedDateTasks(tasksForDate);
    setSelectedDateStr(selected);
    setShowTaskModal(true);
  };

  // render task titles inside date cells
  const tileContent = ({ date }) => {
    const key = formatLocalDate(date);
    const matchingTasks = tasks.filter((t) => t.date === key);
    
    if (matchingTasks.length === 0) return null;
    
    return (
      <div className="task-tile-content">
        {matchingTasks.slice(0, 2).map((task) => (
          <p key={task.id} className="tile-task-title">{task.title}</p>
        ))}
        {matchingTasks.length > 2 && (
          <p className="tile-task-more">+{matchingTasks.length - 2} more</p>
        )}
      </div>
    );
  };

  // add a CSS class to cells that have at least one task
  const tileClassName = ({ date }) => {
    const key = formatLocalDate(date);
    return tasks.some((t) => t.date === key)
      ? "react-calendar__tile--hasTask"
      : null;
  };

  // show loading or error if needed
  if (loading) return <p>Loading calendar…</p>;
  if (error) return <p className="error">{error}</p>;

  // main calendar render
  return (
    <div className="calendar-page-container">
      <h1>Task Deadlines Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
      
      {showTaskModal && (
        <div className="task-modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-modal-header">
              <h2>Tasks for {selectedDateStr}</h2>
              <button onClick={() => setShowTaskModal(false)} className="task-modal-close">×</button>
            </div>
            <div className="task-modal-content">
              {selectedDateTasks.length > 0 ? (
                <ul className="task-list">
                  {selectedDateTasks.map((task) => (
                    <li key={task.id} className="task-list-item">{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No tasks for this date</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
