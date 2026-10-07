import { CalculatorDef } from '../../types/calculator';

const HEALTH_DISCLAIMER =
  'Disclaimer: This calculator is for informational and educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified physician or healthcare professional regarding personal health decisions.';

export const healthFitnessCalculators: CalculatorDef[] = [
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    title: 'BMI Calculator (Body Mass Index)',
    category: 'health-fitness',
    shortDesc: 'Calculate Body Mass Index (BMI) and determine your WHO weight category.',
    icon: 'Activity',
    badge: 'popular',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      {
        id: 'unit',
        label: 'Measurement Unit',
        type: 'select',
        defaultValue: 'metric',
        options: [
          { label: 'Metric (kg, cm)', value: 'metric' },
          { label: 'US Customary (lbs, inches)', value: 'imperial' }
        ]
      },
      { id: 'weight', label: 'Weight (kg or lbs)', type: 'number', defaultValue: 70, min: 20, max: 400, step: 0.5 },
      { id: 'height', label: 'Height (cm or inches)', type: 'number', defaultValue: 175, min: 50, max: 250, step: 0.5 }
    ],
    calculate: (inputs) => {
      const isMetric = inputs.unit !== 'imperial';
      const weight = parseFloat(inputs.weight) || 0;
      const height = parseFloat(inputs.height) || 0;

      if (weight <= 0 || height <= 0) {
        return { primaryValue: '0', primaryLabel: 'BMI Score', error: 'Please enter valid weight and height values.' };
      }

      let bmi = 0;
      let heightM = 0;
      if (isMetric) {
        heightM = height / 100;
        bmi = weight / (heightM * heightM);
      } else {
        bmi = (703 * weight) / (height * height);
        heightM = (height * 2.54) / 100;
      }

      let category = '';
      let healthyRange = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 24.9) category = 'Normal weight (Healthy)';
      else if (bmi < 29.9) category = 'Overweight';
      else if (bmi < 34.9) category = 'Obesity Class I';
      else if (bmi < 39.9) category = 'Obesity Class II';
      else category = 'Obesity Class III (Severe)';

      const minHealthyKg = 18.5 * (heightM * heightM);
      const maxHealthyKg = 24.9 * (heightM * heightM);

      if (isMetric) {
        healthyRange = `${minHealthyKg.toFixed(1)} kg - ${maxHealthyKg.toFixed(1)} kg`;
      } else {
        healthyRange = `${(minHealthyKg * 2.20462).toFixed(1)} lbs - ${(maxHealthyKg * 2.20462).toFixed(1)} lbs`;
      }

      return {
        primaryValue: bmi.toFixed(1),
        primaryLabel: 'Body Mass Index (BMI)',
        subtext: `Category: ${category}`,
        breakdown: [
          { label: 'BMI Score', value: bmi.toFixed(2) },
          { label: 'WHO Category', value: category },
          { label: 'Healthy Weight Range for Height', value: healthyRange },
          { label: 'Prime BMI Indicator', value: (bmi / 25).toFixed(2) }
        ],
        steps: [
          isMetric ? `BMI = ${weight} / (${heightM.toFixed(2)})²` : `BMI = (703 × ${weight}) / (${height})²`,
          `Computed BMI = ${bmi.toFixed(2)}`,
          `Matched WHO benchmark: ${category}`
        ]
      };
    },
    formula: 'Metric: BMI = weight (kg) / [height (m)]²  |  Imperial: BMI = 703 × weight (lbs) / [height (in)]²',
    explanation: 'Body Mass Index is a screening metric that assesses body mass relative to height, categorized by the World Health Organization.',
    howToUse: ['Select Metric (kg/cm) or Imperial (lbs/inches).', 'Enter weight and height.', 'Click Calculate to see BMI score and weight classification.'],
    example: { inputs: { unit: 'metric', weight: 70, height: 175 }, output: '22.9', explanation: '70 / (1.75)² = 22.86 (Normal healthy weight).' },
    faqs: [
      { question: 'What is a healthy BMI range?', answer: 'A BMI between 18.5 and 24.9 is considered normal and healthy for most adults.' },
      { question: 'Does BMI distinguish muscle from fat?', answer: 'No, BMI does not differentiate between lean muscle mass and adipose fat tissue.' }
    ],
    keywords: ['bmi calculator', 'body mass index', 'weight category', 'healthy weight range']
  },
  {
    id: 'bmr-calculator',
    slug: 'bmr-calculator',
    title: 'BMR Calculator (Basal Metabolic Rate)',
    category: 'health-fitness',
    shortDesc: 'Compute the baseline calories burned at rest using the Mifflin-St Jeor equation.',
    icon: 'Flame',
    badge: 'popular',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 28, min: 15, max: 100, step: 1 },
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 75, min: 30, max: 300, step: 0.5 },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 178, min: 100, max: 230, step: 1 }
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const age = parseFloat(inputs.age) || 25;
      const w = parseFloat(inputs.weightKg) || 70;
      const h = parseFloat(inputs.heightCm) || 175;

      // Mifflin-St Jeor Formula
      let bmr = 10 * w + 6.25 * h - 5 * age + (isMale ? 5 : -161);

      return {
        primaryValue: `${Math.round(bmr)} kcal/day`,
        primaryLabel: 'Basal Metabolic Rate (BMR)',
        subtext: 'Daily baseline calories required strictly at complete rest',
        breakdown: [
          { label: 'Mifflin-St Jeor BMR', value: `${Math.round(bmr)} calories/day` },
          { label: 'Hourly Resting Burn', value: `${(bmr / 24).toFixed(1)} kcal/hour` },
          { label: 'Sedentary Daily Maintenance', value: `${Math.round(bmr * 1.2)} kcal/day` }
        ],
        steps: [
          `Apply Mifflin-St Jeor formula: 10 × (${w}) + 6.25 × (${h}) - 5 × (${age}) ${isMale ? '+ 5' : '- 161'}`,
          `BMR = ${Math.round(bmr)} kcal/day`
        ]
      };
    },
    formula: 'Men: BMR = 10W + 6.25H - 5A + 5  |  Women: BMR = 10W + 6.25H - 5A - 161',
    explanation: 'Basal Metabolic Rate is the number of calories your body needs to maintain basic life-sustaining functions at complete rest.',
    howToUse: ['Select biological gender.', 'Enter age, weight in kg, and height in cm.', 'Click Calculate.'],
    example: { inputs: { gender: 'male', age: 28, weightKg: 75, heightCm: 178 }, output: '1,728 kcal/day', explanation: 'Resting energy expenditure is ~1,728 calories per 24 hours.' },
    faqs: [{ question: 'How is BMR different from TDEE?', answer: 'BMR is resting burn only; TDEE includes daily movement and physical exercise.' }],
    keywords: ['bmr calculator', 'basal metabolic rate', 'mifflin st jeor', 'resting calories']
  },
  {
    id: 'tdee-calculator',
    slug: 'tdee-calculator',
    title: 'TDEE Calculator (Total Daily Energy Expenditure)',
    category: 'health-fitness',
    shortDesc: 'Calculate total daily calorie expenditure based on physical activity multiplier.',
    icon: 'Zap',
    badge: 'popular',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 30, min: 15, max: 100, step: 1 },
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 78, min: 30, step: 0.5 },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 180, min: 100, step: 1 },
      {
        id: 'activity',
        label: 'Activity Level',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { label: 'Sedentary (desk job, little exercise) [× 1.2]', value: 'sedentary' },
          { label: 'Lightly Active (exercise 1-3 days/week) [× 1.375]', value: 'light' },
          { label: 'Moderately Active (exercise 3-5 days/week) [× 1.55]', value: 'moderate' },
          { label: 'Very Active (hard exercise 6-7 days/week) [× 1.725]', value: 'very' },
          { label: 'Extremely Active (athlete, physical job) [× 1.9]', value: 'extra' }
        ]
      }
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const age = parseFloat(inputs.age) || 25;
      const w = parseFloat(inputs.weightKg) || 70;
      const h = parseFloat(inputs.heightCm) || 175;

      const bmr = 10 * w + 6.25 * h - 5 * age + (isMale ? 5 : -161);

      const multipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
        extra: 1.9
      };

      const mult = multipliers[inputs.activity] || 1.55;
      const tdee = Math.round(bmr * mult);

      return {
        primaryValue: `${tdee} kcal/day`,
        primaryLabel: 'Maintenance Calories (TDEE)',
        subtext: `Based on ${inputs.activity} activity multiplier (${mult}× BMR)`,
        breakdown: [
          { label: 'Basal Metabolic Rate (BMR)', value: `${Math.round(bmr)} kcal` },
          { label: 'Activity Multiplier', value: `${mult}×` },
          { label: 'Maintenance TDEE', value: `${tdee} kcal/day` },
          { label: 'Mild Weight Loss (-250 kcal)', value: `${tdee - 250} kcal/day` },
          { label: 'Weight Loss (-500 kcal)', value: `${tdee - 500} kcal/day` },
          { label: 'Muscle Gain (+300 kcal)', value: `${tdee + 300} kcal/day` }
        ],
        steps: [`Calculated BMR = ${Math.round(bmr)} kcal`, `Multiplied by activity factor ${mult}: ${Math.round(bmr)} × ${mult} = ${tdee} kcal`]
      };
    },
    formula: 'TDEE = BMR × Activity Multiplier',
    explanation: 'TDEE accounts for all calories burned throughout the day, including resting metabolism, digestion, and workouts.',
    howToUse: ['Enter your stats and select typical weekly activity level.', 'Click Calculate to find your caloric maintenance baseline.'],
    example: { inputs: { gender: 'male', age: 30, weightKg: 78, heightCm: 180, activity: 'moderate' }, output: '2,736 kcal/day', explanation: 'BMR of 1,765 × 1.55 gives 2,736 maintenance calories.' },
    faqs: [{ question: 'How do I lose 1 lb per week?', answer: 'A caloric deficit of 500 calories per day under TDEE yields approximately 1 lb of fat loss per week (3,500 kcal deficit).' }],
    keywords: ['tdee calculator', 'daily calorie burn', 'maintenance calories', 'macro planning']
  },
  {
    id: 'calorie-calculator',
    slug: 'calorie-calculator',
    title: 'Calorie Deficit / Surplus Calculator',
    category: 'health-fitness',
    shortDesc: 'Determine target calorie intake for weight loss, maintenance, or muscle gain.',
    icon: 'Apple',
    badge: 'popular',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'tdee', label: 'Your Maintenance Calories (TDEE)', type: 'number', defaultValue: 2400, min: 1000, step: 50 },
      {
        id: 'goal',
        label: 'Fitness Goal',
        type: 'select',
        defaultValue: 'moderate_loss',
        options: [
          { label: 'Maintain Current Weight', value: 'maintain' },
          { label: 'Mild Weight Loss (-0.5 lb / week)', value: 'mild_loss' },
          { label: 'Moderate Weight Loss (-1 lb / week)', value: 'moderate_loss' },
          { label: 'Aggressive Weight Loss (-1.5 lb / week)', value: 'fast_loss' },
          { label: 'Lean Muscle Bulk (+0.5 lb / week)', value: 'lean_bulk' }
        ]
      }
    ],
    calculate: (inputs) => {
      const tdee = parseFloat(inputs.tdee) || 2000;
      const goal = inputs.goal || 'moderate_loss';

      let diff = 0;
      let label = '';
      if (goal === 'maintain') {
        diff = 0;
        label = 'Maintenance';
      } else if (goal === 'mild_loss') {
        diff = -250;
        label = 'Mild Loss (-0.5 lb/wk)';
      } else if (goal === 'moderate_loss') {
        diff = -500;
        label = 'Moderate Loss (-1.0 lb/wk)';
      } else if (goal === 'fast_loss') {
        diff = -750;
        label = 'Fast Loss (-1.5 lb/wk)';
      } else if (goal === 'lean_bulk') {
        diff = 300;
        label = 'Lean Bulk (+0.5 lb/wk)';
      }

      const target = Math.max(1200, tdee + diff);

      return {
        primaryValue: `${target} kcal/day`,
        primaryLabel: 'Daily Calorie Target',
        subtext: `Goal: ${label} (${diff >= 0 ? '+' : ''}${diff} kcal/day)`,
        breakdown: [
          { label: 'Maintenance Baseline', value: `${tdee} kcal` },
          { label: 'Daily Adjustment', value: `${diff >= 0 ? '+' : ''}${diff} kcal` },
          { label: 'Target Calorie Budget', value: `${target} kcal` },
          { label: 'Weekly Calorie Net', value: `${target * 7} kcal/week` }
        ],
        steps: [`Starting TDEE: ${tdee} kcal`, `Applied deficit/surplus adjustment: ${diff} kcal`, `Final recommended intake: ${target} kcal`]
      };
    },
    formula: 'Target = TDEE ± Goal Deficit/Surplus',
    explanation: 'Adjusts daily caloric intake to produce controlled weight change rates.',
    howToUse: ['Enter your daily maintenance calories.', 'Choose your target fitness goal.', 'Click Calculate.'],
    example: { inputs: { tdee: 2400, goal: 'moderate_loss' }, output: '1,900 kcal/day', explanation: '2,400 TDEE - 500 kcal deficit = 1,900 calories/day.' },
    faqs: [{ question: 'What is the minimum safe calories per day?', answer: 'Health guidelines advise not dipping below 1,200 kcal/day for women or 1,500 kcal/day for men without direct medical supervision.' }],
    keywords: ['calorie calculator', 'calorie deficit', 'weight loss calories', 'bulking calories']
  },
  {
    id: 'ideal-weight-calculator',
    slug: 'ideal-weight-calculator',
    title: 'Ideal Weight Calculator',
    category: 'health-fitness',
    shortDesc: 'Compute ideal body weight using Devine, Robinson, Miller, and Hamwi equations.',
    icon: 'Scale',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 175, min: 140, max: 220, step: 1 }
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const hCm = parseFloat(inputs.heightCm) || 170;
      const hInches = hCm / 2.54;
      const over5ft = Math.max(0, hInches - 60);

      // Devine Formula (kg)
      const devine = isMale ? 50 + 2.3 * over5ft : 45.5 + 2.3 * over5ft;
      // Robinson Formula (kg)
      const robinson = isMale ? 52 + 1.9 * over5ft : 49 + 1.7 * over5ft;
      // Miller Formula (kg)
      const miller = isMale ? 56.2 + 1.41 * over5ft : 53.1 + 1.36 * over5ft;
      // Hamwi Formula (kg)
      const hamwi = isMale ? 48 + 2.7 * over5ft : 45.5 + 2.2 * over5ft;

      const avgKg = (devine + robinson + miller + hamwi) / 4;
      const avgLbs = avgKg * 2.20462;

      return {
        primaryValue: `${avgKg.toFixed(1)} kg (${avgLbs.toFixed(1)} lbs)`,
        primaryLabel: 'Ideal Body Weight (Average)',
        subtext: `Height: ${hCm} cm (~${Math.floor(hInches / 12)}'${Math.round(hInches % 12)}")`,
        breakdown: [
          { label: 'Devine Formula (1974)', value: `${devine.toFixed(1)} kg (${(devine * 2.20462).toFixed(1)} lbs)` },
          { label: 'Robinson Formula (1983)', value: `${robinson.toFixed(1)} kg (${(robinson * 2.20462).toFixed(1)} lbs)` },
          { label: 'Miller Formula (1983)', value: `${miller.toFixed(1)} kg (${(miller * 2.20462).toFixed(1)} lbs)` },
          { label: 'Hamwi Formula (1964)', value: `${hamwi.toFixed(1)} kg (${(hamwi * 2.20462).toFixed(1)} lbs)` }
        ],
        steps: [
          `Calculated height above 5 feet: ${over5ft.toFixed(1)} inches`,
          `Applied clinical formulas: Devine (${devine.toFixed(1)}kg), Robinson (${robinson.toFixed(1)}kg), Miller (${miller.toFixed(1)}kg), Hamwi (${hamwi.toFixed(1)}kg)`
        ]
      };
    },
    formula: 'Devine: Men: 50kg + 2.3kg/in > 5ft  |  Women: 45.5kg + 2.3kg/in > 5ft',
    explanation: 'Compares the four gold-standard medical formulas used to estimate optimal body weight based on height and biological gender.',
    howToUse: ['Select gender.', 'Enter height in centimeters.', 'Click Calculate.'],
    example: { inputs: { gender: 'male', heightCm: 175 }, output: '69.9 kg (154.2 lbs)', explanation: 'Average clinical recommendation for a 5 ft 9 in male.' },
    faqs: [{ question: 'Why are there multiple formulas?', answer: 'Different medical researchers derived formulas based on various clinical trial cohorts and medication dosing models.' }],
    keywords: ['ideal weight calculator', 'devine formula', 'healthy weight', 'ibw calculator']
  },
  {
    id: 'body-fat-calculator',
    slug: 'body-fat-calculator',
    title: 'Body Fat Calculator (US Navy Method)',
    category: 'health-fitness',
    shortDesc: 'Estimate body fat percentage and fat mass using US Navy anthropometric equations.',
    icon: 'UserCheck',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 78, min: 30, step: 0.5 },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 178, min: 100, step: 0.5 },
      { id: 'neckCm', label: 'Neck Circumference (cm)', type: 'number', defaultValue: 38, min: 20, step: 0.5 },
      { id: 'waistCm', label: 'Waist Circumference (cm)', type: 'number', defaultValue: 84, min: 40, step: 0.5 },
      { id: 'hipCm', label: 'Hip Circumference (cm) (Female only)', type: 'number', defaultValue: 95, min: 50, step: 0.5 }
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const weight = parseFloat(inputs.weightKg) || 75;
      const height = parseFloat(inputs.heightCm) || 175;
      const neck = parseFloat(inputs.neckCm) || 38;
      const waist = parseFloat(inputs.waistCm) || 84;
      const hip = parseFloat(inputs.hipCm) || 95;

      let bf = 0;
      if (isMale) {
        if (waist <= neck) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Waist circumference must be larger than neck.' };
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        if (waist + hip <= neck) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Waist + hip must exceed neck circumference.' };
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
      }

      bf = Math.max(3, Math.min(60, bf));
      const fatMass = (weight * bf) / 100;
      const leanMass = weight - fatMass;

      let category = '';
      if (isMale) {
        if (bf < 6) category = 'Essential Fat';
        else if (bf < 14) category = 'Athletes';
        else if (bf < 18) category = 'Fitness';
        else if (bf < 25) category = 'Average';
        else category = 'Obese';
      } else {
        if (bf < 14) category = 'Essential Fat';
        else if (bf < 21) category = 'Athletes';
        else if (bf < 25) category = 'Fitness';
        else if (bf < 32) category = 'Average';
        else category = 'Obese';
      }

      return {
        primaryValue: `${bf.toFixed(1)}%`,
        primaryLabel: 'Body Fat Percentage',
        subtext: `Classification: ${category}`,
        breakdown: [
          { label: 'Body Fat %', value: `${bf.toFixed(1)}%` },
          { label: 'Category', value: category },
          { label: 'Fat Mass', value: `${fatMass.toFixed(1)} kg` },
          { label: 'Lean Mass', value: `${leanMass.toFixed(1)} kg` }
        ],
        steps: [
          `Applied US Navy logarithmic tape measurement formula for ${isMale ? 'men' : 'women'}`,
          `Computed fat mass: ${weight}kg × ${bf.toFixed(1)}% = ${fatMass.toFixed(1)} kg`
        ]
      };
    },
    formula: 'Men: 495 / (1.0324 - 0.19077 log10(waist-neck) + 0.15456 log10(height)) - 450',
    explanation: 'Uses body circumference measurements developed by the U.S. Navy Department of Defense to accurately estimate body composition.',
    howToUse: ['Measure neck (below larynx) and waist (at navel).', 'For females, also measure hips at the widest point.', 'Click Calculate.'],
    example: { inputs: { gender: 'male', weightKg: 78, heightCm: 178, neckCm: 38, waistCm: 84, hipCm: 95 }, output: '15.6%', explanation: 'Fitness category body fat with 12.2 kg fat mass and 65.8 kg lean mass.' },
    faqs: [{ question: 'How accurate is the US Navy formula?', answer: 'Studies show it is accurate to within 3-4% of DEXA body scan measurements when measured carefully.' }],
    keywords: ['body fat calculator', 'us navy method', 'fat percentage', 'lean mass', 'body composition']
  },
  {
    id: 'lean-body-mass-calculator',
    slug: 'lean-body-mass-calculator',
    title: 'Lean Body Mass Calculator',
    category: 'health-fitness',
    shortDesc: 'Compute total lean tissue (muscle, bones, organs) using Boer and James formulas.',
    icon: 'Dumbbell',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 80, min: 30, step: 0.5 },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 180, min: 100, step: 1 }
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const w = parseFloat(inputs.weightKg) || 75;
      const h = parseFloat(inputs.heightCm) || 175;

      // Boer Formula
      const boer = isMale ? 0.407 * w + 0.267 * h - 19.2 : 0.252 * w + 0.473 * h - 48.3;
      // James Formula
      const james = isMale ? 1.1 * w - 128 * Math.pow(w / h, 2) : 1.07 * w - 148 * Math.pow(w / h, 2);

      const lbm = (boer + james) / 2;
      const fatKg = Math.max(0, w - lbm);
      const fatPct = (fatKg / w) * 100;

      return {
        primaryValue: `${lbm.toFixed(1)} kg`,
        primaryLabel: 'Lean Body Mass (LBM)',
        subtext: `Lean Percentage: ${((lbm / w) * 100).toFixed(1)}% of total weight`,
        breakdown: [
          { label: 'Total Weight', value: `${w} kg` },
          { label: 'Lean Mass (Boer)', value: `${boer.toFixed(1)} kg` },
          { label: 'Lean Mass (James)', value: `${james.toFixed(1)} kg` },
          { label: 'Estimated Fat Mass', value: `${fatKg.toFixed(1)} kg (${fatPct.toFixed(1)}%)` }
        ],
        steps: [`Applied Boer formula: ${boer.toFixed(1)} kg`, `Applied James formula: ${james.toFixed(1)} kg`, `Average Lean Mass = ${lbm.toFixed(1)} kg`]
      };
    },
    formula: 'Boer: Men LBM = 0.407W + 0.267H - 19.2  |  Women LBM = 0.252W + 0.473H - 48.3',
    explanation: 'Lean Body Mass is the total mass of your body minus adipose fat tissue, representing muscle, organs, bones, and body water.',
    howToUse: ['Select gender.', 'Enter weight and height.', 'Click Calculate.'],
    example: { inputs: { gender: 'male', weightKg: 80, heightCm: 180 }, output: '61.5 kg', explanation: '61.5 kg lean tissue with ~18.5 kg body fat.' },
    faqs: [{ question: 'Why is LBM important for athletes?', answer: 'It is the primary determinant of baseline metabolic energy needs and athletic power-to-weight ratio.' }],
    keywords: ['lean body mass', 'lbm calculator', 'muscle mass', 'boer formula']
  },
  {
    id: 'macro-calculator',
    slug: 'macro-calculator',
    title: 'Macro Calculator (Protein, Carbs, Fats)',
    category: 'health-fitness',
    shortDesc: 'Calculate grams of daily protein, carbohydrates, and fats for your diet style.',
    icon: 'PieChart',
    badge: 'popular',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'calories', label: 'Daily Calorie Target (kcal)', type: 'number', defaultValue: 2200, min: 1000, step: 50 },
      {
        id: 'dietType',
        label: 'Diet Distribution',
        type: 'select',
        defaultValue: 'balanced',
        options: [
          { label: 'Balanced (30% Protein / 40% Carbs / 30% Fat)', value: 'balanced' },
          { label: 'High Protein / Bodybuilding (40% P / 35% C / 25% F)', value: 'high_protein' },
          { label: 'Low Carb (35% P / 20% C / 45% F)', value: 'low_carb' },
          { label: 'Ketogenic (20% P / 5% C / 75% F)', value: 'keto' }
        ]
      }
    ],
    calculate: (inputs) => {
      const cal = parseFloat(inputs.calories) || 2000;
      const type = inputs.dietType || 'balanced';

      let pPct = 0.3;
      let cPct = 0.4;
      let fPct = 0.3;

      if (type === 'high_protein') {
        pPct = 0.4;
        cPct = 0.35;
        fPct = 0.25;
      } else if (type === 'low_carb') {
        pPct = 0.35;
        cPct = 0.2;
        fPct = 0.45;
      } else if (type === 'keto') {
        pPct = 0.2;
        cPct = 0.05;
        fPct = 0.75;
      }

      // 4 kcal per gram of protein & carbs, 9 kcal per gram of fat
      const proteinGrams = Math.round((cal * pPct) / 4);
      const carbsGrams = Math.round((cal * cPct) / 4);
      const fatGrams = Math.round((cal * fPct) / 9);

      return {
        primaryValue: `${proteinGrams}g P | ${carbsGrams}g C | ${fatGrams}g F`,
        primaryLabel: 'Daily Macronutrient Targets',
        subtext: `Total: ${cal} kcal (${pPct * 100}% P / ${cPct * 100}% C / ${fPct * 100}% F)`,
        breakdown: [
          { label: 'Protein (4 kcal/g)', value: `${proteinGrams} grams (${Math.round(proteinGrams * 4)} kcal)` },
          { label: 'Carbohydrates (4 kcal/g)', value: `${carbsGrams} grams (${Math.round(carbsGrams * 4)} kcal)` },
          { label: 'Healthy Fats (9 kcal/g)', value: `${fatGrams} grams (${Math.round(fatGrams * 9)} kcal)` }
        ],
        steps: [
          `Protein: (${cal} × ${pPct * 100}%) / 4 = ${proteinGrams}g`,
          `Carbohydrates: (${cal} × ${cPct * 100}%) / 4 = ${carbsGrams}g`,
          `Fats: (${cal} × ${fPct * 100}%) / 9 = ${fatGrams}g`
        ]
      };
    },
    formula: 'Protein (g) = (kcal × %P)/4  |  Carbs (g) = (kcal × %C)/4  |  Fats (g) = (kcal × %F)/9',
    explanation: 'Macronutrients supply the energy requirements of the human body: 4 calories per gram of protein and carbohydrates, and 9 calories per gram of fat.',
    howToUse: ['Enter your target daily calories.', 'Choose your preferred dietary macro ratio.', 'Click Calculate.'],
    example: { inputs: { calories: 2200, dietType: 'balanced' }, output: '165g P | 220g C | 73g F', explanation: 'Balanced diet providing optimal fuel for workouts and recovery.' },
    faqs: [{ question: 'How much protein should I eat per day?', answer: 'General fitness guidelines suggest 1.6 to 2.2 grams of protein per kilogram of body weight for active individuals.' }],
    keywords: ['macro calculator', 'protein carbs fat', 'keto macros', 'flexible dieting', 'iifym']
  },
  {
    id: 'protein-calculator',
    slug: 'protein-calculator',
    title: 'Protein Intake Calculator',
    category: 'health-fitness',
    shortDesc: 'Compute daily grams of dietary protein needed for muscle hypertrophy or health.',
    icon: 'Award',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'weightKg', label: 'Body Weight (kg)', type: 'number', defaultValue: 75, min: 30, step: 0.5 },
      {
        id: 'goal',
        label: 'Goal & Activity Level',
        type: 'select',
        defaultValue: 'muscle_building',
        options: [
          { label: 'Sedentary Adult (RDA minimum) [0.8 g/kg]', value: 'sedentary' },
          { label: 'Endurance Athlete (Running/Cycling) [1.3 g/kg]', value: 'endurance' },
          { label: 'Strength Training / Hypertrophy [1.8 g/kg]', value: 'muscle_building' },
          { label: 'Fat Loss While Preserving Muscle [2.2 g/kg]', value: 'cutting' }
        ]
      }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightKg) || 70;
      const rates: Record<string, number> = {
        sedentary: 0.8,
        endurance: 1.3,
        muscle_building: 1.8,
        cutting: 2.2
      };

      const rate = rates[inputs.goal] || 1.8;
      const targetG = Math.round(w * rate);
      const targetCalories = targetG * 4;

      return {
        primaryValue: `${targetG} grams/day`,
        primaryLabel: 'Recommended Protein Intake',
        subtext: `Based on ${rate} g/kg of body weight (${targetCalories} kcal)`,
        breakdown: [
          { label: 'Body Weight', value: `${w} kg (${(w * 2.20462).toFixed(1)} lbs)` },
          { label: 'Multiplier', value: `${rate} g per kg` },
          { label: 'Daily Target', value: `${targetG} grams` },
          { label: 'Per Meal (4 meals/day)', value: `~${Math.round(targetG / 4)} grams/meal` }
        ],
        steps: [`Multiply body weight: ${w} kg × ${rate} g/kg = ${targetG} grams of protein daily`]
      };
    },
    formula: 'Daily Protein (g) = Body Weight (kg) × Recommended Multiplier (g/kg)',
    explanation: 'Protein supports muscle protein synthesis, cellular repair, and enzyme production.',
    howToUse: ['Enter weight in kg.', 'Select fitness or athletic discipline.', 'Click Calculate.'],
    example: { inputs: { weightKg: 75, goal: 'muscle_building' }, output: '135 grams/day', explanation: '75 kg × 1.8 g/kg = 135 grams of daily protein.' },
    faqs: [{ question: 'Is eating high protein harmful to healthy kidneys?', answer: 'Extensive scientific literature shows high protein diets up to 2.8 g/kg do not cause renal damage in individuals with normal kidney function.' }],
    keywords: ['protein calculator', 'muscle protein synthesis', 'daily protein intake', 'gym nutrition']
  },
  {
    id: 'water-intake-calculator',
    slug: 'water-intake-calculator',
    title: 'Daily Water Intake Calculator',
    category: 'health-fitness',
    shortDesc: 'Determine optimal daily hydration in liters and glasses based on weight and activity.',
    icon: 'Droplet',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'weightKg', label: 'Body Weight (kg)', type: 'number', defaultValue: 70, min: 30, step: 1 },
      { id: 'exerciseMinutes', label: 'Daily Exercise / Workout (Minutes)', type: 'number', defaultValue: 45, min: 0, max: 240, step: 15 },
      {
        id: 'climate',
        label: 'Climate / Environment',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { label: 'Normal / Temperate Climate', value: 'moderate' },
          { label: 'Hot / Humid Climate', value: 'hot' }
        ]
      }
    ],
    calculate: (inputs) => {
      const w = parseFloat(inputs.weightKg) || 70;
      const exercise = parseFloat(inputs.exerciseMinutes) || 0;
      const isHot = inputs.climate === 'hot';

      // Base: ~35 ml per kg
      let ml = w * 35;
      // Add ~12 ml per minute of exercise
      ml += exercise * 12;
      // Add 400 ml if hot climate
      if (isHot) ml += 400;

      const liters = ml / 1000;
      const glasses = Math.round(ml / 250); // standard 250ml glass
      const flOz = ml * 0.033814;

      return {
        primaryValue: `${liters.toFixed(2)} Liters/day`,
        primaryLabel: 'Recommended Water Intake',
        subtext: `Approx. ${glasses} standard glasses (250 ml) or ${Math.round(flOz)} fl oz`,
        breakdown: [
          { label: 'Base Hydration (Weight)', value: `${(w * 0.035).toFixed(2)} L` },
          { label: 'Exercise Replacement', value: `+${((exercise * 12) / 1000).toFixed(2)} L` },
          { label: 'Climate Adjustment', value: isHot ? '+0.40 L' : '0 L' },
          { label: 'Total Daily Water', value: `${liters.toFixed(2)} Liters` }
        ],
        steps: [
          `Base calculation: ${w} kg × 35 ml/kg = ${w * 35} ml`,
          `Workout sweat compensation: +${exercise * 12} ml`,
          `Total hydration needed = ${liters.toFixed(2)} Liters`
        ]
      };
    },
    formula: 'Water (ml) = (Weight kg × 35) + (Workout min × 12) + Climate',
    explanation: 'Calculates the fluid volume required to replenish metabolic, sweat, and respiratory water loss.',
    howToUse: ['Enter your weight.', 'Enter expected workout minutes.', 'Select climate.', 'Click Calculate.'],
    example: { inputs: { weightKg: 70, exerciseMinutes: 45, climate: 'moderate' }, output: '2.99 Liters/day', explanation: '~3 liters (12 glasses) daily hydration.' },
    faqs: [{ question: 'Does coffee or tea count toward water intake?', answer: 'Yes, moderate consumption of caffeinated beverages contributes to daily fluid hydration according to health authorities.' }],
    keywords: ['water intake calculator', 'daily hydration', 'how much water to drink', 'fluid intake']
  },
  {
    id: 'heart-rate-calculator',
    slug: 'heart-rate-calculator',
    title: 'Target Heart Rate Calculator',
    category: 'health-fitness',
    shortDesc: 'Calculate Max Heart Rate and training intensity zones (Zones 1 through 5).',
    icon: 'Heart',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 32, min: 12, max: 100, step: 1 },
      { id: 'restingHR', label: 'Resting Heart Rate (bpm) (optional)', type: 'number', defaultValue: 65, min: 40, max: 120, step: 1 }
    ],
    calculate: (inputs) => {
      const age = parseInt(inputs.age) || 30;
      const rhr = parseInt(inputs.restingHR) || 60;

      // Tanaka formula: 208 - (0.7 × age)
      const maxHR = Math.round(208 - 0.7 * age);
      // Karvonen formula for heart rate reserve
      const hrr = maxHR - rhr;

      const z1 = `${Math.round(rhr + hrr * 0.5)} - ${Math.round(rhr + hrr * 0.6)} bpm`;
      const z2 = `${Math.round(rhr + hrr * 0.6)} - ${Math.round(rhr + hrr * 0.7)} bpm`;
      const z3 = `${Math.round(rhr + hrr * 0.7)} - ${Math.round(rhr + hrr * 0.8)} bpm`;
      const z4 = `${Math.round(rhr + hrr * 0.8)} - ${Math.round(rhr + hrr * 0.9)} bpm`;
      const z5 = `${Math.round(rhr + hrr * 0.9)} - ${maxHR} bpm`;

      return {
        primaryValue: `${maxHR} bpm`,
        primaryLabel: 'Estimated Max Heart Rate (HR_max)',
        subtext: `Zone 2 (Fat Burn / Aerobic): ${z2}`,
        breakdown: [
          { label: 'Zone 1 (Active Recovery, 50-60%)', value: z1 },
          { label: 'Zone 2 (Endurance Base, 60-70%)', value: z2 },
          { label: 'Zone 3 (Aerobic Tempo, 70-80%)', value: z3 },
          { label: 'Zone 4 (Threshold, 80-90%)', value: z4 },
          { label: 'Zone 5 (VO2 Max Anaerobic, 90-100%)', value: z5 }
        ],
        steps: [`Max Heart Rate (Tanaka formula) = 208 - (0.7 × ${age}) = ${maxHR} bpm`, `Heart Rate Reserve (HRR) = ${maxHR} - ${rhr} = ${hrr} bpm`]
      };
    },
    formula: 'Max HR = 208 - (0.7 × Age)  |  Target Zone = Resting HR + (HRR × Intensity %)',
    explanation: 'Defines 5 training heart rate zones for cardiovascular endurance, fat oxidation, and anaerobic performance.',
    howToUse: ['Enter your age and resting heart rate.', 'Click Calculate to view all 5 training zones.'],
    example: { inputs: { age: 32, restingHR: 65 }, output: '186 bpm', explanation: 'Max HR is 186 bpm. Zone 2 training target is 138-150 bpm.' },
    faqs: [{ question: 'Why is Zone 2 training so popular?', answer: 'Zone 2 builds mitochondrial density and aerobic endurance while allowing rapid physiological recovery.' }],
    keywords: ['target heart rate', 'max heart rate', 'zone 2 cardio', 'karvonen formula', 'bpm']
  },
  {
    id: 'pace-calculator',
    slug: 'pace-calculator',
    title: 'Running Pace Calculator',
    category: 'health-fitness',
    shortDesc: 'Compute running pace per kilometer or mile from total distance and finish time.',
    icon: 'Timer',
    fields: [
      { id: 'distanceKm', label: 'Distance (km)', type: 'number', defaultValue: 10, min: 0.1, step: 0.1 },
      { id: 'hours', label: 'Hours', type: 'number', defaultValue: 0, min: 0, step: 1 },
      { id: 'minutes', label: 'Minutes', type: 'number', defaultValue: 50, min: 0, max: 59, step: 1 },
      { id: 'seconds', label: 'Seconds', type: 'number', defaultValue: 0, min: 0, max: 59, step: 1 }
    ],
    calculate: (inputs) => {
      const dKm = parseFloat(inputs.distanceKm) || 1;
      const h = parseFloat(inputs.hours) || 0;
      const m = parseFloat(inputs.minutes) || 0;
      const s = parseFloat(inputs.seconds) || 0;

      const totalSeconds = h * 3600 + m * 60 + s;
      if (totalSeconds <= 0 || dKm <= 0) {
        return { primaryValue: '0:00', primaryLabel: 'Pace', error: 'Please enter a valid time and distance.' };
      }

      const secPerKm = totalSeconds / dKm;
      const minPerKm = Math.floor(secPerKm / 60);
      const remSecPerKm = Math.round(secPerKm % 60);

      const dMiles = dKm * 0.621371;
      const secPerMile = totalSeconds / dMiles;
      const minPerMile = Math.floor(secPerMile / 60);
      const remSecPerMile = Math.round(secPerMile % 60);

      const kmPaceStr = `${minPerKm}:${remSecPerKm < 10 ? '0' : ''}${remSecPerKm} /km`;
      const milePaceStr = `${minPerMile}:${remSecPerMile < 10 ? '0' : ''}${remSecPerMile} /mile`;
      const speedKmh = (dKm / (totalSeconds / 3600)).toFixed(2);
      const speedMph = (dMiles / (totalSeconds / 3600)).toFixed(2);

      return {
        primaryValue: kmPaceStr,
        primaryLabel: 'Pace per Kilometer',
        subtext: `Pace per Mile: ${milePaceStr}`,
        breakdown: [
          { label: 'Pace / km', value: kmPaceStr },
          { label: 'Pace / mile', value: milePaceStr },
          { label: 'Average Speed (km/h)', value: `${speedKmh} km/h` },
          { label: 'Average Speed (mph)', value: `${speedMph} mph` },
          { label: 'Equivalent 5K Time', value: `${Math.floor((secPerKm * 5) / 60)}m ${Math.round((secPerKm * 5) % 60)}s` }
        ],
        steps: [`Total elapsed time: ${totalSeconds} seconds`, `Divide time by ${dKm} km = ${secPerKm.toFixed(1)} seconds/km = ${kmPaceStr}`]
      };
    },
    formula: 'Pace = Time / Distance  |  Speed = Distance / Time',
    explanation: 'Converts finish time and distance into average split times per kilometer and mile.',
    howToUse: ['Enter total race distance in kilometers.', 'Enter finish time in hours, minutes, and seconds.', 'Click Calculate.'],
    example: { inputs: { distanceKm: 10, hours: 0, minutes: 50, seconds: 0 }, output: '5:00 /km', explanation: 'A 50-minute 10k race represents an exact 5:00/km or 8:03/mile pace.' },
    faqs: [{ question: 'How long is a half marathon?', answer: 'A half marathon is exactly 21.0975 kilometers or 13.1094 miles.' }],
    keywords: ['pace calculator', 'running pace', 'marathon split', '5k time', '10k pace']
  },
  {
    id: 'pregnancy-calculator',
    slug: 'pregnancy-calculator',
    title: 'Pregnancy Calculator & Due Date',
    category: 'health-fitness',
    shortDesc: 'Estimate due date, current gestational week, and trimester based on Naegele rule.',
    icon: 'HeartHandshake',
    badge: 'popular',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'lmpDate', label: 'First Day of Last Menstrual Period (YYYY-MM-DD)', type: 'text', defaultValue: '2026-03-01', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const lmpStr = String(inputs.lmpDate || '').trim();
      const lmp = new Date(lmpStr);

      if (isNaN(lmp.getTime())) {
        return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Please enter date in format YYYY-MM-DD.' };
      }

      // Naegele's rule: LMP + 280 days (40 weeks)
      const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const elapsedDays = Math.floor((now.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000));
      const currentWeeks = Math.floor(elapsedDays / 7);
      const currentDays = elapsedDays % 7;

      let trimester = 'First Trimester (Weeks 1-12)';
      if (currentWeeks >= 28) trimester = 'Third Trimester (Weeks 28-40)';
      else if (currentWeeks >= 13) trimester = 'Second Trimester (Weeks 13-27)';

      const dueDateStr = dueDate.toISOString().split('T')[0];

      return {
        primaryValue: dueDateStr,
        primaryLabel: 'Estimated Delivery Date (EDD)',
        subtext: `Gestational Age: ${currentWeeks} weeks, ${currentDays} days`,
        breakdown: [
          { label: 'Estimated Due Date', value: dueDateStr },
          { label: 'Current Gestational Age', value: `${currentWeeks} weeks, ${currentDays} days` },
          { label: 'Current Trimester', value: trimester },
          { label: 'Days Remaining to Delivery', value: `${Math.max(0, 280 - elapsedDays)} days` }
        ],
        steps: [`Applied Naegele rule: LMP + 280 days = ${dueDateStr}`, `Calculated current gestational progress: ${currentWeeks}w ${currentDays}d`]
      };
    },
    formula: "Estimated Due Date = First day of LMP + 1 year - 3 months + 7 days (Naegele's rule)",
    explanation: 'Naegele’s rule calculates an estimated delivery date assuming a standard 280-day gestational timeline from the last period.',
    howToUse: ['Enter the date of the first day of your last menstrual period (YYYY-MM-DD).', 'Click Calculate.'],
    example: { inputs: { lmpDate: '2026-03-01' }, output: '2026-12-06', explanation: 'Estimated delivery date is Dec 6, 2026.' },
    faqs: [{ question: 'How accurate is the estimated due date?', answer: 'Only around 4-5% of babies are born on their exact due date; most arrive within 2 weeks before or after.' }],
    keywords: ['pregnancy calculator', 'due date calculator', 'gestational age', 'trimester calculator']
  },
  {
    id: 'due-date-calculator',
    slug: 'due-date-calculator',
    title: 'Due Date Calculator',
    category: 'health-fitness',
    shortDesc: 'Calculate conception date, milestones, and delivery timeline.',
    icon: 'Calendar',
    disclaimer: HEALTH_DISCLAIMER,
    fields: [
      { id: 'lmp', label: 'First Day of Last Period (YYYY-MM-DD)', type: 'text', defaultValue: '2026-01-15', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const d = new Date(String(inputs.lmp || ''));
      if (isNaN(d.getTime())) return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Format: YYYY-MM-DD' };

      const edd = new Date(d.getTime() + 280 * 24 * 60 * 60 * 1000);
      const conception = new Date(d.getTime() + 14 * 24 * 60 * 60 * 1000);

      return {
        primaryValue: edd.toISOString().split('T')[0],
        primaryLabel: 'Estimated Due Date',
        subtext: `Estimated Conception: ~${conception.toISOString().split('T')[0]}`,
        breakdown: [
          { label: 'Estimated Due Date', value: edd.toISOString().split('T')[0] },
          { label: 'Approximate Conception', value: conception.toISOString().split('T')[0] },
          { label: 'End of 1st Trimester', value: new Date(d.getTime() + 84 * 86400000).toISOString().split('T')[0] },
          { label: 'End of 2nd Trimester', value: new Date(d.getTime() + 189 * 86400000).toISOString().split('T')[0] }
        ],
        steps: [`Calculated 280-day gestational horizon: ${edd.toISOString().split('T')[0]}`]
      };
    },
    formula: 'Due Date = LMP + 280 days',
    explanation: 'Provides pregnancy milestones from conception through full-term delivery.',
    howToUse: ['Enter your LMP date.', 'Click Calculate.'],
    example: { inputs: { lmp: '2026-01-15' }, output: '2026-10-22', explanation: 'Due date is October 22, 2026.' },
    faqs: [{ question: 'When does the third trimester begin?', answer: 'The third trimester starts at gestational week 28 and lasts until birth.' }],
    keywords: ['due date calculator', 'edd', 'pregnancy milestones']
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    title: 'Age Calculator',
    category: 'health-fitness',
    shortDesc: 'Compute exact chronological age in years, months, days, hours, and next birthday countdown.',
    icon: 'Calendar',
    badge: 'popular',
    fields: [
      { id: 'birthDate', label: 'Date of Birth (YYYY-MM-DD)', type: 'text', defaultValue: '1995-08-24', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => {
      const birth = new Date(String(inputs.birthDate || '').trim());
      if (isNaN(birth.getTime())) {
        return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Please enter birth date as YYYY-MM-DD.' };
      }

      const now = new Date();
      if (birth > now) {
        return { primaryValue: 'Future Date', primaryLabel: 'Result', error: 'Birth date cannot be in the future.' };
      }

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      const totalDiffMs = now.getTime() - birth.getTime();
      const totalDays = Math.floor(totalDiffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(totalDiffMs / (1000 * 60 * 60));

      // Next birthday
      let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < now) {
        nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
      }
      const daysToNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        primaryValue: `${years} Years, ${months} Months, ${days} Days`,
        primaryLabel: 'Exact Chronological Age',
        subtext: `Next birthday in ${daysToNextBday} days!`,
        breakdown: [
          { label: 'Exact Age', value: `${years} yrs, ${months} mos, ${days} days` },
          { label: 'Total Days Lived', value: `${totalDays.toLocaleString()} days` },
          { label: 'Total Hours Lived', value: `${totalHours.toLocaleString()} hours` },
          { label: 'Total Minutes Lived', value: `${(totalDays * 1440).toLocaleString()} minutes` },
          { label: 'Days until Next Birthday', value: `${daysToNextBday} days` }
        ],
        steps: [`Calculated calendar year difference: ${years} years`, `Adjusted for elapsed months and days`, `Computed total lifespan duration = ${totalDays.toLocaleString()} days`]
      };
    },
    formula: 'Age = Current Date - Date of Birth (accounting for leap years and month lengths)',
    explanation: 'Accurately calculates chronological lifespan taking into account varying month lengths and leap years.',
    howToUse: ['Enter your date of birth formatted as YYYY-MM-DD.', 'Click Calculate.'],
    example: { inputs: { birthDate: '1995-08-24' }, output: '31 Years, 0 Months, 21 Days', explanation: 'Detailed age breakdown with lifetime hours lived.' },
    faqs: [{ question: 'Does this handle leap years?', answer: 'Yes, leap years and irregular month day-counts are precisely accounted for.' }],
    keywords: ['age calculator', 'how old am i', 'birthday countdown', 'chronological age']
  },
  {
    id: 'running-pace-calculator',
    slug: 'running-pace-calculator',
    title: 'Marathon & Race Time Predictor',
    category: 'health-fitness',
    shortDesc: 'Predict 5K, 10K, Half-Marathon, and Marathon finish times using Riegel formula.',
    icon: 'Flame',
    fields: [
      { id: 'recentDistKm', label: 'Recent Race Distance (km)', type: 'number', defaultValue: 5, min: 1, step: 0.1 },
      { id: 'recentTimeMin', label: 'Recent Finish Time (Minutes)', type: 'number', defaultValue: 24, min: 5, step: 0.5 }
    ],
    calculate: (inputs) => {
      const d1 = parseFloat(inputs.recentDistKm) || 5;
      const t1 = parseFloat(inputs.recentTimeMin) || 24;

      // Pete Riegel formula: T2 = T1 × (D2 / D1)^1.06
      const predict = (d2: number) => {
        const t2Min = t1 * Math.pow(d2 / d1, 1.06);
        const h = Math.floor(t2Min / 60);
        const m = Math.floor(t2Min % 60);
        const s = Math.round((t2Min * 60) % 60);
        return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
      };

      const marathonStr = predict(42.195);
      const halfStr = predict(21.0975);
      const tenKStr = predict(10);
      const fiveKStr = predict(5);

      return {
        primaryValue: marathonStr,
        primaryLabel: 'Predicted Marathon Finish Time',
        subtext: `Half Marathon: ${halfStr} | 10K: ${tenKStr}`,
        breakdown: [
          { label: '5K Time', value: fiveKStr },
          { label: '10K Time', value: tenKStr },
          { label: 'Half Marathon (21.1 km)', value: halfStr },
          { label: 'Full Marathon (42.2 km)', value: marathonStr }
        ],
        steps: [`Applied Pete Riegel fatigue formula: T₂ = T₁ × (D₂ / D₁)^1.06`, `Extrapolated race predictions across distance milestones`]
      };
    },
    formula: 'T₂ = T₁ × (D₂ / D₁)^1.06 (Pete Riegel endurance formula)',
    explanation: 'Uses the gold-standard Pete Riegel endurance formula to predict race performance at longer or shorter distances.',
    howToUse: ['Enter a recent race distance (e.g. 5km).', 'Enter your finish time in minutes.', 'Click Calculate.'],
    example: { inputs: { recentDistKm: 5, recentTimeMin: 24 }, output: '3h 53m 12s', explanation: 'A 24-minute 5K predicts an approx 3 hour 53 min full marathon.' },
    faqs: [{ question: 'What is the Riegel formula fatigue factor?', answer: '1.06 is the standard fatigue exponent representing aerobic degradation as race distance increases.' }],
    keywords: ['race predictor', 'marathon predictor', 'riegel formula', 'running calculator']
  }
];
