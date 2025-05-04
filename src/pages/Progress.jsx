import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import API from "../api";
import "../styles/ProgressPage.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/tasks")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
        setError("Failed to load task data. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const barChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Status",
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#4CAF50", "#FFC107"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#4CAF50", "#FFC107"],
      },
    ],
  };

  return (
    <div className="progress-page">
      <h1>Progress Dashboard</h1>
      {loading ? (
        <p>Loading progress data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="progress-summary">
            <p>Total Tasks: {totalTasks}</p>
            <p>Completed Tasks: {completedTasks}</p>
            <p>Pending Tasks: {pendingTasks}</p>
          </div>
          <div className="charts">
            <div className="chart">
              <h2>Task Completion Overview (Bar Chart)</h2>
              <Bar data={barChartData} />
            </div>
            <div className="chart">
              <h2>Task Completion Overview (Pie Chart)</h2>
              <Pie data={pieChartData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
