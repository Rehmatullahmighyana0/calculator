import { CalculatorDef } from '../../types/calculator';

export const dateTimeCalculators: CalculatorDef[] = [
  {
    id: 'date-difference-calculator',
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator',
    category: 'date-time',
    shortDesc: 'Calculate exact calendar days, weeks, months, and years between two dates.',
    icon: 'CalendarDays',
    badge: 'popular',
    fields: [
      { id: 'startDate', label: 'Start Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-01-01', placeholder: 'YYYY-MM-DD' },
      { id: 'endDate', label: 'End Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-12-31', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const d1 = new Date(String(inputs.startDate || '').trim());
      const d2 = new Date(String(inputs.endDate || '').trim());

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Please enter dates formatted as YYYY-MM-DD.' };
      }

      const diffMs = Math.abs(d2.getTime() - d1.getTime());
      const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;

      // Calendar difference
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
        primaryLabel: 'Total Elapsed Days',
        subtext: `${years} Years, ${months} Months, ${days} Days (${totalWeeks} weeks + ${remainingDays} days)`,
        breakdown: [
          { label: 'Calendar Difference', value: `${years} yrs, ${months} mos, ${days} days` },
          { label: 'Total Days', value: `${totalDays.toLocaleString()} days` },
          { label: 'Total Weeks', value: `${(totalDays / 7).toFixed(1)} weeks` },
          { label: 'Total Hours', value: `${(totalDays * 24).toLocaleString()} hours` }
        ],
        steps: [`Calculated time delta: |End Date - Start Date| = ${totalDays} total days`, `Broken down into calendar components: ${years}y ${months}m ${days}d`]
      };
    },
    formula: 'Days = |Date₂ - Date₁| / (1000 × 60 × 60 × 24)',
    explanation: 'Finds the exact temporal distance between two calendar dates.',
    howToUse: ['Enter start date.', 'Enter end date.', 'Click Calculate.'],
    example: { inputs: { startDate: '2026-01-01', endDate: '2026-12-31' }, output: '364 Days', explanation: '364 days (52 weeks) between Jan 1 and Dec 31.' },
    faqs: [{ question: 'Does this count the end date?', answer: 'It calculates elapsed calendar duration between the two dates.' }],
    keywords: ['date difference', 'days between dates', 'calendar days', 'date duration']
  },
  {
    id: 'days-between-dates',
    slug: 'days-between-dates',
    title: 'Days Between Dates Calculator',
    category: 'date-time',
    shortDesc: 'Count total calendar days, weekdays, and weekend days between any two dates.',
    icon: 'CalendarRange',
    fields: [
      { id: 'start', label: 'From Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-09-01', placeholder: 'YYYY-MM-DD' },
      { id: 'end', label: 'To Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-09-30', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const d1 = new Date(String(inputs.start || '').trim());
      const d2 = new Date(String(inputs.end || '').trim());

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid dates provided.' };
      }

      const start = d1 <= d2 ? new Date(d1) : new Date(d2);
      const end = d1 <= d2 ? new Date(d2) : new Date(d1);

      let weekdays = 0;
      let weekends = 0;
      const cur = new Date(start);

      while (cur <= end) {
        const day = cur.getDay();
        if (day === 0 || day === 6) weekends++;
        else weekdays++;
        cur.setDate(cur.getDate() + 1);
      }

      const total = weekdays + weekends;

      return {
        primaryValue: `${total} Days (Inclusive)`,
        primaryLabel: 'Total Days Count',
        subtext: `Weekdays (Mon-Fri): ${weekdays} | Weekends (Sat-Sun): ${weekends}`,
        breakdown: [
          { label: 'Total Days (Inclusive)', value: total.toString() },
          { label: 'Business Days (Mon-Fri)', value: weekdays.toString() },
          { label: 'Weekend Days (Sat-Sun)', value: weekends.toString() },
          { label: 'Full Weeks', value: Math.floor(total / 7).toString() }
        ],
        steps: [`Iterated daily from ${inputs.start} to ${inputs.end}`, `Counted ${weekdays} working days and ${weekends} weekend days`]
      };
    },
    formula: 'Total = Business Days + Weekend Days (inclusive counting)',
    explanation: 'Counts days between two dates with a weekday versus weekend breakdown.',
    howToUse: ['Enter start and end dates.', 'Click Calculate.'],
    example: { inputs: { start: '2026-09-01', end: '2026-09-30' }, output: '30 Days (Inclusive)', explanation: '30 days in September: 22 weekdays and 8 weekend days.' },
    faqs: [{ question: 'Are public holidays subtracted?', answer: 'This calculator counts all Monday-Friday days as business days; see Business Days Calculator for holiday rules.' }],
    keywords: ['days between dates', 'working days', 'weekdays count', 'calendar days']
  },
  {
    id: 'time-duration-calculator',
    slug: 'time-duration-calculator',
    title: 'Time Duration Calculator',
    category: 'date-time',
    shortDesc: 'Compute difference between start time and end time in hours, minutes, and seconds.',
    icon: 'Hourglass',
    fields: [
      { id: 'startTime', label: 'Start Time (HH:MM:SS)', type: 'text', defaultValue: '09:15:00', placeholder: '09:15:00' },
      { id: 'endTime', label: 'End Time (HH:MM:SS)', type: 'text', defaultValue: '17:45:30', placeholder: '17:45:30' }
    ],
    calculate: (inputs) => {
      const parseTime = (str: string) => {
        const parts = str.split(':').map((p) => parseInt(p.trim()) || 0);
        return parts[0] * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
      };

      const s1 = parseTime(String(inputs.startTime || ''));
      const s2 = parseTime(String(inputs.endTime || ''));

      let diffSec = s2 - s1;
      if (diffSec < 0) diffSec += 24 * 3600; // Next day wrap

      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;
      const decHours = (diffSec / 3600).toFixed(2);

      return {
        primaryValue: `${h}h ${m}m ${s}s`,
        primaryLabel: 'Time Elapsed Duration',
        subtext: `Decimal Hours: ${decHours} hrs (${(diffSec / 60).toFixed(0)} minutes)`,
        breakdown: [
          { label: 'Hours, Minutes, Seconds', value: `${h} hours, ${m} minutes, ${s} seconds` },
          { label: 'Total Decimal Hours', value: `${decHours} hours` },
          { label: 'Total Minutes', value: `${Math.floor(diffSec / 60)} minutes` },
          { label: 'Total Seconds', value: `${diffSec} seconds` }
        ],
        steps: [`Converted start and end times to cumulative seconds`, `Computed elapsed duration = ${h}h ${m}m ${s}s`]
      };
    },
    formula: 'Duration = End Time (seconds) - Start Time (seconds)',
    explanation: 'Measures elapsed time between two timestamps with automatic overnight 24-hour rollover handling.',
    howToUse: ['Enter start time in HH:MM:SS.', 'Enter end time in HH:MM:SS.', 'Click Calculate.'],
    example: { inputs: { startTime: '09:15:00', endTime: '17:45:30' }, output: '8h 30m 30s', explanation: '8 hours, 30 minutes, and 30 seconds elapsed (8.51 decimal hours).' },
    faqs: [{ question: 'Does it support overnight shifts (e.g. 10 PM to 6 AM)?', answer: 'Yes, if end time is earlier than start time, it automatically assumes an overnight transition.' }],
    keywords: ['time duration calculator', 'hours between times', 'timesheet hours', 'elapsed time']
  },
  {
    id: 'date-add-calculator',
    slug: 'date-add-calculator',
    title: 'Date Add Calculator',
    category: 'date-time',
    shortDesc: 'Add days, weeks, months, or years to a starting date to find the future date.',
    icon: 'CalendarPlus',
    fields: [
      { id: 'date', label: 'Starting Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-06-15', placeholder: 'YYYY-MM-DD' },
      { id: 'days', label: 'Days to Add', type: 'number', defaultValue: 45, step: 1 },
      { id: 'months', label: 'Months to Add', type: 'number', defaultValue: 0, step: 1 },
      { id: 'years', label: 'Years to Add', type: 'number', defaultValue: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const d = new Date(String(inputs.date || '').trim());
      if (isNaN(d.getTime())) return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Format: YYYY-MM-DD' };

      const addDays = parseInt(inputs.days) || 0;
      const addMonths = parseInt(inputs.months) || 0;
      const addYears = parseInt(inputs.years) || 0;

      const result = new Date(d);
      result.setFullYear(result.getFullYear() + addYears);
      result.setMonth(result.getMonth() + addMonths);
      result.setDate(result.getDate() + addDays);

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = daysOfWeek[result.getDay()];
      const isoDate = result.toISOString().split('T')[0];

      return {
        primaryValue: `${isoDate} (${dayName})`,
        primaryLabel: 'Calculated Future Date',
        subtext: `Added ${addDays} days, ${addMonths} months, ${addYears} years`,
        breakdown: [
          { label: 'Starting Date', value: inputs.date },
          { label: 'Resulting Date', value: isoDate },
          { label: 'Day of Week', value: dayName }
        ],
        steps: [`Added requested increments to timestamp`, `Result date is ${dayName}, ${isoDate}`]
      };
    },
    formula: 'Result Date = Start Date + Years + Months + Days',
    explanation: 'Projects a future calendar date by adding duration increments.',
    howToUse: ['Enter start date.', 'Enter days, months, and years to add.', 'Click Calculate.'],
    example: { inputs: { date: '2026-06-15', days: 45, months: 0, years: 0 }, output: '2026-07-30 (Thursday)', explanation: '45 days after June 15 is July 30.' },
    faqs: [{ question: 'What happens at month boundaries?', answer: 'JavaScript date arithmetic advances naturally to subsequent calendar months.' }],
    keywords: ['date add calculator', 'add days to date', 'future date calculator', 'calendar math']
  },
  {
    id: 'date-subtract-calculator',
    slug: 'date-subtract-calculator',
    title: 'Date Subtract Calculator',
    category: 'date-time',
    shortDesc: 'Subtract days, weeks, or months from a date to find past dates.',
    icon: 'CalendarMinus',
    fields: [
      { id: 'date', label: 'Starting Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-10-15', placeholder: 'YYYY-MM-DD' },
      { id: 'days', label: 'Days to Subtract', type: 'number', defaultValue: 30, step: 1 }
    ],
    calculate: (inputs) => {
      const d = new Date(String(inputs.date || '').trim());
      if (isNaN(d.getTime())) return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Format: YYYY-MM-DD' };

      const subDays = parseInt(inputs.days) || 0;
      const result = new Date(d);
      result.setDate(result.getDate() - subDays);

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = daysOfWeek[result.getDay()];
      const isoDate = result.toISOString().split('T')[0];

      return {
        primaryValue: `${isoDate} (${dayName})`,
        primaryLabel: 'Calculated Past Date',
        subtext: `Subtracted ${subDays} days from ${inputs.date}`,
        breakdown: [
          { label: 'Starting Date', value: inputs.date },
          { label: 'Past Date', value: isoDate },
          { label: 'Day of Week', value: dayName }
        ],
        steps: [`Subtracted ${subDays} days from ${inputs.date} = ${isoDate}`]
      };
    },
    formula: 'Result Date = Start Date - Days',
    explanation: 'Finds historical dates by subtracting days or intervals.',
    howToUse: ['Enter starting date.', 'Enter days to subtract.', 'Click Calculate.'],
    example: { inputs: { date: '2026-10-15', days: 30 }, output: '2026-09-15 (Tuesday)', explanation: '30 days before Oct 15 is Sept 15.' },
    faqs: [{ question: 'Can I subtract negative days?', answer: 'Yes, subtracting a negative number acts as adding days into the future.' }],
    keywords: ['date subtract calculator', 'subtract days', 'past date calculator']
  },
  {
    id: 'business-days-calculator',
    slug: 'business-days-calculator',
    title: 'Business Days Calculator',
    category: 'date-time',
    shortDesc: 'Calculate working days between two dates, excluding weekends.',
    icon: 'Briefcase',
    fields: [
      { id: 'start', label: 'Start Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-10-01', placeholder: 'YYYY-MM-DD' },
      { id: 'end', label: 'End Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-10-31', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const d1 = new Date(String(inputs.start || '').trim());
      const d2 = new Date(String(inputs.end || '').trim());

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid dates.' };
      }

      const start = d1 <= d2 ? new Date(d1) : new Date(d2);
      const end = d1 <= d2 ? new Date(d2) : new Date(d1);

      let businessDays = 0;
      let weekends = 0;
      const cur = new Date(start);

      while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) businessDays++;
        else weekends++;
        cur.setDate(cur.getDate() + 1);
      }

      return {
        primaryValue: `${businessDays} Business Days`,
        primaryLabel: 'Working Days (Mon - Fri)',
        subtext: `Weekend Days: ${weekends} (Total: ${businessDays + weekends} days)`,
        breakdown: [
          { label: 'Business Working Days', value: businessDays.toString() },
          { label: 'Weekend Days Excluded', value: weekends.toString() },
          { label: 'Work Hours (@ 8 hrs/day)', value: `${businessDays * 8} hours` }
        ],
        steps: [`Filtered out Saturdays and Sundays`, `Computed ${businessDays} active working business days`]
      };
    },
    formula: 'Business Days = Total Days - Saturdays - Sundays',
    explanation: 'Essential for project management, SLA delivery estimations, and timesheet logging.',
    howToUse: ['Enter start and end dates.', 'Click Calculate.'],
    example: { inputs: { start: '2026-10-01', end: '2026-10-31' }, output: '22 Business Days', explanation: '22 working business days in October 2026.' },
    faqs: [{ question: 'How many business days in a typical month?', answer: 'Most months contain between 20 and 22 business days.' }],
    keywords: ['business days calculator', 'working days', 'sla calculator', 'work days']
  },
  {
    id: 'countdown-calculator',
    slug: 'countdown-calculator',
    title: 'Countdown Calculator',
    category: 'date-time',
    shortDesc: 'Calculate remaining days, hours, minutes, and seconds until any event or date.',
    icon: 'AlarmClock',
    badge: 'popular',
    fields: [
      { id: 'targetDate', label: 'Target Date (YYYY-MM-DD)', type: 'text', defaultValue: '2027-01-01', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const target = new Date(String(inputs.targetDate || '').trim());
      if (isNaN(target.getTime())) return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Format: YYYY-MM-DD' };

      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        return { primaryValue: 'Event Passed!', primaryLabel: 'Countdown', subtext: 'Target date has already arrived.' };
      }

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / (24 * 3600));
      const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      return {
        primaryValue: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        primaryLabel: 'Time Remaining',
        subtext: `Target: ${inputs.targetDate}`,
        breakdown: [
          { label: 'Remaining Days', value: `${days} days` },
          { label: 'Remaining Hours', value: `${days * 24 + hours} hours` },
          { label: 'Remaining Minutes', value: `${Math.floor(totalSec / 60).toLocaleString()} minutes` },
          { label: 'Remaining Seconds', value: `${totalSec.toLocaleString()} seconds` }
        ],
        steps: [`Calculated time delta from now to target date = ${days}d ${hours}h ${minutes}m`]
      };
    },
    formula: 'Time Remaining = Target Date - Current Timestamp',
    explanation: 'Computes remaining time until upcoming events, New Year, product launches, or holidays.',
    howToUse: ['Enter your target date.', 'Click Calculate.'],
    example: { inputs: { targetDate: '2027-01-01' }, output: 'Days, hours, and seconds countdown', explanation: 'Counts down to New Year 2027.' },
    faqs: [{ question: 'Does countdown account for leap years?', answer: 'Yes, timestamp calculations handle all calendar leap years.' }],
    keywords: ['countdown calculator', 'days until', 'event timer', 'how many days until']
  },
  {
    id: 'time-zone-converter',
    slug: 'time-zone-converter',
    title: 'Time Zone Converter',
    category: 'date-time',
    shortDesc: 'Convert local time across UTC, EST, PST, GMT, CET, IST, JST, and AEST.',
    icon: 'Globe',
    fields: [
      { id: 'time', label: 'Time (HH:MM)', type: 'text', defaultValue: '15:00', placeholder: '15:00' },
      {
        id: 'fromZone',
        label: 'From Timezone',
        type: 'select',
        defaultValue: 'UTC',
        options: [
          { label: 'UTC / GMT (UTC+0)', value: '0' },
          { label: 'EST - New York (UTC-5)', value: '-5' },
          { label: 'CST - Chicago (UTC-6)', value: '-6' },
          { label: 'PST - Los Angeles (UTC-8)', value: '-8' },
          { label: 'CET - Paris/Berlin (UTC+1)', value: '1' },
          { label: 'IST - India (UTC+5.5)', value: '5.5' },
          { label: 'JST - Tokyo (UTC+9)', value: '9' },
          { label: 'AEST - Sydney (UTC+10)', value: '10' }
        ]
      },
      {
        id: 'toZone',
        label: 'To Timezone',
        type: 'select',
        defaultValue: '5.5',
        options: [
          { label: 'UTC / GMT (UTC+0)', value: '0' },
          { label: 'EST - New York (UTC-5)', value: '-5' },
          { label: 'CST - Chicago (UTC-6)', value: '-6' },
          { label: 'PST - Los Angeles (UTC-8)', value: '-8' },
          { label: 'CET - Paris/Berlin (UTC+1)', value: '1' },
          { label: 'IST - India (UTC+5.5)', value: '5.5' },
          { label: 'JST - Tokyo (UTC+9)', value: '9' },
          { label: 'AEST - Sydney (UTC+10)', value: '10' }
        ]
      }
    ],
    calculate: (inputs) => {
      const parts = String(inputs.time || '12:00').split(':');
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;

      const fromOffset = parseFloat(inputs.fromZone) || 0;
      const toOffset = parseFloat(inputs.toZone) || 0;

      const totalMins = h * 60 + m - fromOffset * 60 + toOffset * 60;
      const normMins = ((totalMins % 1440) + 1440) % 1440;

      const resH = Math.floor(normMins / 60);
      const resM = Math.floor(normMins % 60);

      const formatted = `${resH < 10 ? '0' : ''}${resH}:${resM < 10 ? '0' : ''}${resM}`;
      const ampm = resH >= 12 ? 'PM' : 'AM';
      const h12 = resH % 12 || 12;

      return {
        primaryValue: `${formatted} (${h12}:${resM < 10 ? '0' : ''}${resM} ${ampm})`,
        primaryLabel: 'Converted Local Time',
        subtext: `Time difference: ${(toOffset - fromOffset).toFixed(1)} hours`,
        breakdown: [
          { label: 'Source Time', value: `${inputs.time}` },
          { label: 'Target Time', value: `${formatted} (${ampm})` },
          { label: 'Offset Difference', value: `${(toOffset - fromOffset) >= 0 ? '+' : ''}${(toOffset - fromOffset).toFixed(1)} hrs` }
        ],
        steps: [`Converted to UTC reference baseline`, `Applied destination offset: ${toOffset} hours`]
      };
    },
    formula: 'Time_target = Time_source - Offset_from + Offset_to',
    explanation: 'Converts hour and minute timestamps between international standard time zones.',
    howToUse: ['Enter time.', 'Select source and target timezones.', 'Click Calculate.'],
    example: { inputs: { time: '15:00', fromZone: '0', toZone: '5.5' }, output: '20:30 (8:30 PM)', explanation: '3:00 PM UTC corresponds to 8:30 PM in India (IST).' },
    faqs: [{ question: 'What is UTC?', answer: 'Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time.' }],
    keywords: ['time zone converter', 'utc to est', 'pst to gmt', 'international meeting planner']
  },
  {
    id: 'unix-timestamp-converter',
    slug: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    category: 'date-time',
    shortDesc: 'Convert Unix epoch timestamps to human-readable date & time and vice versa.',
    icon: 'Cpu',
    fields: [
      { id: 'timestamp', label: 'Unix Timestamp (seconds)', type: 'number', defaultValue: 1773489000, step: 1 }
    ],
    calculate: (inputs) => {
      let ts = parseFloat(inputs.timestamp) || 0;
      // If milliseconds entered (e.g. > 1e11), normalize
      if (ts > 1e11) ts = Math.floor(ts / 1000);

      const d = new Date(ts * 1000);
      if (isNaN(d.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid timestamp.' };

      const utcStr = d.toUTCString();
      const isoStr = d.toISOString();
      const localStr = d.toLocaleString();

      return {
        primaryValue: utcStr,
        primaryLabel: 'UTC Date & Time',
        subtext: `Local Time: ${localStr}`,
        breakdown: [
          { label: 'Unix Epoch Seconds', value: ts.toString() },
          { label: 'Unix Milliseconds', value: (ts * 1000).toString() },
          { label: 'ISO 8601 String', value: isoStr },
          { label: 'RFC 2822 (UTC)', value: utcStr }
        ],
        steps: [`Multiplied seconds by 1000 to get milliseconds from Jan 1, 1970`, `Formatted date: ${utcStr}`]
      };
    },
    formula: 'Date = Unix Epoch (seconds since Jan 01, 1970 00:00:00 UTC)',
    explanation: 'Unix timestamp tracks time as a running count of seconds elapsed since January 1, 1970 UTC.',
    howToUse: ['Enter a Unix epoch timestamp in seconds.', 'Click Calculate to view UTC and local date.'],
    example: { inputs: { timestamp: 1773489000 }, output: 'Formatted UTC date string', explanation: 'Converts seconds into calendar date.' },
    faqs: [{ question: 'What is the Year 2038 problem?', answer: 'On Jan 19, 2038, 32-bit signed integers will overflow; modern 64-bit systems resolve this.' }],
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'epoch time']
  },
  {
    id: 'hours-calculator',
    slug: 'hours-calculator',
    title: 'Hours Calculator',
    category: 'date-time',
    shortDesc: 'Sum daily shifts and decimal hours for timesheet payroll processing.',
    icon: 'Clock',
    fields: [
      { id: 'h1', label: 'Day 1 Hours', type: 'number', defaultValue: 8.5, min: 0, max: 24, step: 0.25 },
      { id: 'h2', label: 'Day 2 Hours', type: 'number', defaultValue: 8.0, min: 0, max: 24, step: 0.25 },
      { id: 'h3', label: 'Day 3 Hours', type: 'number', defaultValue: 7.5, min: 0, max: 24, step: 0.25 },
      { id: 'h4', label: 'Day 4 Hours', type: 'number', defaultValue: 8.0, min: 0, max: 24, step: 0.25 },
      { id: 'h5', label: 'Day 5 Hours', type: 'number', defaultValue: 8.0, min: 0, max: 24, step: 0.25 }
    ],
    calculate: (inputs) => {
      const h1 = parseFloat(inputs.h1) || 0;
      const h2 = parseFloat(inputs.h2) || 0;
      const h3 = parseFloat(inputs.h3) || 0;
      const h4 = parseFloat(inputs.h4) || 0;
      const h5 = parseFloat(inputs.h5) || 0;

      const totalHours = h1 + h2 + h3 + h4 + h5;
      const fullH = Math.floor(totalHours);
      const mins = Math.round((totalHours - fullH) * 60);

      return {
        primaryValue: `${totalHours.toFixed(2)} Total Hours`,
        primaryLabel: 'Weekly Work Hours',
        subtext: `Equivalent to ${fullH} hours and ${mins} minutes`,
        breakdown: [
          { label: 'Decimal Total Hours', value: `${totalHours.toFixed(2)} hrs` },
          { label: 'Hours & Minutes', value: `${fullH}h ${mins}m` },
          { label: 'Average per Day (5 days)', value: `${(totalHours / 5).toFixed(2)} hrs/day` },
          { label: 'Overtime (>40 hrs)', value: totalHours > 40 ? `${(totalHours - 40).toFixed(2)} hrs` : '0 hrs' }
        ],
        steps: [`Summed individual shift entries: ${h1} + ${h2} + ${h3} + ${h4} + ${h5} = ${totalHours.toFixed(2)} hours`]
      };
    },
    formula: 'Total Hours = Sum(Shift Hours)',
    explanation: 'Quickly adds up work hours across multiple days with overtime threshold detection.',
    howToUse: ['Enter daily shift hours.', 'Click Calculate.'],
    example: { inputs: { h1: 8.5, h2: 8, h3: 7.5, h4: 8, h5: 8 }, output: '40.00 Total Hours', explanation: 'Total 40 hours worked in standard workweek.' },
    faqs: [{ question: 'How to convert 15 minutes to decimal hours?', answer: '15 min = 0.25 hours, 30 min = 0.5 hours, 45 min = 0.75 hours.' }],
    keywords: ['hours calculator', 'timesheet hours', 'work hours total', 'payroll hours']
  },
  {
    id: 'minutes-calculator',
    slug: 'minutes-calculator',
    title: 'Minutes Calculator',
    category: 'date-time',
    shortDesc: 'Convert minutes to hours, days, seconds, and fractional formats.',
    icon: 'Watch',
    fields: [
      { id: 'minutes', label: 'Minutes', type: 'number', defaultValue: 450, min: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.minutes) || 0;
      const hours = m / 60;
      const days = m / 1440;
      const seconds = m * 60;

      const wholeH = Math.floor(hours);
      const remM = Math.round(m % 60);

      return {
        primaryValue: `${wholeH}h ${remM}m`,
        primaryLabel: 'Hours & Minutes',
        subtext: `Decimal Hours: ${hours.toFixed(2)} | Days: ${days.toFixed(3)}`,
        breakdown: [
          { label: 'Minutes Input', value: `${m} mins` },
          { label: 'Hours & Minutes', value: `${wholeH} hours, ${remM} minutes` },
          { label: 'Decimal Hours', value: `${hours.toFixed(4)} hours` },
          { label: 'Seconds', value: `${seconds.toLocaleString()} seconds` }
        ],
        steps: [`Divide by 60: ${m} / 60 = ${wholeH} hours with ${remM} minutes`]
      };
    },
    formula: 'Hours = Minutes / 60  |  Seconds = Minutes × 60',
    explanation: 'Converts total minutes into broken-down time units.',
    howToUse: ['Enter number of minutes.', 'Click Calculate.'],
    example: { inputs: { minutes: 450 }, output: '7h 30m', explanation: '450 minutes is exactly 7.5 hours.' },
    faqs: [{ question: 'How many minutes in a day?', answer: 'There are 1,440 minutes in a 24-hour day.' }],
    keywords: ['minutes calculator', 'minutes to hours', 'time conversion']
  },
  {
    id: 'seconds-calculator',
    slug: 'seconds-calculator',
    title: 'Seconds Calculator',
    category: 'date-time',
    shortDesc: 'Convert seconds into HH:MM:SS format, minutes, and days.',
    icon: 'TimerReset',
    fields: [
      { id: 'seconds', label: 'Seconds', type: 'number', defaultValue: 86400, min: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const s = parseInt(inputs.seconds) || 0;

      const days = Math.floor(s / 86400);
      const remAfterDays = s % 86400;
      const hours = Math.floor(remAfterDays / 3600);
      const remAfterHours = remAfterDays % 3600;
      const mins = Math.floor(remAfterHours / 60);
      const secs = remAfterHours % 60;

      const hhmmss = `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

      return {
        primaryValue: days > 0 ? `${days}d ${hhmmss}` : hhmmss,
        primaryLabel: 'Formatted Time (Days + HH:MM:SS)',
        subtext: `Total: ${(s / 60).toFixed(1)} minutes | ${(s / 3600).toFixed(2)} hours`,
        breakdown: [
          { label: 'Formatted Duration', value: days > 0 ? `${days} days, ${hhmmss}` : hhmmss },
          { label: 'Total Minutes', value: `${(s / 60).toFixed(2)} mins` },
          { label: 'Total Hours', value: `${(s / 3600).toFixed(4)} hrs` },
          { label: 'Total Days', value: `${(s / 86400).toFixed(4)} days` }
        ],
        steps: [`Decomposed ${s} seconds into days, hours, minutes, and seconds`]
      };
    },
    formula: 'Time = floor(s/3600) : floor((s%3600)/60) : s%60',
    explanation: 'Converts raw seconds into standard human-readable digital clock duration format.',
    howToUse: ['Enter number of seconds.', 'Click Calculate.'],
    example: { inputs: { seconds: 86400 }, output: '1d 00:00:00', explanation: '86,400 seconds is exactly 1 full 24-hour day.' },
    faqs: [{ question: 'How many seconds in an hour?', answer: '60 minutes × 60 seconds = 3,600 seconds.' }],
    keywords: ['seconds calculator', 'seconds to hours', 'hhmmss converter']
  }
];
