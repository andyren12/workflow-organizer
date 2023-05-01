import { useState } from 'react'
import styles from './Tasks.module.scss'


function CalendarPopup({ task, onClose }) {
  return (
    <div className="calendar-popup">
      <h2>Add to Calendar: {task.text}</h2>
      {/* You can add your content here */}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activePopup, setActivePopup] = useState(null);

  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className={styles.main} style={{display: 'flex', flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.text}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => setActivePopup(task.id)}>Add to Calendar</button>
            {activePopup === task.id && (
              <CalendarPopup task={task} onClose={() => setActivePopup(null)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
