import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface ScientificKeypadProps {
  isScientific?: boolean;
  onExpressionCalculated?: (expression: string, result: string) => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  isScientific = false,
  onExpressionCalculated
}) => {
  const [expression, setExpression] = useState('0');
  const [historyLine, setHistoryLine] = useState('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [memory, setMemory] = useState<number>(0);

  const append = (val: string) => {
    setExpression((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
  };

  const clearAll = () => {
    setExpression('0');
    setHistoryLine('');
  };

  const backspace = () => {
    setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const evaluate = () => {
    try {
      let code = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e\b/gi, 'Math.E')
        .replace(/sqrt\(/gi, 'Math.sqrt(')
        .replace(/log\(/gi, 'Math.log10(')
        .replace(/ln\(/gi, 'Math.log(')
        .replace(/\^/g, '**');

      if (angleMode === 'deg') {
        code = code
          .replace(/sin\(([^)]+)\)/gi, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/cos\(([^)]+)\)/gi, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/tan\(([^)]+)\)/gi, 'Math.tan(($1) * Math.PI / 180)');
      } else {
        code = code
          .replace(/sin\(/gi, 'Math.sin(')
          .replace(/cos\(/gi, 'Math.cos(')
          .replace(/tan\(/gi, 'Math.tan(');
      }

      // eslint-disable-next-line no-new-func
      const fn = new Function(`'use strict'; return (${code});`);
      const res = fn();
      if (typeof res !== 'number' || isNaN(res) || !isFinite(res)) {
        setExpression('Error');
        return;
      }

      const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString();
      setHistoryLine(`${expression} =`);
      setExpression(formatted);

      if (onExpressionCalculated) {
        onExpressionCalculated(expression, formatted);
      }
    } catch (e) {
      setExpression('Error');
    }
  };

  // Memory functions
  const handleMemory = (action: 'MC' | 'MR' | 'M+' | 'M-') => {
    const curr = parseFloat(expression) || 0;
    if (action === 'MC') setMemory(0);
    else if (action === 'MR') setExpression(memory.toString());
    else if (action === 'M+') setMemory((m) => m + curr);
    else if (action === 'M-') setMemory((m) => m - curr);
  };

  return (
    <div className="keypad-container" style={{ margin: '1.5rem auto' }}>
      {/* Keypad Display */}
      <div className="keypad-screen">
        <div className="keypad-history-line">{historyLine}</div>
        <div className="keypad-display-val">{expression}</div>
      </div>

      {/* Mode & Memory row */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
        {isScientific && (
          <button
            className="keypad-btn"
            style={{ fontSize: '0.8rem', padding: '0 0.75rem', height: '36px' }}
            onClick={() => setAngleMode((m) => (m === 'deg' ? 'rad' : 'deg'))}
          >
            {angleMode.toUpperCase()}
          </button>
        )}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="keypad-btn" style={{ fontSize: '0.75rem', padding: '0 0.5rem', height: '36px' }} onClick={() => handleMemory('MC')}>MC</button>
          <button className="keypad-btn" style={{ fontSize: '0.75rem', padding: '0 0.5rem', height: '36px' }} onClick={() => handleMemory('MR')}>MR</button>
          <button className="keypad-btn" style={{ fontSize: '0.75rem', padding: '0 0.5rem', height: '36px' }} onClick={() => handleMemory('M+')}>M+</button>
          <button className="keypad-btn" style={{ fontSize: '0.75rem', padding: '0 0.5rem', height: '36px' }} onClick={() => handleMemory('M-')}>M-</button>
        </div>
      </div>

      {/* Scientific Keys (if applicable) */}
      {isScientific && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
          <button className="keypad-btn" onClick={() => append('sin(')}>sin</button>
          <button className="keypad-btn" onClick={() => append('cos(')}>cos</button>
          <button className="keypad-btn" onClick={() => append('tan(')}>tan</button>
          <button className="keypad-btn" onClick={() => append('sqrt(')}>√</button>
          <button className="keypad-btn" onClick={() => append('^')}>xʸ</button>

          <button className="keypad-btn" onClick={() => append('log(')}>log</button>
          <button className="keypad-btn" onClick={() => append('ln(')}>ln</button>
          <button className="keypad-btn" onClick={() => append('(')}>(</button>
          <button className="keypad-btn" onClick={() => append(')')}>)</button>
          <button className="keypad-btn" onClick={() => append('pi')}>π</button>
        </div>
      )}

      {/* Main Arithmetic Keypad Grid */}
      <div className="keypad-grid">
        <button className="keypad-btn action" onClick={clearAll}>C</button>
        <button className="keypad-btn action" onClick={backspace}><Delete size={18} /></button>
        <button className="keypad-btn operator" onClick={() => append('%')}>%</button>
        <button className="keypad-btn operator" onClick={() => append('÷')}>÷</button>

        <button className="keypad-btn" onClick={() => append('7')}>7</button>
        <button className="keypad-btn" onClick={() => append('8')}>8</button>
        <button className="keypad-btn" onClick={() => append('9')}>9</button>
        <button className="keypad-btn operator" onClick={() => append('×')}>×</button>

        <button className="keypad-btn" onClick={() => append('4')}>4</button>
        <button className="keypad-btn" onClick={() => append('5')}>5</button>
        <button className="keypad-btn" onClick={() => append('6')}>6</button>
        <button className="keypad-btn operator" onClick={() => append('-')}>-</button>

        <button className="keypad-btn" onClick={() => append('1')}>1</button>
        <button className="keypad-btn" onClick={() => append('2')}>2</button>
        <button className="keypad-btn" onClick={() => append('3')}>3</button>
        <button className="keypad-btn operator" onClick={() => append('+')}>+</button>

        <button className="keypad-btn" onClick={() => append('0')}>0</button>
        <button className="keypad-btn" onClick={() => append('.')}>.</button>
        <button className="keypad-btn" onClick={() => append('00')}>00</button>
        <button className="keypad-btn equals" onClick={evaluate}>=</button>
      </div>
    </div>
  );
};
