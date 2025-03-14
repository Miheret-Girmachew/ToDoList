import React from 'react';
import TodoList from './components/TodoList';
import './App.css'; 

const App: React.FC = () => {
  return (
    <div className="app-container">
      <TodoList />
    </div>
  );
};

export default App;