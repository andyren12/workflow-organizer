import { useState, useEffect, useRef } from 'react'
import styles from './Tasks.module.scss'


function CalendarPopup({ task, onClose, buttonRef }) {
  const popupRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      if (buttonRef.current && popupRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();
        const topPosition = buttonRect.top - popupRect.height - 150;
        const leftPosition = buttonRect.left + (buttonRect.width) - (popupRect.width / 2) - 125;
        
        popupRef.current.style.top = `${topPosition}px`;
        popupRef.current.style.left = `${leftPosition}px`;
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize)
  }, [buttonRef]);

  return (
    <div className={styles.calendarPopup} ref={popupRef}>
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
  const buttonRef = useRef(null);

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
    <div className={styles.main}>
      <h3>To-Do List</h3>
      <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        addTask()
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a task"
        />
        <button type="submit">Add Task</button>
      </form>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div className={styles.task}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <label htmlFor={`task-${task.id}`} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</label>
            </div>
            <div className={styles.buttons}>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
              <button ref={buttonRef} onClick={() => setActivePopup(task.id)}>Add to Calendar</button>
            </div>
            <div style={{position: 'absolute'}}>
            {activePopup === task.id && (
              <CalendarPopup task={task} onClose={() => setActivePopup(null)} buttonRef={buttonRef}/>
            )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
