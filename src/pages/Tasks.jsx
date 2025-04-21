// src/pages/TasksPage.jsx
import React, { useState, useEffect } from "react";
import API from "../api";
import "../styles/TasksPage.css";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: "", 
    deadline: "", 
    priority: "Low",
    description: "" 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) {
      alert("Please fill in both title and deadline.");
      return;
    }
    try {
      await API.post("/api/add-task", newTask);
      setNewTask({ title: "", deadline: "", priority: "Low", description: "" });
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  const toggleCompletion = async (id, current) => {
    try {
      await API.patch(`/api/tasks/${id}`, { completed: !current });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Could not update task status.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Could not delete task.");
    }
  };

  return (
    <div className="tasks-page">
      <h1>Manage Your Tasks</h1>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask((t) => ({ ...t, deadline: e.target.value }))}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask((t) => ({ ...t, priority: e.target.value }))}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <textarea
          placeholder="Task Description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
          rows="3"
        ></textarea>
        <button type="submit">Add Task</button>
      </form>

      {loading && <p>Loading tasks…</p>}
      {error && <p className="error">{error}</p>}

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
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className={task.completed ? "completed" : ""}>
                    <td className="task-title" title={task.description || ""}>
                      {task.title}
                    </td>
                    <td>{task.deadline}</td>
                    <td>{task.priority}</td>
                    <td>{task.category || "General"}</td>
                    <td>{task.completed ? "Completed" : "Pending"}</td>
                    <td>
                      <button onClick={() => toggleCompletion(task.id, task.completed)}>
                        {task.completed ? "Undo" : "Complete"}
                      </button>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
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