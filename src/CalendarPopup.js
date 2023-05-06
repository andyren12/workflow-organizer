import { useEffect, useRef } from 'react'
import Calendar from './Calendar'
import styles from './CalendarPopup.module.scss'

export default function CalendarPopup({ task, buttonRef }) {
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
        <h2>Add to Calendar: {task.task}</h2>
        <Calendar task={task.task} />
      </div>
    );
  }