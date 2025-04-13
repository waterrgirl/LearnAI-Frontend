import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import API from "../api";                // your axios instance
import "../styles/CalendarPage.css";

// format a JS Date to "YYYY-MM-DD" in local time
function formatLocalDate(d) {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarPage() {
  const [value, setValue]   = useState(new Date());
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    API.get("/api/tasks")
      .then((res) => {
        // map { id, title, deadline } → { id, title, date }
        const mapped = res.data.map((t) => ({
          id:    t.id,
          title: t.title,
          date:  t.deadline
        }));
        setTasks(mapped);
      })
      .catch((err) => {
        console.error("Error fetching tasks for calendar:", err);
        setError("Could not load calendar tasks.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDateChange = (date) => {
    setValue(date);
    const key = formatLocalDate(date);
    const todays = tasks.filter((t) => t.date === key);

    if (todays.length) {
      alert(
        `Tasks for ${key}:\n` +
        todays.map((t) => `• ${t.title}`).join("\n")
      );
    } else {
      alert(`No tasks for ${key}`);
    }
  };

  const tileContent = ({ date }) => {
    const key = formatLocalDate(date);
    const match = tasks.find((t) => t.date === key);
    return match ? <p className="tile-task-title">{match.title}</p> : null;
  };

  const tileClassName = ({ date }) => {
    const key = formatLocalDate(date);
    return tasks.some((t) => t.date === key)
      ? "react-calendar__tile--hasTask"
      : null;
  };

  if (loading) return <p>Loading calendar…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="calendar-page-container">
      <h1>Task Deadlines Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        calendarType="US"        // start weeks on Sunday
      />
    </div>
  );
}
