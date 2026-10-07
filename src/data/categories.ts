import { Category } from '../types/calculator';
import { CALCULATORS_BY_CATEGORY } from './calculators';

export const RAW_CATEGORIES: Omit<Category, 'count'>[] = [
  {
    id: 'basic-everyday',
    slug: 'basic-everyday',
    name: 'Basic & Everyday',
    description: 'Essential calculators for everyday math, percentages, fractions, ratios, and sequences.',
    icon: 'Calculator',
    badge: 'Popular'
  },
  {
    id: 'math',
    slug: 'math',
    name: 'Math',
    description: 'Advanced solvers for algebra, quadratic equations, roots, logarithms, matrices, and combinatorics.',
    icon: 'Sigma',
    badge: 'Advanced'
  },
  {
    id: 'geometry',
    slug: 'geometry',
    name: 'Geometry',
    description: '2D & 3D area, perimeter, surface area, and volume calculators for circles, triangles, spheres, and more.',
    icon: 'Shapes'
  },
  {
    id: 'finance',
    slug: 'finance',
    name: 'Finance',
    description: 'Smart financial tools for loans, EMI, mortgages, investments, retirement, and taxes.',
    icon: 'CircleDollarSign',
    badge: 'Essential'
  },
  {
    id: 'health-fitness',
    slug: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Science-backed calculators for BMI, BMR, TDEE, calories, ideal weight, body fat, macros, and pace.',
    icon: 'HeartPulse'
  },
  {
    id: 'date-time',
    slug: 'date-time',
    name: 'Date & Time',
    description: 'Precise date difference, chronological age, duration, time zone conversions, and Unix timestamps.',
    icon: 'Clock'
  },
  {
    id: 'unit-converters',
    slug: 'unit-converters',
    name: 'Unit Converters',
    description: 'Instant conversion between metric and imperial units for length, weight, temp, energy, and data.',
    icon: 'ArrowLeftRight',
    badge: 'Everyday'
  },
  {
    id: 'construction',
    slug: 'construction',
    name: 'Construction',
    description: 'Estimators for concrete, bricks, tiles, paint, flooring, gravel, mulch, and framing materials.',
    icon: 'Hammer'
  },
  {
    id: 'electrical',
    slug: 'electrical',
    name: 'Electrical',
    description: "Ohm's law, voltage, current, power, resistor color codes, electrical costs, and circuit resistance.",
    icon: 'Zap'
  },
  {
    id: 'physics',
    slug: 'physics',
    name: 'Physics',
    description: 'Calculators for force, kinetic & potential energy, velocity, work, power, momentum, and pressure.',
    icon: 'Atom'
  },
  {
    id: 'chemistry',
    slug: 'chemistry',
    name: 'Chemistry',
    description: 'Molarity, molality, molar mass, solution dilution, pH, ideal gas law, and mole conversions.',
    icon: 'FlaskConical'
  },
  {
    id: 'statistics',
    slug: 'statistics',
    name: 'Statistics',
    description: 'Dataset mean, median, mode, standard deviation, variance, Z-scores, probability, and confidence intervals.',
    icon: 'BarChart2'
  },
  {
    id: 'data-computer',
    slug: 'data-computer',
    name: 'Data & Computer',
    description: 'Byte conversions, binary & hex calculators, IPv4 subnetting, bandwidth, download times, and storage.',
    icon: 'Cpu'
  },
  {
    id: 'time-productivity',
    slug: 'time-productivity',
    name: 'Time & Productivity',
    description: 'Interactive Pomodoro timer, precision stopwatch, timesheet hours, and overtime calculators.',
    icon: 'Timer'
  },
  {
    id: 'business',
    slug: 'business',
    name: 'Business',
    description: 'Business profit, profit margins, markups, ROAS, break-even analysis, and total employee costs.',
    icon: 'Briefcase'
  }
];

export const CATEGORIES: Category[] = RAW_CATEGORIES.map((cat) => ({
  ...cat,
  count: (CALCULATORS_BY_CATEGORY.get(cat.id) || []).length
}));
