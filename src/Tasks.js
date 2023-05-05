import { useState, useEffect, useRef } from 'react'
import { GoogleLogin } from './GoogleLogin'
import Popup from 'reactjs-popup'
import Calendar from './Calendar'
import styles from './Tasks.module.scss'


function CalendarPopup({ task, onClose, buttonRef }) {
  const popupRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      if (buttonRef.current && popupRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();
        const topPosition = buttonRect.top - popupRect.height + 50;
        const leftPosition = buttonRect.left + (buttonRect.width / 2) - popupRect.width;
        
        popupRef.current.style.top = `${topPosition}px`;
        popupRef.current.style.left = `${leftPosition}px`;
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize)
  }, [buttonRef]);

  return (
    <div className={styles.calendarPopup} ref={popupRef}>
      <h2>Add to Calendar: {task.name}</h2>
      <Calendar />
    </div>
  );
}


export default function Tasks() {
  const { supabase } = GoogleLogin()
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const buttonRef = useRef(null);

  async function addTask() {
    if (inputValue.trim()) {
      const { error } = await supabase
      .from('todos')
      .insert({
        tasks: `${inputValue}`
      })

      if (error) {
        console.log(error);
      }
      setTasks([...tasks, { id: Date.now(), name: inputValue, completed: false }]);
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
      <div className={styles.container}>
        <h3>To-Do List</h3>
        <div>
        <form onSubmit={(e) => {
          e.preventDefault()
          addTask()
        }}>
          <input
            type="text"
            value={inputValue}
            maxLength="128"
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
                <label htmlFor={`task-${task.id}`} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</label>
              </div>
              <div className={styles.buttons}>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
                <Popup trigger={<button ref={buttonRef}>Add to Calendar</button>} position="bottom center" offsetX={-365} arrow={false}>
                  <CalendarPopup task={task} buttonRef={buttonRef} closeOnDocumentClick/>
                </Popup>
              </div>
              {/* <div style={{position: 'absolute'}}>
              {activePopup === task.id && (
                <CalendarPopup task={task} onClose={() => setActivePopup(null)} buttonRef={buttonRef}/>
              )}
              </div> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
