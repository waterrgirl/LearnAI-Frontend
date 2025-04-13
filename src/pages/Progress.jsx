// src/pages/Progress.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import "../styles/ProgressPage.css";

export default function Progress() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/api/tasks")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching tasks for progress:", err);
        setError("Could not load progress data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading progress…</p>;
  if (error) return <p className="error-message">{error}</p>;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-page">
      <h1>Your Progress</h1>

      <div className="stats">
        <p>
          Completed <strong>{completed}</strong> of <strong>{total}</strong> tasks
        </p>
        <p>
          <strong>{pct}%</strong> done
        </p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
