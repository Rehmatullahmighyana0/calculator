import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Bell, Coffee, Brain } from 'lucide-react';

interface InteractiveTimerProps {
  type: 'pomodoro' | 'stopwatch' | 'countdown';
}

export const InteractiveTimer: React.FC<InteractiveTimerProps> = ({ type }) => {
  // --- Stopwatch State ---
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // --- Pomodoro State ---
  const [pomoMode, setPomoMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  // --- Countdown State ---
  const [cdTime, setCdTime] = useState(10 * 60);
  const [cdInitial, setCdInitial] = useState(10 * 60);
  const [cdRunning, setCdRunning] = useState(false);

  // Sound beep via Web Audio API
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  };

  // --- Stopwatch Effect ---
  useEffect(() => {
    let interval: any = null;
    if (swRunning) {
      interval = setInterval(() => {
        setSwTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  // --- Pomodoro Effect ---
  useEffect(() => {
    let interval: any = null;
    if (pomoRunning) {
      interval = setInterval(() => {
        setPomoTime((prev) => {
          if (prev <= 1) {
            playBeep();
            if (pomoMode === 'work') {
              const nextCycles = cycles + 1;
              setCycles(nextCycles);
              if (nextCycles % 4 === 0) {
                setPomoMode('longBreak');
                return 15 * 60;
              } else {
                setPomoMode('shortBreak');
                return 5 * 60;
              }
            } else {
              setPomoMode('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomoRunning, pomoMode, cycles]);

  // --- Countdown Effect ---
  useEffect(() => {
    let interval: any = null;
    if (cdRunning) {
      interval = setInterval(() => {
        setCdTime((prev) => {
          if (prev <= 1) {
            playBeep();
            setCdRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [cdRunning]);

  // Format Stopwatch ms to MM:SS.ss
  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${centis < 10 ? '0' : ''}${centis}`;
  };

  // Format Seconds to MM:SS
  const formatSecs = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ----------------------------------------------------
  // Render Stopwatch
  // ----------------------------------------------------
  if (type === 'stopwatch') {
    return (
      <div className="timer-container">
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
          Precision Digital Stopwatch
        </div>
        <div className="timer-digits">{formatStopwatch(swTime)}</div>

        <div className="timer-controls">
          <button
            className={`btn ${swRunning ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setSwRunning(!swRunning)}
          >
            {swRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{swRunning ? 'Pause' : 'Start'}</span>
          </button>

          {swRunning && (
            <button
              className="btn btn-secondary"
              onClick={() => setLaps((prev) => [swTime, ...prev])}
            >
              <Flag size={18} /> Lap
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => {
              setSwRunning(false);
              setSwTime(0);
              setLaps([]);
            }}
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div style={{ marginTop: '2rem', maxHeight: '180px', overflowY: 'auto' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>Recorded Laps ({laps.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {laps.map((lapMs, idx) => (
                <div key={idx} className="result-row">
                  <span>Lap {laps.length - idx}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{formatStopwatch(lapMs)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // Render Pomodoro Timer
  // ----------------------------------------------------
  if (type === 'pomodoro') {
    return (
      <div className="timer-container">
        {/* Mode Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`pill-btn ${pomoMode === 'work' ? 'active' : ''}`}
            onClick={() => {
              setPomoRunning(false);
              setPomoMode('work');
              setPomoTime(25 * 60);
            }}
          >
            <Brain size={15} /> 25m Focus
          </button>
          <button
            className={`pill-btn ${pomoMode === 'shortBreak' ? 'active' : ''}`}
            onClick={() => {
              setPomoRunning(false);
              setPomoMode('shortBreak');
              setPomoTime(5 * 60);
            }}
          >
            <Coffee size={15} /> 5m Short Break
          </button>
          <button
            className={`pill-btn ${pomoMode === 'longBreak' ? 'active' : ''}`}
            onClick={() => {
              setPomoRunning(false);
              setPomoMode('longBreak');
              setPomoTime(15 * 60);
            }}
          >
            <Coffee size={15} /> 15m Long Break
          </button>
        </div>

        <div className="timer-digits">{formatSecs(pomoTime)}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Completed Cycles: <strong>{cycles}</strong> {cycles > 0 && `(${(cycles * 25) / 60} hrs of deep focus)`}
        </p>

        <div className="timer-controls">
          <button
            className={`btn ${pomoRunning ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setPomoRunning(!pomoRunning)}
          >
            {pomoRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{pomoRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setPomoRunning(false);
              setPomoTime(pomoMode === 'work' ? 25 * 60 : pomoMode === 'shortBreak' ? 5 * 60 : 15 * 60);
            }}
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Render Countdown Timer
  // ----------------------------------------------------
  return (
    <div className="timer-container">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        {[5, 10, 15, 30].map((mins) => (
          <button
            key={mins}
            className={`pill-btn ${cdInitial === mins * 60 ? 'active' : ''}`}
            onClick={() => {
              setCdRunning(false);
              setCdInitial(mins * 60);
              setCdTime(mins * 60);
            }}
          >
            {mins} mins
          </button>
        ))}
      </div>

      <div className="timer-digits">{formatSecs(cdTime)}</div>

      <div className="timer-controls">
        <button
          className={`btn ${cdRunning ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setCdRunning(!cdRunning)}
        >
          {cdRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{cdRunning ? 'Pause' : 'Start Countdown'}</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setCdRunning(false);
            setCdTime(cdInitial);
          }}
        >
          <RotateCcw size={18} /> Reset
        </button>
      </div>
    </div>
  );
};
