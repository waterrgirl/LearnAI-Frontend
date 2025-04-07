import React, { useState } from "react";
import "../styles/TasksPage.css"; 

function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Math Homework", deadline: "2024-01-10", priority: "High", completed: false },
    { id: 2, title: "Science Project", deadline: "2024-01-15", priority: "Medium", completed: true },
    { id: 3, title: "History Essay", deadline: "2024-01-20", priority: "Low", completed: false },
  ]);

  const [newTask, setNewTask] = useState({ title: "", deadline: "", priority: "Low" });

  const addTask = () => {
    if (!newTask.title || !newTask.deadline) {
      alert("Please fill in all fields.");
      return;
    }
    const id = tasks.length + 1;
    setTasks([...tasks, { id, ...newTask, completed: false }]);
    setNewTask({ title: "", deadline: "", priority: "Low" });
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="tasks-page">
      <h1>Manage Your Tasks</h1>

      {/* Add New Task Form */}
      <div className="add-task-form">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        <h2>Your Tasks</h2>
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
              <tr key={task.id} className={task.completed ? "completed" : ""}>
                <td>{task.title}</td>
                <td>{task.deadline}</td>
                <td>{task.priority}</td>
                <td>{task.completed ? "Completed" : "Pending"}</td>
                <td>
                  <button onClick={() => toggleCompletion(task.id)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TasksPage;

