import React from 'react';

import {
  Pencil,
  Trash2,
  CalendarDays,
} from 'lucide-react';

const TaskCard = ({
  task,
  onDelete,
  onEdit,
}) => {
  const getStatusClass = () => {
    if (task.status === 'To Do')
      return 'todo';

    if (task.status === 'In Progress')
      return 'inprogress';

    return 'done';
  };

  return (
    <div className="modern-task-card">

      <div className="card-glow"></div>

      <div className="modern-task-header">

        <div>
          <div
            className={`task-badge ${getStatusClass()}`}
          >
            {task.status}
          </div>

          <h2>{task.title}</h2>
        </div>

        <div className="modern-task-actions">

          <button
            onClick={() => onEdit(task)}
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() =>
              onDelete(task._id)
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

          {new Date(
            task.createdAt
          ).toLocaleDateString()}
        </div>

      </div>

    </div>
  );
};

export default TaskCard;