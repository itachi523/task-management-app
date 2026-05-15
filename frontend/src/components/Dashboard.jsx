import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Search,
  Plus,
  LogOut,
} from 'lucide-react';

import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [search, setSearch] = useState('');

  const username =
    localStorage.getItem('username');

  const fetchTasks = async () => {
    try {
      const token =
        localStorage.getItem('token');

      const res = await axios.get(
        'https://task-management-backend-0ysg.onrender.com/api/tasks',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem('token');

      await axios.delete(
        `https://task-management-backend-0ysg.onrender.com/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/auth';
  };

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div className="profile-section">

          <div className="avatar">
            {username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>Hello, {username}</h2>
            <p>Welcome back to TaskMaster</p>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="dashboard-topbar">

        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          className="new-task-btn"
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          New Task
        </button>

      </div>

      <div className="task-grid">

        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}

      </div>

      {showModal && (
        <TaskForm
          task={selectedTask}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
            fetchTasks();
          }}
        />
      )}

    </div>
  );
};

export default Dashboard;