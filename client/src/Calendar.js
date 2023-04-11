import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { useState } from 'react';
import { GoogleLogin } from './GoogleLogin'

export default function Calendar() {
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
    <div>
        <p>Start of event</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker onChange={setStart} value={start}/>
            </LocalizationProvider>
        <p>End of event</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker onChange={setEnd} value={end}/>
            </LocalizationProvider>
        <p>Event name</p>
        <input type="text" onChange={(e) => setEventName(e.target.value)} />
        <p>Event description</p>
        <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
        <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
    </div>
    );
}
