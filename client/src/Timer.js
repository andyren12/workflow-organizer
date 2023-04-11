import { useState, useEffect } from 'react'

export default function Timer() {
    const[seconds, setSeconds] = useState(0);
    const[minutes, setMinutes] = useState(0);
    const[started, setStarted] = useState(false);

    const startTimer = () => {
        const time = document.getElementById("startTimer").value;
        if (time >= 100) {
            setMinutes(time.slice(0,2));
        }
        setSeconds(time % 100);
        setStarted(true);
    }

    useEffect(() => {
        if (started) {
            const timer = setInterval(() => {
                setSeconds(seconds - 1);
                if (seconds === 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }, 1000)
            return () => clearInterval(timer);
        }
    })

  return (
    <div>
        <input type="number" id="startTimer" />
        {(minutes === 0 && seconds === 0) ? <button type="submit" 
            onClick={startTimer}
        >Start Timer</button>
        :
        <button type="submit" onClick={() => {
            setStarted(true);
        }}>Resume Timer</button>
        }
        <button type="submit" onClick={() => {
            setStarted(false);
        }}>Stop Timer</button>
        <button type="submit" onClick={() => {
            setSeconds(0);
            setMinutes(0);
            setStarted(false);
        }}>Reset Timer</button>
      {minutes} : {seconds} 
    </div>
  )
}
