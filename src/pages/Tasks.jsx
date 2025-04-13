// src/pages/TasksPage.jsx
import React, { useState, useEffect } from "react";
import API from "../api";                // your axios instance
import "../styles/TasksPage.css";

function TasksPage() {
  // state for list of tasks
  const [tasks, setTasks] = useState([]);
  // state for the new task form
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    priority: "Low",
  });
  // state for loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from backend when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching tasks from backend…");
      const res = await API.get("/tasks");
      console.log("Tasks fetched:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // Handler to add a new task via POST /add-task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) {
      alert("Please fill in both title and deadline.");
      return;
    }

    try {
      console.log("Adding task:", newTask);
      const res = await API.post("/add-task", newTask);
      console.log("Add-task response:", res.data);
      // Clear form
      setNewTask({ title: "", deadline: "", priority: "Low" });
      // Refresh list
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  // Local toggle completion (you can wire this up to a PATCH endpoint later)
  const toggleCompletion = (id) => {
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Local delete (you can wire this up to a DELETE endpoint later)
  const deleteTask = (id) => {
    setTasks((ts) => ts.filter((t) => t.id !== id));
  };

  return (
    <div className="tasks-page">
      <h1>Manage Your Tasks</h1>

      {/* Add New Task Form */}
      <form className="add-task-form" onSubmit={handleAddTask}>
        <h2>Add New Task</h2>

        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, title: e.target.value }))
          }
        />

        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, deadline: e.target.value }))
          }
        />

        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, priority: e.target.value }))
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading tasks…</p>}
      {error && <p className="error">{error}</p>}

      {/* Task List */}
      {!loading && !error && (
        <div className="task-list">
          <h2>Your Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className={task.completed ? "completed" : ""}
                  >
                    <td>{task.title}</td>
                    <td>{task.deadline}</td>
                    <td>{task.priority}</td>
                    <td>{task.completed ? "Completed" : "Pending"}</td>
                    <td>
                      <button onClick={() => toggleCompletion(task.id)}>
                        {task.completed ? "Undo" : "Complete"}
                      </button>
                      <button onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
