import { useState, useEffect } from 'react'
import styles from './Timer.module.scss'

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [started, setStarted] = useState(false);
    const [status, setStatus] = useState("Start");
    const [hoverShort, setHoverShort] = useState(false);
    const [hoverLong, setHoverLong] = useState(false);
    const [short, setShort] = useState(false);
    const [long, setLong] = useState(false);

    const setTimer = () => {
        let time = document.getElementById("timer").value;
        if (time === 0) {
            setSeconds(0);
        }
        setSeconds(time % 100);
        setMinutes(Math.floor(time / 100 % 100))
        setHours(Math.floor(time / 10000))
        setStatus("Start");
    }

    const startTimer = () => {
        if (seconds > 0 || minutes > 0 || hours > 0) {
            setStarted(true);
        }
    }

    const stopTimer = () => {
        setStarted(false);
        setStatus("Resume");
    }

    const resetTimer = () => {
        setSeconds(0);
        setMinutes(0);
        setHours(0);
        setStarted(false);
        setStatus("Start");
    }

    const setZero = () => {
        document.getElementById("timer").value = "";
    }

    useEffect(() => {
        if (started) {
            const timer = setInterval(() => {
                setSeconds(seconds - 1);
                if (seconds === 0) {
                    if (minutes === 0) {
                        if (hours === 0) {
                            setStarted(false);
                            setStatus("Start");
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
    })

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

    const handleMouseOverShort = () => setHoverShort(true);
    const handleMouseOutShort = () => setHoverShort(false);
    const handleMouseOverLong = () => setHoverLong(true);
    const handleMouseOutLong = () => setHoverLong(false);

    const setShortTimer = () => {
        setShort(true);
        setHoverShort(false);
        setHours(0);
        setMinutes(25);
        setSeconds(0);
    }

    const setLongTimer = () => {
        setLong(true);
        setHoverLong(false);
        setHours(1);
        setMinutes(0);
        setSeconds(0);
    }

    const goBack = () => {
        setShort(false);
        setLong(false);
        resetTimer();
    }

  return (
    <div className={styles.main}>
        <div className={styles.container}>
            <div style={{fontSize: '1.4rem'}}>
                &nbsp;
                {(short || long) && (
                    <button id={styles.backBtn} onClick={goBack}>back</button>
                )}
            </div>
            <div className={styles.pomoBox}>
                {!long && (
                    <div className={styles.pomo}>
                    <div className={styles.pomoDesc}>
                        &nbsp;
                        {hoverShort && (
                            <span>25-5 min</span>
                        )}
                    </div>
                    <button
                        onMouseOver={handleMouseOverShort}
                        onMouseOut={handleMouseOutShort}
                        disabled={short}
                        onClick={setShortTimer}
                    >Short Pomodoro</button>
                </div>
                )}
                {!short && (
                    <div className={styles.pomo}>
                    <div className={styles.pomoDesc}>
                        &nbsp;
                        {hoverLong && (
                            <span>60-15 min</span>
                        )}
                    </div>
                    <button
                        onMouseOver={handleMouseOverLong}
                        onMouseOut={handleMouseOutLong}
                        disabled={long}
                        onClick={setLongTimer}
                    >Long Pomodoro</button>
                </div>
                )}
            </div>
            <div className={styles.inputBox}>
                <input id="timer" onClick={setZero} onInput={setTimer} maxLength="6" disabled={started || short || long} autoFocus />
            </div>
            <label htmlFor="timer" id={styles.timerLabel}>
                {hours < 10 && 0}{hours}:{minutes < 10 && 0}{minutes}:{seconds < 10 && 0}{seconds}
            </label>
            <div className={styles.buttons}>
            {(!started) 
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
    </div>
  )
}
