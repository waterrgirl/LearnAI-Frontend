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

    if (tasksForDate.length > 0) {
      alert(
        `Tasks for ${selected}:\n` +
          tasksForDate.map((t) => `• ${t.title}`).join("\n")
      );
    } else {
      alert(`No tasks for ${selected}`);
    }
  };

  // render a task title inside its date cell
  const tileContent = ({ date }) => {
    const key = formatLocalDate(date);
    const match = tasks.find((t) => t.date === key);
    return match ? <p className="tile-task-title">{match.title}</p> : null;
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
        // you could disable neighbor months if desired:
        // showNeighboringMonth={false}
      />
    </div>
  );
}
