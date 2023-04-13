import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { GoogleLogin } from './GoogleLogin';

export default function Calendar() {
    const [start, setStart] = useState(new dayjs(Date()));
    const [end, setEnd] = useState(new dayjs(Date()));
    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")
    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [upcomingEventNames, setUpcomingEventNames] = useState([])

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

    async function getCalendarEvent() {
      await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?" + new URLSearchParams({
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 10,
        timeMin: '2023-04-10T23:59:59-08:00'
      }), {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token
        },
      }).then((res) => {
        return res.json()
      }).then((response) => {
        setUpcomingEvents(response.items)
        setUpcomingEventNames(response.items.map(({ summary }) => summary))
      })
    }

    useEffect(() => {
      console.log(upcomingEvents)
    }, [upcomingEvents])
  
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
        <button onClick={() => getCalendarEvent()}>Get Event</button>
        { upcomingEvents.length > 0 ? 
        <div>
        <div> Upcoming events: </div> 
        <div> {upcomingEventNames.join('\r')} </div>
        </div>:
        <div></div>}
    </div>
    );
}
