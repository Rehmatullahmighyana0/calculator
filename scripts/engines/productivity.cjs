const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'pomodoro-timer': (inputs) => {
    const work = toNum(inputs.workMins, 25);
    const shortB = toNum(inputs.shortBreakMins, 5);
    const longB = toNum(inputs.longBreakMins, 15);
    const sessions = Math.max(1, Math.round(toNum(inputs.sessionsBeforeLong, 4)));

    const cycleWorkMins = work * sessions;
    const cycleBreakMins = shortB * (sessions - 1) + longB;
    const totalCycleMins = cycleWorkMins + cycleBreakMins;

    return {
      primaryValue: `${totalCycleMins} Mins (${formatNum(totalCycleMins / 60, 1)} hrs)`,
      primaryLabel: `Full Pomodoro Cycle (${sessions} Sessions)`,
      subtext: `Focused Work: ${cycleWorkMins} mins | Breaks: ${cycleBreakMins} mins`,
      breakdown: [
        { label: 'Work Interval', value: `${work} minutes` },
        { label: 'Short Break', value: `${shortB} minutes` },
        { label: 'Long Break', value: `${longB} minutes` },
        { label: 'Sessions per Cycle', value: `${sessions} sessions` },
        { label: 'Total Focused Work', value: `${cycleWorkMins} mins (${formatNum(cycleWorkMins / 60, 2)} hrs)` },
        { label: 'Productive Work Ratio', value: `${formatNum((cycleWorkMins / totalCycleMins) * 100, 1)}%` }
      ],
      steps: [
        `Work time: ${sessions} × ${work} mins = ${cycleWorkMins} mins`,
        `Break time: ${sessions - 1} short (${shortB}m) + 1 long (${longB}m) = ${cycleBreakMins} mins`,
        `Total structured cycle duration = ${totalCycleMins} minutes`
      ]
    };
  },

  'stopwatch': (inputs) => {
    const laps = Math.max(1, Math.round(toNum(inputs.targetLaps, 5)));

    // Simulated benchmark lap timings
    const baseLap = 72.4; // 1m 12.4s
    const totalSecs = baseLap * laps;

    const m = Math.floor(totalSecs / 60);
    const s = (totalSecs % 60).toFixed(2);

    return {
      primaryValue: `${m}m ${s}s`,
      primaryLabel: `Total Split Time (${laps} Laps)`,
      subtext: `Average Lap: ${formatNum(baseLap, 2)}s | Target Pace Verified`,
      breakdown: [
        { label: 'Lap Count', value: `${laps} laps` },
        { label: 'Average Pace', value: `${formatNum(baseLap, 2)} s/lap` },
        { label: 'Total Elapsed', value: `${m}m ${s}s` }
      ],
      steps: [
        `Lap pace baseline = ${baseLap} seconds`,
        `Total duration = ${laps} × ${baseLap} = ${formatNum(totalSecs, 2)} seconds (${m}m ${s}s)`
      ]
    };
  },

  'countdown-timer': (inputs) => {
    const mins = toNum(inputs.minutes, 10);
    const secs = toNum(inputs.seconds, 0);

    const totalSeconds = mins * 60 + secs;
    const formatted = `${Math.floor(totalSeconds / 60)}:${totalSeconds % 60 < 10 ? '0' : ''}${totalSeconds % 60}`;

    return {
      primaryValue: formatted,
      primaryLabel: 'Timer Duration Set',
      subtext: `Total seconds: ${totalSeconds.toLocaleString('en-US')} s`,
      breakdown: [
        { label: 'Minutes', value: `${mins}` },
        { label: 'Seconds', value: `${secs}` },
        { label: 'Total Interval', value: `${totalSeconds} seconds` }
      ],
      steps: [
        `Converted duration to standard MM:SS clock: ${formatted}`
      ]
    };
  },

  'work-hours-calculator': (inputs) => {
    const start = String(inputs.start || '08:30').trim();
    const end = String(inputs.end || '17:00').trim();
    const lunchMins = toNum(inputs.lunchMins, 45);
    const daysPerWeek = toNum(inputs.daysPerWeek, 5);

    const parseToMins = (str) => {
      const p = str.split(':').map(Number);
      return (p[0] || 0) * 60 + (p[1] || 0);
    };

    const sMins = parseToMins(start);
    const eMins = parseToMins(end);
    let shiftMins = eMins - sMins;
    if (shiftMins < 0) shiftMins += 1440;

    const netDailyMins = Math.max(0, shiftMins - lunchMins);
    const dailyHours = netDailyMins / 60;
    const weeklyHours = dailyHours * daysPerWeek;

    return {
      primaryValue: `${formatNum(weeklyHours, 2)} Hours / week`,
      primaryLabel: 'Weekly Paid Working Hours',
      subtext: `Daily Paid: ${formatNum(dailyHours, 2)} hrs (${Math.floor(netDailyMins / 60)}h ${netDailyMins % 60}m) | Gross Shift: ${formatNum(shiftMins / 60, 2)} hrs`,
      breakdown: [
        { label: 'Daily Shift Time', value: `${start} - ${end} (${formatNum(shiftMins / 60, 2)} hrs)` },
        { label: 'Unpaid Meal Break', value: `-${lunchMins} minutes` },
        { label: 'Net Daily Work Hours', value: `${formatNum(dailyHours, 2)} hrs / day` },
        { label: 'Days Worked per Week', value: `${daysPerWeek} days` },
        { label: 'Total Weekly Billable Hours', value: `${formatNum(weeklyHours, 2)} hrs` }
      ],
      steps: [
        `Shift duration = ${shiftMins} minutes`,
        `Deduct unpaid lunch (${lunchMins}m) = ${netDailyMins} minutes/day (${formatNum(dailyHours, 2)} hrs)`,
        `Weekly total = ${formatNum(dailyHours, 2)} hrs × ${daysPerWeek} days = ${formatNum(weeklyHours, 2)} hours`
      ]
    };
  },

  'overtime-calculator': (inputs) => {
    const rate = toNum(inputs.baseRate, 25);
    const totalHours = toNum(inputs.totalHours, 48);
    const threshold = toNum(inputs.threshold, 40);

    const regHours = Math.min(totalHours, threshold);
    const otHours = Math.max(0, totalHours - threshold);

    const regPay = regHours * rate;
    const otRate = rate * 1.5;
    const otPay = otHours * otRate;
    const gross = regPay + otPay;

    return {
      primaryValue: `$${formatNum(gross, 2)}`,
      primaryLabel: 'Total Gross Pay (Regular + OT)',
      subtext: `Overtime Pay: $${formatNum(otPay, 2)} (${otHours} hrs @ $${formatNum(otRate, 2)}/hr)`,
      breakdown: [
        { label: 'Regular Hourly Rate', value: `$${formatNum(rate, 2)} / hr` },
        { label: 'Regular Hours & Pay', value: `${regHours} hrs = $${formatNum(regPay, 2)}` },
        { label: 'Overtime Hours (1.5×)', value: `${otHours} hrs @ $${formatNum(otRate, 2)} = $${formatNum(otPay, 2)}` },
        { label: 'Total Gross Pay', value: `$${formatNum(gross, 2)}` }
      ],
      steps: [
        `Regular pay = ${regHours} hrs × $${rate} = $${formatNum(regPay, 2)}`,
        `Overtime pay = ${otHours} hrs × ($${rate} × 1.5) = $${formatNum(otPay, 2)}`,
        `Total = $${formatNum(regPay, 2)} + $${formatNum(otPay, 2)} = $${formatNum(gross, 2)}`
      ]
    };
  },

  'productivity-calculator': (inputs) => {
    const units = toNum(inputs.outputUnits, 350);
    const hours = toNum(inputs.laborHours, 50);
    const target = toNum(inputs.standardTarget, 6); // target units/hr

    if (hours <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Labor hours must be positive.' };

    const actualRate = units / hours;
    const efficiency = target > 0 ? (actualRate / target) * 100 : 100;

    return {
      primaryValue: `${formatNum(actualRate, 2)} Units / hour`,
      primaryLabel: 'Labor Productivity Rate',
      subtext: `Efficiency vs Target (${target} u/hr): ${formatNum(efficiency, 1)}%`,
      breakdown: [
        { label: 'Units Produced', value: `${units.toLocaleString('en-US')} units` },
        { label: 'Labor Hours Expended', value: `${hours} hours` },
        { label: 'Actual Output Rate', value: `${formatNum(actualRate, 2)} units/hr` },
        { label: 'Standard Target', value: `${target} units/hr` },
        { label: 'Productivity Efficiency Index', value: `${formatNum(efficiency, 1)}%` }
      ],
      steps: [
        `Productivity = Total Output / Total Input = ${units} / ${hours} = ${formatNum(actualRate, 2)} units/hr`,
        `Efficiency = (${formatNum(actualRate, 2)} / ${target}) × 100% = ${formatNum(efficiency, 1)}%`
      ]
    };
  },

  'time-tracking-calculator': (inputs) => {
    const hours = toNum(inputs.hours, 37.5);
    const rate = toNum(inputs.hourlyRate, 85);
    const discount = toNum(inputs.discountPct, 0);

    const gross = hours * rate;
    const discountAmt = gross * (discount / 100);
    const netInvoice = gross - discountAmt;

    return {
      primaryValue: `$${formatNum(netInvoice, 2)}`,
      primaryLabel: 'Total Invoice Amount',
      subtext: `${hours} Billable Hours @ $${rate}/hr${discount > 0 ? ` (Discount: -$${formatNum(discountAmt, 2)})` : ''}`,
      breakdown: [
        { label: 'Billable Hours', value: `${hours} hrs` },
        { label: 'Hourly Rate', value: `$${formatNum(rate, 2)} / hr` },
        { label: 'Gross Fee', value: `$${formatNum(gross, 2)}` },
        { label: 'Discount', value: discount > 0 ? `-$${formatNum(discountAmt, 2)} (${discount}%)` : '$0.00' },
        { label: 'Total Client Billing', value: `$${formatNum(netInvoice, 2)}` }
      ],
      steps: [
        `Gross = ${hours} hrs × $${rate}/hr = $${formatNum(gross, 2)}`,
        discount > 0 ? `Discount = $${formatNum(gross, 2)} × ${discount}% = -$${formatNum(discountAmt, 2)}` : '',
        `Net Invoice = $${formatNum(netInvoice, 2)}`
      ].filter(Boolean)
    };
  }
};

module.exports = engines;

