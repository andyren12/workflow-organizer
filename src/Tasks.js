import { useState, useEffect, useRef } from 'react'
import { GoogleLogin } from './GoogleLogin'
import CalendarPopup from './CalendarPopup'
import Popup from 'reactjs-popup'
import styles from './Tasks.module.scss'


export default function Tasks() {
  const { supabase, user } = GoogleLogin();
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const buttonRef = useRef(null);

  const addTask = async() => {
    if (inputValue.trim()) {
      const { data, error } = await supabase
      .from('todos')
      .insert({
        task: `${inputValue}`,
        email: `${user.email}`,
      })
      .select()

      if (error) {
        console.log(error);
      }

      if (data) {
        getTasks();
      }
    }
  };

  const getTasks = async() => {
    const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('email', user.email)

    if (data) {
      setTasks(data)
      setInputValue("")
    }

    if (error) {
      console.log(error)
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = async(id) => {
    const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

    if(error) {
      console.log(error);
    }

    getTasks();
  };

  useEffect(() => {
    if (user) {
      getTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
                <label htmlFor={`task-${task.id}`} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.task}</label>
              </div>
              <div className={styles.buttons}>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
                <Popup trigger={<button ref={buttonRef}>Add to Calendar</button>} position="bottom center" offsetX={-365} arrow={false}>
                  <CalendarPopup task={task} buttonRef={buttonRef} closeOnDocumentClick/>
                </Popup>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
