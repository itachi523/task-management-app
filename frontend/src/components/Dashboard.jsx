import React, {
  useEffect,
  useState
} from 'react';

import axios from 'axios';

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  LogOut
} from 'lucide-react';

import TaskForm from './TaskForm';

const Dashboard = () => {

  const [tasks, setTasks] = useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [search, setSearch] =
    useState('');

  const token =
    localStorage.getItem('token');

  const username =
    localStorage.getItem('username');

  const API =
    'https://task-management-backend-0ysg.onrender.com';

  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        `${API}/api/tasks`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTasks(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchTasks();

  }, []);

  const deleteTask = async (id) => {

    try {

      await axios.delete(
        `${API}/api/tasks/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchTasks();

    } catch (err) {

      console.log(err);
    }
  };

  const logout = () => {

    localStorage.clear();

    window.location.href = '/';
  };

  const filteredTasks =
    tasks.filter((task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div className="dashboard-container">

      {/* HEADER */}

      <div className="dashboard-header">

        <div className="profile-section">

          <div className="avatar">
            {username?.charAt(0)}
          </div>

          <div>
            <h2>
              Hello, {username}
            </h2>

            <p>
              Welcome back to TaskMaster
            </p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <LogOut />
        </button>

      </div>

      {/* TOPBAR */}

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

      {/* TASKS */}

      <div className="task-grid">

        {filteredTasks.map((task) => (

          <div
            className="modern-task-card"
            key={task._id}
          >

            <div className="card-glow"></div>

            <div className="modern-task-header">

              <div>

                <span
                  className={`task-badge ${task.status
                    .replace(/\s/g, '')
                    .toLowerCase()}`}
                >
                  {task.status}
                </span>

                <h2>
                  {task.title}
                </h2>
              </div>

              <div className="modern-task-actions">

                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    deleteTask(task._id)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>

            <p className="modern-task-description">
              {task.description}
            </p>

            <div className="modern-task-footer">

              <div className="modern-task-date">

                <CalendarDays size={18} />

                <span>
                  {new Date(
                    task.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}

      {showModal && (

        <TaskForm
          task={selectedTask}
          onClose={() => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;