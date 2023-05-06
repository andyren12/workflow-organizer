import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { useState } from 'react';
import { GoogleLogin } from './GoogleLogin';
import styles from './Calendar.module.scss'

export default function Calendar(task) {
    const [start, setStart] = useState(new dayjs(Date()));
    const [end, setEnd] = useState(new dayjs(Date()));
    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")

    const { session } = GoogleLogin();
  
    async function createCalendarEvent() {
      const event = {
        'summary': eventName,
        'description': eventDescription,
        'start': {
          'dateTime': start.toISOString(),
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'end': {
          'dateTime': end.toISOString(),
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }
      await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token
        },
        body: JSON.stringify(event)
      })
    }

    return (
    <div className={styles.container}>
        <label>Start of event</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker onChange={setStart} value={start}/>
            </LocalizationProvider>
        <label>End of event</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker onChange={setEnd} value={end}/>
            </LocalizationProvider>
        <label>Event name</label>
        <input className={styles.eventInput} type="text" onChange={(e) => setEventName(e.target.value)} defaultValue={task.task} />
        <label>Event description</label>
        <input className={styles.eventInput} type="text" onChange={(e) => setEventDescription(e.target.value)} />
        <button className={styles.createButton} onClick={() => createCalendarEvent()}>Create Calendar Event</button>
    </div>
    );
}