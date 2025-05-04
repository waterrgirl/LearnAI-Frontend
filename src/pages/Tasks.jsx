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
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
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
      
      // Dispatch a custom event to notify other components
      // that tasks have been updated
      window.dispatchEvent(new CustomEvent('tasksUpdated'));
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

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title || !editingTask.deadline) {
      alert("Please fill in both title and deadline.");
      return;
    }
    try {
      await API.put(`/api/tasks/${editingTask.id}`, editingTask);
      setIsEditing(false);
      setEditingTask(null);
      fetchTasks(); 
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task.");
    }
  };

  const openEditModal = (task) => {
    setEditingTask({...task});
    setIsEditing(true);
  };

  const openViewModal = (task) => {
    setViewingTask({...task});
    setIsViewing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setIsViewing(false);
    setEditingTask(null);
    setViewingTask(null);
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await API.patch(`/api/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Could not update task status.");
    }
  };

  const toggleCompletion = async (id, current) => {
    try {
      await API.patch(`/api/tasks/${id}`, { 
        completed: !current,
        // If completing a task, set status to completed. If undoing, set to pending
        status: !current ? 'completed' : 'pending'
      });
      fetchTasks(); // Will dispatch the tasksUpdated event
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Could not update task status.");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/api/tasks/${id}`);
      fetchTasks(); // Will dispatch the tasksUpdated event
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Could not delete task.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "in-progress": return "status-in-progress";
      case "completed": return "status-completed";
      case "pending": 
      default: return "status-pending";
    }
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="tasks-page">
      <h1>Manage Your Tasks</h1>

      {/* Add Task Form */}
      <form className="add-task-form" onSubmit={handleAddTask}>
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
          className="form-input"
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask((t) => ({ ...t, deadline: e.target.value }))}
          className="form-input"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask((t) => ({ ...t, priority: e.target.value }))}
          className="form-input"
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
          className="form-textarea"
        ></textarea>
        <button type="submit" className="btn-primary">Add Task</button>
      </form>

      {/* Loading and Error States */}
      {loading && <div className="loading">Loading tasks...</div>}
      {error && <div className="error">{error}</div>}

      {/* Task List */}
      {!loading && !error && (
        <div className="task-list">
          <h2>Your Tasks</h2>
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks yet. Add your first task above!</p>
            </div>
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
                    className={task.completed ? "completed" : task.status === "in-progress" ? "in-progress" : ""}
                  >
                    <td className="task-title">{task.title}</td>
                    <td>{formatDate(task.deadline)}</td>
                    <td className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(task.status || (task.completed ? "completed" : "pending"))}`}>
                        {task.status === "in-progress" ? "In Progress" : 
                         task.completed || task.status === "completed" ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => openViewModal(task)} 
                        className="btn-view"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => openEditModal(task)} 
                        className="btn-edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      <div className="status-buttons">
                        
                        
                        <button 
                          onClick={() => toggleCompletion(task.id, task.completed)}
                          className={task.completed ? "btn-undo" : "btn-complete"}
                        >
                          {task.completed ? (
                            <i className="fas fa-undo"></i>
                          ) : (
                            <i className="fas fa-check"></i>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="btn-delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View Task Modal */}
      {isViewing && viewingTask && (
        <div className="modal-backdrop">
          <div className="task-modal view-modal">
            <div className="modal-header">
              <h3>Task Details</h3>
              <button onClick={closeModal} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-row">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{viewingTask.title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Deadline:</span>
                <span className="detail-value">{formatDate(viewingTask.deadline)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Priority:</span>
                <span className={`detail-value priority-${viewingTask.priority.toLowerCase()}`}>
                  {viewingTask.priority}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`detail-value ${getStatusClass(viewingTask.status || (viewingTask.completed ? "completed" : "pending"))}`}>
                  {viewingTask.status === "in-progress" ? "In Progress" : 
                   viewingTask.completed || viewingTask.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <div className="task-description">
                  {viewingTask.description || "No description provided."}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                closeModal();
                openEditModal(viewingTask);
              }} className="btn-edit">
                <i className="fas fa-edit"></i> Edit Task
              </button>
              <button onClick={closeModal} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditing && editingTask && (
        <div className="modal-backdrop">
          <div className="task-modal edit-modal">
            <div className="modal-header">
              <h3>Edit Task</h3>
              <button onClick={closeModal} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditTask} className="modal-content">
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-deadline">Deadline</label>
                <input
                  id="edit-deadline"
                  type="date"
                  value={editingTask.deadline}
                  onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-priority">Priority</label>
                <select
                  id="edit-priority"
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  className="form-input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  value={editingTask.status || (editingTask.completed ? "completed" : "pending")}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setEditingTask({
                      ...editingTask, 
                      status: newStatus,
                      completed: newStatus === "completed"
                    });
                  }}
                  className="form-input"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={editingTask.description || ""}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  rows="4"
                  className="form-textarea"
                ></textarea>
              </div>
              
              <div className="modal-footer">
                <button type="submit" className="btn-primary">
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;