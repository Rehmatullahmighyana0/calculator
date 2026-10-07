const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'date-difference-calculator': (inputs) => {
    const sStr = String(inputs.startDate || '2026-01-01').trim();
    const eStr = String(inputs.endDate || '2026-12-31').trim();

    const d1 = new Date(sStr);
    const d2 = new Date(eStr);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter valid Start and End dates (YYYY-MM-DD).' };
    }

    const diffMs = Math.abs(d2 - d1);
    const totalDays = Math.round(diffMs / (24 * 3600 * 1000));
    const totalWeeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      primaryValue: `${totalDays} Days`,
      primaryLabel: 'Difference in Days',
      subtext: `${years > 0 ? years + ' yrs, ' : ''}${months} months, ${days} days (${totalWeeks} weeks + ${remDays} days)`,
      breakdown: [
        { label: 'Start Date', value: sStr },
        { label: 'End Date', value: eStr },
        { label: 'Total Calendar Days', value: `${totalDays.toLocaleString('en-US')} days` },
        { label: 'Weeks & Days', value: `${totalWeeks} weeks, ${remDays} days` },
        { label: 'Calendar Breakdown', value: `${years} years, ${months} months, ${days} days` },
        { label: 'Total Hours', value: `${(totalDays * 24).toLocaleString('en-US')} hours` }
      ],
      steps: [
        `Calculated millisecond delta between ${sStr} and ${eStr}`,
        `Total days = ${totalDays}`,
        `Expressed as: ${years} years, ${months} months, and ${days} days`
      ]
    };
  },

  'time-duration-calculator': (inputs) => {
    const start = String(inputs.startTime || '09:15:00').trim();
    const end = String(inputs.endTime || '17:45:30').trim();

    const parseTime = (t) => {
      const parts = t.split(':').map(Number);
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      const s = parts[2] || 0;
      return h * 3600 + m * 60 + s;
    };

    const sSec = parseTime(start);
    const eSec = parseTime(end);

    let diff = eSec - sSec;
    if (diff < 0) diff += 24 * 3600; // crosses midnight

    const hours = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    const decimalHours = diff / 3600;

    return {
      primaryValue: `${hours}h ${mins}m ${secs}s`,
      primaryLabel: 'Elapsed Duration',
      subtext: `Decimal Hours: ${formatNum(decimalHours, 2)} hrs | Total Minutes: ${Math.floor(diff / 60)} mins`,
      breakdown: [
        { label: 'Start Time', value: start },
        { label: 'End Time', value: end },
        { label: 'Hours, Mins, Secs', value: `${hours} hours, ${mins} minutes, ${secs} seconds` },
        { label: 'Decimal Hours', value: `${formatNum(decimalHours, 3)} hrs` },
        { label: 'Total Seconds', value: `${diff.toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Start in seconds: ${sSec} sec`,
        `End in seconds: ${eSec} sec`,
        `Duration: ${diff} seconds = ${hours} hours, ${mins} minutes, and ${secs} seconds`
      ]
    };
  },

  'date-add-calculator': (inputs) => {
    const baseStr = String(inputs.date || '2026-06-15').trim();
    const days = toNum(inputs.days, 45);
    const months = toNum(inputs.months, 0);
    const years = toNum(inputs.years, 0);

    const d = new Date(baseStr);
    if (isNaN(d.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid start date format.' };

    d.setFullYear(d.getFullYear() + years);
    d.setMonth(d.getMonth() + months);
    d.setDate(d.getDate() + days);

    const formatted = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return {
      primaryValue: formatted,
      primaryLabel: 'Calculated Future Date',
      subtext: `ISO: ${d.toISOString().split('T')[0]}`,
      breakdown: [
        { label: 'Base Date', value: baseStr },
        { label: 'Added Duration', value: `${years} yrs, ${months} mos, ${days} days` },
        { label: 'Resulting Date', value: formatted }
      ],
      steps: [
        `Added ${years} years, ${months} months, and ${days} days to ${baseStr}`,
        `Calculated target date: ${formatted}`
      ]
    };
  },

  'date-subtract-calculator': (inputs) => {
    const baseStr = String(inputs.date || '2026-10-15').trim();
    const days = toNum(inputs.days, 30);

    const d = new Date(baseStr);
    if (isNaN(d.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid date format.' };

    d.setDate(d.getDate() - days);
    const formatted = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return {
      primaryValue: formatted,
      primaryLabel: 'Calculated Past Date',
      subtext: `Subtracted ${days} days from ${baseStr}`,
      breakdown: [
        { label: 'Starting Date', value: baseStr },
        { label: 'Days Subtracted', value: `${days} days` },
        { label: 'Resulting Date', value: formatted }
      ],
      steps: [
        `Subtracted ${days} calendar days from ${baseStr}`,
        `Result date: ${formatted}`
      ]
    };
  },

  'business-days-calculator': (inputs) => {
    const sStr = String(inputs.start || '2026-10-01').trim();
    const eStr = String(inputs.end || '2026-10-31').trim();

    const d1 = new Date(sStr);
    const d2 = new Date(eStr);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid dates.' };

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(start);

    while (cur <= end) {
      const dayOfWeek = cur.getDay(); // 0 is Sun, 6 is Sat
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    const totalCalendarDays = businessDays + weekendDays;

    return {
      primaryValue: `${businessDays} Working Days`,
      primaryLabel: 'Business Days (Mon - Fri)',
      subtext: `Total Calendar Days: ${totalCalendarDays} | Weekend Days: ${weekendDays}`,
      breakdown: [
        { label: 'Start Date', value: sStr },
        { label: 'End Date', value: eStr },
        { label: 'Business Days (Workdays)', value: `${businessDays} days` },
        { label: 'Weekend Days (Sat/Sun)', value: `${weekendDays} days` },
        { label: 'Total Calendar Days', value: `${totalCalendarDays} days` }
      ],
      steps: [
        `Iterated each date from ${sStr} to ${eStr}`,
        `Filtered out Saturday and Sunday weekend dates`,
        `Identified ${businessDays} business days`
      ]
    };
  },

  'countdown-calculator': (inputs) => {
    const targetStr = String(inputs.targetDate || '2027-01-01').trim();
    const target = new Date(targetStr);
    const now = new Date();

    if (isNaN(target.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid target date.' };

    const diffMs = target - now;
    if (diffMs <= 0) {
      return { primaryValue: 'Target Reached', primaryLabel: 'Completed', subtext: 'The target date has already passed.' };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      primaryValue: `${days}d ${hours}h ${mins}m ${secs}s`,
      primaryLabel: `Time Remaining Until Target`,
      subtext: `Target: ${targetStr} (Total: ${days} days / ${Math.floor(totalSeconds / 3600)} hours)`,
      breakdown: [
        { label: 'Target Date', value: targetStr },
        { label: 'Days Remaining', value: `${days} days` },
        { label: 'Hours Remaining', value: `${hours} hours` },
        { label: 'Minutes Remaining', value: `${mins} mins` },
        { label: 'Total Seconds', value: `${totalSeconds.toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Target: ${target.toISOString()}`,
        `Current time: ${now.toISOString()}`,
        `Remaining countdown = ${days} days, ${hours} hours, ${mins} minutes, ${secs} seconds`
      ]
    };
  },

  'time-zone-converter': (inputs) => {
    const time = String(inputs.time || '15:00').trim();
    const fromOffset = toNum(inputs.fromZone === 'UTC' ? 0 : inputs.fromZone, 0);
    const toOffset = toNum(inputs.toZone === 'UTC' ? 0 : inputs.toZone, 5.5);

    const parts = time.split(':').map(Number);
    const h = parts[0] || 0;
    const m = parts[1] || 0;

    // Convert fromZone to UTC
    let totalMinutes = h * 60 + m - fromOffset * 60;
    // Convert UTC to toZone
    totalMinutes += toOffset * 60;

    // Wrap in 24h
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const outH = Math.floor(totalMinutes / 60);
    const outM = Math.floor(totalMinutes % 60);

    const formattedTime = `${outH < 10 ? '0' : ''}${outH}:${outM < 10 ? '0' : ''}${outM}`;

    return {
      primaryValue: formattedTime,
      primaryLabel: `Converted Time (UTC${toOffset >= 0 ? '+' : ''}${toOffset})`,
      subtext: `Original: ${time} (UTC${fromOffset >= 0 ? '+' : ''}${fromOffset})`,
      breakdown: [
        { label: 'Input Time', value: `${time} (UTC${fromOffset >= 0 ? '+' : ''}${fromOffset})` },
        { label: 'Time Offset Difference', value: `${toOffset - fromOffset >= 0 ? '+' : ''}${toOffset - fromOffset} hours` },
        { label: 'Converted Output Time', value: `${formattedTime} (UTC${toOffset >= 0 ? '+' : ''}${toOffset})` }
      ],
      steps: [
        `Converted ${time} to UTC base: ${time} - (${fromOffset}h)`,
        `Applied destination offset (+${toOffset}h)`,
        `Result time = ${formattedTime}`
      ]
    };
  },

  'unix-timestamp-converter': (inputs) => {
    let ts = toNum(inputs.timestamp, 1773489000);
    // If milliseconds entered, normalize
    if (ts > 1e11) ts = Math.floor(ts / 1000);

    const date = new Date(ts * 1000);
    if (isNaN(date.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid Unix timestamp.' };

    const utcStr = date.toUTCString();
    const localStr = date.toLocaleString();
    const isoStr = date.toISOString();

    return {
      primaryValue: utcStr,
      primaryLabel: 'UTC Date & Time',
      subtext: `ISO 8601: ${isoStr} | Local: ${localStr}`,
      breakdown: [
        { label: 'Unix Timestamp (seconds)', value: `${ts}` },
        { label: 'Timestamp (milliseconds)', value: `${ts * 1000}` },
        { label: 'UTC String', value: utcStr },
        { label: 'ISO 8601', value: isoStr },
        { label: 'Local System Time', value: localStr }
      ],
      steps: [
        `Seconds since Unix Epoch (Jan 1, 1970 00:00:00 UTC): ${ts}`,
        `Calculated Date: ${utcStr}`
      ]
    };
  },

  'hours-calculator': (inputs) => {
    const h1 = toNum(inputs.h1, 8.5);
    const h2 = toNum(inputs.h2, 8);
    const h3 = toNum(inputs.h3, 7.5);
    const h4 = toNum(inputs.h4, 8);
    const h5 = toNum(inputs.h5, 8);

    const totalHours = h1 + h2 + h3 + h4 + h5;
    const wholeHours = Math.floor(totalHours);
    const mins = Math.round((totalHours - wholeHours) * 60);

    return {
      primaryValue: `${formatNum(totalHours, 2)} Hours`,
      primaryLabel: 'Total Weekly Work Hours',
      subtext: `${wholeHours} hours and ${mins} minutes (Average: ${formatNum(totalHours / 5, 2)} hrs/day)`,
      breakdown: [
        { label: 'Day 1 (Mon)', value: `${h1} hrs` },
        { label: 'Day 2 (Tue)', value: `${h2} hrs` },
        { label: 'Day 3 (Wed)', value: `${h3} hrs` },
        { label: 'Day 4 (Thu)', value: `${h4} hrs` },
        { label: 'Day 5 (Fri)', value: `${h5} hrs` },
        { label: 'Total Hours', value: `${formatNum(totalHours, 2)} hrs` },
        { label: 'Daily Average', value: `${formatNum(totalHours / 5, 2)} hrs` }
      ],
      steps: [
        `Summed work hours: ${h1} + ${h2} + ${h3} + ${h4} + ${h5} = ${formatNum(totalHours, 2)} hours`,
        `Formatted as ${wholeHours} hours and ${mins} minutes`
      ]
    };
  },

  'minutes-calculator': (inputs) => {
    const m = toNum(inputs.minutes, 450);
    const h = Math.floor(m / 60);
    const remM = Math.round(m % 60);
    const decimalHours = m / 60;
    const secs = m * 60;

    return {
      primaryValue: `${h}h ${remM}m`,
      primaryLabel: 'Hours & Minutes',
      subtext: `Decimal Hours: ${formatNum(decimalHours, 2)} hrs | Seconds: ${secs.toLocaleString('en-US')} s`,
      breakdown: [
        { label: 'Total Minutes', value: `${m} min` },
        { label: 'Formatted Hours & Mins', value: `${h} hours, ${remM} minutes` },
        { label: 'Decimal Hours', value: `${formatNum(decimalHours, 4)} hrs` },
        { label: 'Total Seconds', value: `${secs.toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Hours = floor(${m} / 60) = ${h} hours`,
        `Remaining minutes = ${m} % 60 = ${remM} minutes`,
        `Decimal hours = ${m} / 60 = ${formatNum(decimalHours, 4)} hrs`
      ]
    };
  },

  'seconds-calculator': (inputs) => {
    const s = toNum(inputs.seconds, 86400);

    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const remS = s % 60;

    return {
      primaryValue: `${days > 0 ? days + 'd ' : ''}${hours}h ${mins}m ${remS}s`,
      primaryLabel: 'Time Duration Breakdown',
      subtext: `Total Minutes: ${formatNum(s / 60, 2)} min | Total Hours: ${formatNum(s / 3600, 2)} hrs`,
      breakdown: [
        { label: 'Input Seconds', value: `${s.toLocaleString('en-US')} s` },
        { label: 'Days', value: `${days}` },
        { label: 'Hours', value: `${hours}` },
        { label: 'Minutes', value: `${mins}` },
        { label: 'Remaining Seconds', value: `${remS}` }
      ],
      steps: [
        `Days = floor(${s} / 86400) = ${days}`,
        `Hours = floor((${s} % 86400) / 3600) = ${hours}`,
        `Minutes = floor((${s} % 3600) / 60) = ${mins}`,
        `Seconds = ${remS}`
      ]
    };
  }
};

module.exports = engines;

