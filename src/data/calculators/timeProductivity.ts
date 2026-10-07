import { CalculatorDef } from '../../types/calculator';

export const timeProductivityCalculators: CalculatorDef[] = [
  {
    id: 'pomodoro-timer',
    slug: 'pomodoro-timer',
    title: 'Pomodoro Productivity Timer',
    category: 'time-productivity',
    shortDesc: 'Interactive 25-minute focus intervals with 5-minute short breaks and 15-minute long breaks.',
    icon: 'Timer',
    badge: 'popular',
    isInteractiveTimer: 'pomodoro',
    fields: [
      { id: 'workMins', label: 'Focus Work Duration (Minutes)', type: 'number', defaultValue: 25, min: 1, max: 90, step: 5 },
      { id: 'shortBreakMins', label: 'Short Break Duration (Minutes)', type: 'number', defaultValue: 5, min: 1, max: 30, step: 1 },
      { id: 'longBreakMins', label: 'Long Break Duration (Minutes)', type: 'number', defaultValue: 15, min: 5, max: 60, step: 5 },
      { id: 'sessionsBeforeLong', label: 'Sessions before Long Break', type: 'number', defaultValue: 4, min: 2, max: 10, step: 1 }
    ],
    calculate: (inputs) => {
      const work = parseFloat(inputs.workMins) || 25;
      const sBreak = parseFloat(inputs.shortBreakMins) || 5;
      const lBreak = parseFloat(inputs.longBreakMins) || 15;
      const sessions = parseInt(inputs.sessionsBeforeLong) || 4;

      const totalCycleMins = work * sessions + sBreak * (sessions - 1) + lBreak;
      const totalFocusHours = (work * sessions) / 60;

      return {
        primaryValue: `${Math.floor(totalCycleMins / 60)}h ${totalCycleMins % 60}m per Cycle`,
        primaryLabel: 'Full Pomodoro Block Duration',
        subtext: `Total Focus Work: ${totalFocusHours.toFixed(1)} hrs across ${sessions} sessions`,
        breakdown: [
          { label: 'Work Session Duration', value: `${work} minutes` },
          { label: 'Short Break Duration', value: `${sBreak} minutes` },
          { label: 'Long Break Duration', value: `${lBreak} minutes` },
          { label: 'Total Planned Cycle Time', value: `${totalCycleMins} minutes` },
          { label: 'Focus Ratio', value: `${(((work * sessions) / totalCycleMins) * 100).toFixed(1)}% work` }
        ],
        steps: [`Calculated ${sessions} focus blocks @ ${work}m each`, `Added breaks between sessions`]
      };
    },
    formula: 'Cycle = (Work × Sessions) + (Short Break × (Sessions - 1)) + Long Break',
    explanation: 'The Pomodoro Technique breaks work into intervals (traditionally 25 minutes in length), separated by short breaks to maintain peak mental focus.',
    howToUse: ['Use the interactive timer controls to start, pause, and cycle through Pomodoros.', 'Adjust interval lengths to match your personal energy levels.'],
    example: { inputs: { workMins: 25, shortBreakMins: 5, longBreakMins: 15, sessionsBeforeLong: 4 }, output: '2h 10m per Cycle', explanation: '4 work intervals of 25m + three 5m breaks + one 15m break = 130 minutes.' },
    faqs: [{ question: 'Who invented the Pomodoro Technique?', answer: 'Francesco Cirillo in the late 1980s, named after the tomato-shaped kitchen timer he used in college.' }],
    keywords: ['pomodoro timer', 'focus timer', 'productivity technique', 'study timer']
  },
  {
    id: 'stopwatch',
    slug: 'stopwatch',
    title: 'Precision Stopwatch & Lap Timer',
    category: 'time-productivity',
    shortDesc: 'Digital precision stopwatch with millisecond accuracy, lap splits, and reset controls.',
    icon: 'Watch',
    badge: 'popular',
    isInteractiveTimer: 'stopwatch',
    fields: [
      { id: 'targetLaps', label: 'Expected Total Laps', type: 'number', defaultValue: 5, min: 1, max: 100, step: 1 }
    ],
    calculate: (inputs) => {
      const laps = parseInt(inputs.targetLaps) || 5;
      return {
        primaryValue: 'Ready to Time',
        primaryLabel: 'Interactive Stopwatch',
        subtext: `Track up to ${laps} laps with millisecond precision`,
        breakdown: [
          { label: 'Precision', value: '1/100th second (10ms)' },
          { label: 'Lap Tracking', value: 'Supported' },
          { label: 'Target Laps', value: laps.toString() }
        ],
        steps: ['Press "Start" on the interactive timer below to begin elapsed tracking.']
      };
    },
    formula: 'Elapsed Time = Current Timestamp - Start Timestamp',
    explanation: 'Interactive digital stopwatch for athletic timing, workout intervals, and task benchmarking.',
    howToUse: ['Click Start to begin timing.', 'Click Lap to record split times.', 'Click Stop to pause and Reset to clear.'],
    example: { inputs: { targetLaps: 5 }, output: 'Interactive Stopwatch', explanation: 'Tracks accurate splits with millisecond counter.' },
    faqs: [{ question: 'Does the timer keep running if I switch tabs?', answer: 'Yes, it computes elapsed time based on system clock timestamps.' }],
    keywords: ['stopwatch', 'lap timer', 'digital stopwatch', 'athletic timer']
  },
  {
    id: 'countdown-timer',
    slug: 'countdown-timer',
    title: 'Interactive Countdown Timer',
    category: 'time-productivity',
    shortDesc: 'Customizable countdown timer with progress ring and audible completion alert.',
    icon: 'Hourglass',
    isInteractiveTimer: 'countdown',
    fields: [
      { id: 'minutes', label: 'Minutes', type: 'number', defaultValue: 10, min: 0, max: 180, step: 1 },
      { id: 'seconds', label: 'Seconds', type: 'number', defaultValue: 0, min: 0, max: 59, step: 5 }
    ],
    calculate: (inputs) => {
      const m = parseInt(inputs.minutes) || 0;
      const s = parseInt(inputs.seconds) || 0;
      const totalSec = m * 60 + s;

      return {
        primaryValue: `${m}m ${s}s (${totalSec} sec)`,
        primaryLabel: 'Timer Duration Set',
        subtext: 'Press Start on the interactive timer below to begin countdown',
        breakdown: [
          { label: 'Total Duration', value: `${totalSec} seconds` },
          { label: 'Minutes', value: `${m} mins` },
          { label: 'Seconds', value: `${s} secs` }
        ],
        steps: [`Configured countdown for ${totalSec} seconds`]
      };
    },
    formula: 'Remaining = Set Duration - Elapsed Seconds',
    explanation: 'Ticking countdown timer with pause, resume, and completion tone notification.',
    howToUse: ['Set desired minutes and seconds.', 'Click Start on the timer panel.'],
    example: { inputs: { minutes: 10, seconds: 0 }, output: '10m 0s', explanation: 'Starts a 10-minute countdown.' },
    faqs: [{ question: 'Can I set hours?', answer: 'Yes, you can input up to 180 minutes (3 hours).' }],
    keywords: ['countdown timer', 'timer online', 'minute timer', 'alarm timer']
  },
  {
    id: 'work-hours-calculator',
    slug: 'work-hours-calculator',
    title: 'Timesheet Work Hours Calculator',
    category: 'time-productivity',
    shortDesc: 'Compute total daily and weekly billable hours deducting lunch breaks.',
    icon: 'Calendar',
    fields: [
      { id: 'start', label: 'Start Time (e.g. 08:30)', type: 'text', defaultValue: '08:30', placeholder: '08:30' },
      { id: 'end', label: 'End Time (e.g. 17:00)', type: 'text', defaultValue: '17:00', placeholder: '17:00' },
      { id: 'lunchMins', label: 'Unpaid Lunch Break (Minutes)', type: 'number', defaultValue: 45, min: 0, max: 120, step: 15 },
      { id: 'daysPerWeek', label: 'Work Days per Week', type: 'number', defaultValue: 5, min: 1, max: 7, step: 1 }
    ],
    calculate: (inputs) => {
      const parseTime = (t: string) => {
        const parts = t.split(':').map((p) => parseInt(p.trim()) || 0);
        return parts[0] * 60 + (parts[1] || 0);
      };

      const startMins = parseTime(String(inputs.start || ''));
      const endMins = parseTime(String(inputs.end || ''));
      const lunch = parseFloat(inputs.lunchMins) || 0;
      const days = parseInt(inputs.daysPerWeek) || 5;

      let dailyMins = endMins - startMins - lunch;
      if (dailyMins < 0) dailyMins += 1440; // overnight handling

      const dailyHours = dailyMins / 60;
      const weeklyHours = dailyHours * days;

      return {
        primaryValue: `${dailyHours.toFixed(2)} Hours/day`,
        primaryLabel: 'Net Daily Work Hours',
        subtext: `Weekly Total: ${weeklyHours.toFixed(2)} hours across ${days} days`,
        breakdown: [
          { label: 'Gross Shift Time', value: `${((endMins - startMins) / 60).toFixed(2)} hrs` },
          { label: 'Unpaid Lunch Deduction', value: `-${lunch} minutes` },
          { label: 'Net Daily Work Hours', value: `${dailyHours.toFixed(2)} hrs` },
          { label: 'Weekly Total Hours', value: `${weeklyHours.toFixed(2)} hrs` }
        ],
        steps: [`Gross shift: ${inputs.start} to ${inputs.end} = ${(endMins - startMins) / 60} hrs`, `Subtract lunch: -${lunch}m = ${dailyHours.toFixed(2)} net hours/day`]
      };
    },
    formula: 'Daily Hours = (End Time - Start Time - Lunch Minutes) / 60',
    explanation: 'Accurately computes daily and weekly billable employee work timesheets.',
    howToUse: ['Enter shift start and end times in 24-hour format (e.g. 08:30 and 17:00).', 'Enter lunch duration.', 'Click Calculate.'],
    example: { inputs: { start: '08:30', end: '17:00', lunchMins: 45, daysPerWeek: 5 }, output: '7.75 Hours/day', explanation: '8.5 gross hours minus 45m lunch = 7.75 net hours daily (38.75 hrs/week).' },
    faqs: [{ question: 'Are breaks legally required?', answer: 'Many labor laws require a 30-minute meal break for shifts exceeding 5 or 6 hours.' }],
    keywords: ['work hours calculator', 'timesheet calculator', 'shift hours', 'punch card calculator']
  },
  {
    id: 'overtime-calculator',
    slug: 'overtime-calculator',
    title: 'Overtime Pay Calculator',
    category: 'time-productivity',
    shortDesc: 'Compute regular, 1.5x time-and-a-half, and double-time overtime earnings.',
    icon: 'DollarSign',
    badge: 'popular',
    fields: [
      { id: 'baseRate', label: 'Base Hourly Rate ($/hr)', type: 'number', defaultValue: 25, min: 5, step: 0.5 },
      { id: 'totalHours', label: 'Total Hours Worked this Week', type: 'number', defaultValue: 48, min: 0, step: 1 },
      { id: 'threshold', label: 'Overtime Threshold (Standard 40 hrs)', type: 'number', defaultValue: 40, min: 30, max: 50, step: 1 }
    ],
    calculate: (inputs) => {
      const rate = parseFloat(inputs.baseRate) || 0;
      const totalH = parseFloat(inputs.totalHours) || 0;
      const thresh = parseFloat(inputs.threshold) || 40;

      const regularH = Math.min(totalH, thresh);
      const overtimeH = Math.max(0, totalH - thresh);

      const regularPay = regularH * rate;
      const overtimePay = overtimeH * (rate * 1.5);
      const totalGross = regularPay + overtimePay;

      return {
        primaryValue: `$${totalGross.toFixed(2)}`,
        primaryLabel: 'Total Gross Weekly Pay',
        subtext: `Regular: $${regularPay.toFixed(2)} (${regularH}h) | Overtime: $${overtimePay.toFixed(2)} (${overtimeH}h @ 1.5x)`,
        breakdown: [
          { label: 'Base Hourly Rate', value: `$${rate.toFixed(2)}/hr` },
          { label: 'Overtime Rate (1.5x)', value: `$${(rate * 1.5).toFixed(2)}/hr` },
          { label: 'Regular Pay', value: `$${regularPay.toFixed(2)}` },
          { label: 'Overtime Pay', value: `$${overtimePay.toFixed(2)}` },
          { label: 'Blended Effective Rate', value: `$${(totalGross / totalH).toFixed(2)}/hr` }
        ],
        steps: [
          `Regular: ${regularH} hrs × $${rate} = $${regularPay.toFixed(2)}`,
          `Overtime: ${overtimeH} hrs × $${(rate * 1.5).toFixed(2)} = $${overtimePay.toFixed(2)}`,
          `Total = $${totalGross.toFixed(2)}`
        ]
      };
    },
    formula: 'Gross Pay = (Reg Hours × Rate) + (OT Hours × Rate × 1.5)',
    explanation: 'Calculates compensation for extra hours worked beyond statutory 40-hour weekly thresholds.',
    howToUse: ['Enter hourly rate.', 'Enter total hours worked in the week.', 'Click Calculate.'],
    example: { inputs: { baseRate: 25, totalHours: 48, threshold: 40 }, output: '$1,300.00', explanation: '40 hrs @ $25 ($1,000) + 8 hrs @ $37.50 ($300) = $1,300.' },
    faqs: [{ question: 'What is double time?', answer: 'Double time is 2.0x regular pay, typically paid for working on holidays or after 12 consecutive hours in a day.' }],
    keywords: ['overtime calculator', 'time and a half', 'overtime pay', 'weekly wage']
  },
  {
    id: 'productivity-calculator',
    slug: 'productivity-calculator',
    title: 'Productivity & Efficiency Ratio Calculator',
    category: 'time-productivity',
    shortDesc: 'Measure labor productivity (Units produced per labor hour) and team efficiency.',
    icon: 'TrendingUp',
    fields: [
      { id: 'outputUnits', label: 'Units or Output Produced', type: 'number', defaultValue: 350, min: 1, step: 10 },
      { id: 'laborHours', label: 'Total Labor Hours Input', type: 'number', defaultValue: 50, min: 1, step: 5 },
      { id: 'standardTarget', label: 'Standard Target (Units/Hour)', type: 'number', defaultValue: 6, min: 0.1, step: 0.5 }
    ],
    calculate: (inputs) => {
      const units = parseFloat(inputs.outputUnits) || 0;
      const hours = parseFloat(inputs.laborHours) || 1;
      const target = parseFloat(inputs.standardTarget) || 6;

      const actualRate = units / hours;
      const efficiencyPct = (actualRate / target) * 100;

      return {
        primaryValue: `${actualRate.toFixed(2)} Units / Hour`,
        primaryLabel: 'Labor Productivity Rate',
        subtext: `Efficiency: ${efficiencyPct.toFixed(1)}% of ${target} units/hr target`,
        breakdown: [
          { label: 'Total Output', value: `${units} units` },
          { label: 'Total Labor Hours', value: `${hours} hours` },
          { label: 'Actual Output per Hour', value: `${actualRate.toFixed(2)} units/hr` },
          { label: 'Standard Target Rate', value: `${target} units/hr` },
          { label: 'Productivity Efficiency', value: `${efficiencyPct.toFixed(1)}%` }
        ],
        steps: [`Productivity = Units / Hours = ${units} / ${hours} = ${actualRate.toFixed(2)} units/hr`, `Efficiency = (${actualRate.toFixed(2)} / ${target}) × 100% = ${efficiencyPct.toFixed(1)}%`]
      };
    },
    formula: 'Productivity = Total Output / Total Labor Hours  |  Efficiency = (Actual / Target) × 100%',
    explanation: 'Measures industrial, manufacturing, or service output relative to input labor hours.',
    howToUse: ['Enter total items completed.', 'Enter total hours worked.', 'Enter target rate.', 'Click Calculate.'],
    example: { inputs: { outputUnits: 350, laborHours: 50, standardTarget: 6 }, output: '7.00 Units / Hour', explanation: 'Producing 350 units in 50 hours is 7.0 units/hr (116.7% of target).' },
    faqs: [{ question: 'How to increase labor productivity?', answer: 'Automation of repetitive tasks, training, better software tooling, and eliminating process bottlenecks.' }],
    keywords: ['productivity calculator', 'labor efficiency', 'output per hour', 'operations KPI']
  },
  {
    id: 'time-tracking-calculator',
    slug: 'time-tracking-calculator',
    title: 'Freelance Billable Time Calculator',
    category: 'time-productivity',
    shortDesc: 'Compute total invoice amount from project task hours and client hourly billing rates.',
    icon: 'CreditCard',
    fields: [
      { id: 'hours', label: 'Billable Hours Logged', type: 'number', defaultValue: 37.5, min: 0.1, step: 0.5 },
      { id: 'hourlyRate', label: 'Billing Hourly Rate ($/hr)', type: 'number', defaultValue: 85, min: 5, step: 5 },
      { id: 'discountPct', label: 'Client Discount (%) (optional)', type: 'number', defaultValue: 0, min: 0, max: 50, step: 5 }
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.hours) || 0;
      const rate = parseFloat(inputs.hourlyRate) || 0;
      const disc = (parseFloat(inputs.discountPct) || 0) / 100;

      const subtotal = h * rate;
      const discountVal = subtotal * disc;
      const totalInvoice = subtotal - discountVal;

      return {
        primaryValue: `$${totalInvoice.toFixed(2)}`,
        primaryLabel: 'Total Invoice Amount',
        subtext: `${h} billable hours @ $${rate}/hr${disc > 0 ? ` (-$${discountVal.toFixed(2)} discount)` : ''}`,
        breakdown: [
          { label: 'Logged Hours', value: `${h} hrs` },
          { label: 'Hourly Rate', value: `$${rate.toFixed(2)}/hr` },
          { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
          { label: 'Discount', value: disc > 0 ? `-$${discountVal.toFixed(2)} (${inputs.discountPct}%)` : '$0.00' },
          { label: 'Total Due', value: `$${totalInvoice.toFixed(2)}` }
        ],
        steps: [`Multiply hours by rate: ${h} × $${rate} = $${subtotal.toFixed(2)}`, disc > 0 ? `Subtract ${inputs.discountPct}% discount = $${totalInvoice.toFixed(2)}` : '']
      };
    },
    formula: 'Invoice = (Hours × Hourly Rate) × (1 - Discount)',
    explanation: 'Computes billable invoice amounts for freelancers, consultants, and agencies.',
    howToUse: ['Enter billable hours.', 'Enter hourly rate.', 'Click Calculate.'],
    example: { inputs: { hours: 37.5, hourlyRate: 85, discountPct: 0 }, output: '$3,187.50', explanation: '37.5 hours @ $85/hr equals $3,187.50.' },
    faqs: [{ question: 'How do freelancers track billable hours?', answer: 'Using dedicated software timers or time trackers that record time per client project.' }],
    keywords: ['freelance calculator', 'billable hours', 'invoice calculator', 'hourly billing']
  }
];
