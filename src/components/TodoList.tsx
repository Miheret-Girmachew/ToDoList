import React, { useState, useEffect, useCallback } from 'react';
import TodoItem from './TodoItem';
import { v4 as uuidv4 } from 'uuid';
import './TodoList.css';

interface Task {
  id: string;
  text: string;
  status: 'undone' | 'inProgress' | 'done';
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        return JSON.parse(storedTasks);
      } catch (error) {
        console.error("Error parsing tasks from local storage:", error);
        return [];
      }
    } else {
      return [];
    }
  });

  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'undone'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to local storage:", error);
    }
  }, [tasks]);

  const sortTasks = useCallback((taskList: Task[]): Task[] => {
    return [...taskList].sort((a, b) => a.text.localeCompare(b.text));
  }, []);

  const handleAddTask = () => {
    if (taskInput.trim() === '') {
      alert('Please Enter Task!');
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      text: taskInput.trim(),
      status: 'undone',
    };

    setTasks(prevTasks => sortTasks([...prevTasks, newTask]));
    setTaskInput('');
  };

  const handleRemoveTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== id);
        return updatedTasks;
      });
    }
  };

  const handleUpdateTask = (id: string, newText: string) => {
    setTasks(prevTasks =>
      sortTasks(prevTasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      ))
    );
  };

  const handleTaskStatusChange = (id: string, newStatus: 'undone' | 'inProgress' | 'done') => {
    setTasks(prevTasks =>
      sortTasks(prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      ))
    );
  };

  const filteredTasks = useCallback(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.status === 'done');
      case 'pending':
        return tasks.filter(task => task.status === 'inProgress');  
      case 'undone':
        return tasks.filter(task => task.status === 'undone');
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const filteredAndSortedTasks = sortTasks(filteredTasks());

  const undoneTasks = filteredAndSortedTasks.filter(task => task.status === 'undone');
  const inProgressTasks = filteredAndSortedTasks.filter(task => task.status === 'inProgress');
  const doneTasks = filteredAndSortedTasks.filter(task => task.status === 'done');

  return (
    <div className="todo-list-container">
      <h1>TO-DO LIST</h1>
      <div className="filter-container">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pending</button>
        <button onClick={() => setFilter('undone')} className={filter === 'undone' ? 'active' : ''}>Undone</button>
      </div>

      <div className="input-container">
        <label htmlFor="task_input" className="sr-only">Task</label>
        <input
          type="text"
          id="task_input"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter Your Task!"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        <button onClick={handleAddTask}>
          <i className="fas fa-plus"></i> Add Task
        </button>
      </div>

      <div className="task-section">
        <h2>Undone</h2>
        <ul className="tasks-list">
          {undoneTasks.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              onRemove={() => handleRemoveTask(task.id)}
              onUpdate={(newText) => handleUpdateTask(task.id, newText)}
              onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
            />
          ))}
          {undoneTasks.length === 0 && <li className="empty-message">No undone tasks.</li>}
        </ul>
      </div>

      <div className="task-section">
        <h2>In Progress</h2>
        <ul className="tasks-list">
          {inProgressTasks.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              onRemove={() => handleRemoveTask(task.id)}
              onUpdate={(newText) => handleUpdateTask(task.id, newText)}
              onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
            />
          ))}
          {inProgressTasks.length === 0 && <li className="empty-message">No tasks in progress.</li>}
        </ul>
      </div>

      <div className="task-section">
        <h2>Done</h2>
        <ul className="tasks-list">
          {doneTasks.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              onRemove={() => handleRemoveTask(task.id)}
              onUpdate={(newText) => handleUpdateTask(task.id, newText)}
              onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
            />
          ))}
          {doneTasks.length === 0 && <li className="empty-message">No completed tasks.</li>}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;