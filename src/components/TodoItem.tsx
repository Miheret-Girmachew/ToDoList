import React, { useState } from 'react';
import './TodoItem.css';  

interface TodoItemProps {
  task: {
    id: string;
    text: string;
    status: 'undone' | 'inProgress' | 'done';
  };
  onRemove: () => void;
  onUpdate: (newText: string) => void; 
  onStatusChange: (newStatus: 'undone' | 'inProgress' | 'done') => void; 
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onRemove, onUpdate, onStatusChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing) {
      onUpdate(editText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <li className={`todo-item ${task.status}`}>
      {isEditing ? (
        <>
          <label htmlFor={`edit_task_${task.id}`} className="sr-only">Edit Task</label>
          <input
            type="text"
            id={`edit_task_${task.id}`}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            autoFocus
            placeholder="Edit your task"
          />
        </>
      ) : (
        <span>{task.text}</span>
      )}

      <div className="buttons">
        <button onClick={handleEdit} aria-label="Edit Task">
          <i className="fas fa-edit"></i>
        </button>

        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as 'undone' | 'inProgress' | 'done')} 
          aria-label={`Mark task as ${task.status}`}
        >
          <option value="undone">Undone</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button onClick={onRemove} aria-label="Remove Task">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default TodoItem;