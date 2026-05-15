import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const TaskForm = ({ task, onClose }) => {

  const [title, setTitle] = useState(
    task?.title || ''
  );

  const [description, setDescription] =
    useState(task?.description || '');

  const [status, setStatus] = useState(
    task?.status || 'To Do'
  );

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token =
        localStorage.getItem('token');

      const data = {
        title,
        description,
        status,
      };

      if (task) {

        await axios.put(
          `http://localhost:5001/api/tasks/${task._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } else {

        await axios.post(
          'http://localhost:5001/api/tasks',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      onClose();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Something went wrong'
      );
    }
  };

  return (

    <div className="modal-overlay">

      <div className="task-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2>
          {task
            ? 'Edit Task'
            : 'Create New Task'}
        </h2>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter task title"
            required
          />

          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter description"
            required
          />

          <label>Status</label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-btn"
            >
              {task
                ? 'Save Changes'
                : 'Create Task'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default TaskForm;