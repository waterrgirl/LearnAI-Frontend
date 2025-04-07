import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../styles/ProgressPage.css";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ProgressPage() {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch task data from the back-end API
    const fetchTaskData = async () => {
      try {
        const response = await axios.get("http://<your-backend-url>/tasks"); // Replace with your back-end endpoint
        setTaskData(response.data.tasks || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load task data. Please try again later.");
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  // Calculate progress metrics
  const totalTasks = taskData.length;
  const completedTasks = taskData.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Prepare data for charts
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

export default ProgressPage;

