import { useState, useEffect } from 'react'
import styles from './Timer.module.scss'

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState("Start");
    const [pomodoroState, setPomodoroState] = useState(null);

    const setTimer = () => {
        let time = document.getElementById("timer").value;
        setSeconds(time % 100);
        setMinutes(Math.floor(time / 100 % 100))
        setHours(Math.floor(time / 10000))
        setStatus("Start");
    }
    const startTimer = () => {
        if (seconds > 0 || minutes > 0 || hours > 0) {
            setIsRunning(true);
        }
    }

    const stopTimer = () => {
        setIsRunning(false);
        setStatus("Resume");
    }

    const resetTimer = () => {
        if(pomodoroState === 'short') {
            setMinutes(25);
        } else if (pomodoroState === 'long') {
            setHours(1);
        } else {
            setMinutes(0);
            setHours(0);
        }
        setSeconds(0);
        setIsRunning(false);
        setStatus("Start");
        setPomodoroState(null);
    }

    const setZero = () => {
        document.getElementById("timer").value = "";
    }

    useEffect(() => {
        if (isRunning) {
            const timer = setInterval(() => {
                setSeconds(seconds - 1);
                if (seconds === 0) {
                    if (minutes === 0) {
                        if (hours === 0) {
                            setIsRunning(false);
                            setStatus("Start");
                            setSeconds(0);
                            if (pomodoroState === 'short') {
                                setPomodoroState('shortBreak');
                                setMinutes(5);
                                alert("Start 5 min break now")
                              } else if (pomodoroState === 'shortBreak') {
                                setPomodoroState(null);
                                alert("Break over")
                              } else if (pomodoroState === 'long') {
                                setPomodoroState('longBreak');
                                setMinutes(15);
                                alert("Start 15 min break now")
                              } else if (pomodoroState === 'longBreak') {
                                setPomodoroState(null);
                                alert("Break over")
                              } else {
                                alert("Timer over");
                              }
                        } else {
                            setHours(hours - 1);
                            setMinutes(59);
                            setSeconds(59);
                        }
                    }
                    else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000)
            return () => clearInterval(timer);
        }
    }, [seconds, minutes, hours, pomodoroState, isRunning])

    const setShortTimer = () => {
        setPomodoroState('short');
        setStatus("Start");
        setHours(0);
        setMinutes(25);
        setSeconds(0);
    }

    const setLongTimer = () => {
        setPomodoroState('long');
        setStatus("Start");
        setHours(1);
        setMinutes(0);
        setSeconds(0);
    }

    const goBack = () => {
        setPomodoroState(null);
        setStatus("Start");
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    }

    function setInputFilter(textbox, inputFilter, errMsg) {
        [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
          if (textbox) textbox.addEventListener(event, function(e) {
            if (inputFilter(this.value)) {
              // Accepted value.
              if ([ "keydown", "mousedown", "focusout" ].indexOf(e.type) >= 0) {
                this.classList.remove("input-error");
                this.setCustomValidity("");
              }
              
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
            }
            else if (this.hasOwnProperty("oldValue")) {
              // Rejected value: restore the previous one.
              this.classList.add("input-error");
              this.setCustomValidity(errMsg);
              this.reportValidity();
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
            else {
              // Rejected value: nothing to restore.
              this.value = "";
            }
          });
        });
    }

    setInputFilter(document.getElementById("timer"), function(value) {
        return /^\d*$/.test(value);
    }, "Must be an unsigned integer");

  return (
    <div className={styles.main}>
        <div style={{fontSize: '1.4rem'}}>
            &nbsp;
            {pomodoroState !== null && (
                <button id={styles.backBtn} onClick={goBack}>back</button>
            )}
        </div>
        <div className={styles.pomoBox}>
            {pomodoroState !== 'long' && pomodoroState !== 'longBreak' && (
                <div className={styles.pomo}>
                <button
                    disabled={pomodoroState === 'short'}
                    onClick={setShortTimer}
                >Short Pomodoro</button>
            </div>
            )}
            {pomodoroState !== 'short' && pomodoroState !== 'shortBreak' && (
                <div className={styles.pomo}>
                <button
                    disabled={pomodoroState === 'long'}
                    onClick={setLongTimer}
                >Long Pomodoro</button>
            </div>
            )}
        </div>
        <div className={styles.inputBox}>
            <input id="timer" onClick={setZero} onInput={setTimer} maxLength="6" disabled={isRunning || pomodoroState !== null} autoComplete="off" autoFocus />
        </div>
        <label htmlFor="timer" id={styles.timerLabel}>
            {hours < 10 && 0}{hours}:{minutes < 10 && 0}{minutes}:{seconds < 10 && 0}{seconds}
        </label>
        <div className={styles.buttons}>
        {!isRunning
        ? 
        <button type="submit" onClick={startTimer}>
            {status} Timer
        </button>
        :
        <button type="submit" onClick={stopTimer}>Stop Timer</button>
        }
        <button type="submit" onClick={resetTimer}>Reset Timer</button>
        </div>
    </div>
  )
}
