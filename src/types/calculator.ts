export type CategoryId =
  | 'basic-everyday'
  | 'math'
  | 'geometry'
  | 'finance'
  | 'health-fitness'
  | 'date-time'
  | 'unit-converters'
  | 'construction'
  | 'electrical'
  | 'physics'
  | 'chemistry'
  | 'statistics'
  | 'data-computer'
  | 'time-productivity'
  | 'business';

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  count?: number;
}

export type FieldType = 'number' | 'select' | 'text';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: FieldType;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export interface ResultBreakdownItem {
  label: string;
  value: string;
  hint?: string;
}

export interface CalculatorResult {
  primaryValue: string;
  primaryLabel: string;
  subtext?: string;
  breakdown?: ResultBreakdownItem[];
  steps?: string[];
  error?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WorkedExample {
  inputs: Record<string, any>;
  output: string;
  explanation: string;
}

export interface CalculatorDef {
  id: string;
  slug: string;
  title: string;
  category: CategoryId;
  shortDesc: string;
  icon: string;
  badge?: 'popular' | 'featured';
  disclaimer?: string;
  isInteractiveKeypad?: boolean;
  isInteractiveTimer?: 'pomodoro' | 'stopwatch' | 'countdown';
  fields: CalculatorField[];
  calculate: (inputs: Record<string, any>) => CalculatorResult;
  formula?: string;
  explanation: string;
  howToUse: string[];
  example: WorkedExample;
  faqs: FAQItem[];
  keywords: string[];
}

export interface HistoryItem {
  id: string;
  calcId: string;
  calcSlug: string;
  calcTitle: string;
  timestamp: number;
  inputs: Record<string, any>;
  primaryResult: string;
}
