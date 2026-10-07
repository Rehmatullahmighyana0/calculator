const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'bmi-calculator': (inputs) => {
    const unit = inputs.unit || 'metric';
    const weight = toNum(inputs.weight, 70);
    const height = toNum(inputs.height, 175);

    if (weight <= 0 || height <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Weight and height must be positive.' };

    let bmi = 0;
    let healthyWeightMin = 0;
    let healthyWeightMax = 0;

    if (unit === 'imperial') {
      // Weight in lbs, height in inches
      bmi = (weight / (height * height)) * 703;
      healthyWeightMin = (18.5 * height * height) / 703;
      healthyWeightMax = (24.9 * height * height) / 703;
    } else {
      // Weight in kg, height in cm
      const hm = height / 100;
      bmi = weight / (hm * hm);
      healthyWeightMin = 18.5 * hm * hm;
      healthyWeightMax = 24.9 * hm * hm;
    }

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight (Healthy)';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obesity';

    return {
      primaryValue: formatNum(bmi, 1),
      primaryLabel: `BMI (${category})`,
      subtext: `Healthy weight range: ${formatNum(healthyWeightMin, 1)} - ${formatNum(healthyWeightMax, 1)} ${unit === 'imperial' ? 'lbs' : 'kg'}`,
      breakdown: [
        { label: 'Weight', value: `${formatNum(weight)} ${unit === 'imperial' ? 'lbs' : 'kg'}` },
        { label: 'Height', value: `${formatNum(height)} ${unit === 'imperial' ? 'in' : 'cm'}` },
        { label: 'Calculated BMI', value: formatNum(bmi, 2) },
        { label: 'WHO Category', value: category },
        { label: 'Normal BMI Target', value: '18.5 - 24.9' }
      ],
      steps: [
        unit === 'metric'
          ? `Height in meters: ${height} cm / 100 = ${height / 100} m`
          : `Applied imperial multiplier 703`,
        unit === 'metric'
          ? `BMI = weight / (height)² = ${weight} / (${height / 100})² = ${formatNum(bmi, 1)}`
          : `BMI = (${weight} / ${height}²) × 703 = ${formatNum(bmi, 1)}`,
        `Classification: ${category}`
      ]
    };
  },

  'bmr-calculator': (inputs) => {
    const gender = inputs.gender || 'male';
    const age = toNum(inputs.age, 28);
    const weightKg = toNum(inputs.weightKg, 75);
    const heightCm = toNum(inputs.heightCm, 178);

    if (age <= 0 || weightKg <= 0 || heightCm <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Age, weight, and height must be positive.' };

    // Mifflin-St Jeor Equation
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'male' ? 5 : -161;

    return {
      primaryValue: `${Math.round(bmr).toLocaleString('en-US')} kcal/day`,
      primaryLabel: 'Basal Metabolic Rate (BMR)',
      subtext: `Calories burned at complete physical rest`,
      breakdown: [
        { label: 'Gender & Age', value: `${gender.toUpperCase()}, ${age} years` },
        { label: 'Body Metrics', value: `${weightKg} kg, ${heightCm} cm` },
        { label: 'BMR (Mifflin-St Jeor)', value: `${Math.round(bmr)} kcal / day` },
        { label: 'Sedentary Maintenance (1.2×)', value: `${Math.round(bmr * 1.2)} kcal` },
        { label: 'Moderate Active (1.55×)', value: `${Math.round(bmr * 1.55)} kcal` }
      ],
      steps: [
        `Mifflin-St Jeor Formula applied for ${gender}:`,
        gender === 'male'
          ? `BMR = 10(${weightKg}) + 6.25(${heightCm}) - 5(${age}) + 5`
          : `BMR = 10(${weightKg}) + 6.25(${heightCm}) - 5(${age}) - 161`,
        `Daily Resting Caloric Burn = ${Math.round(bmr)} kcal`
      ]
    };
  },

  'tdee-calculator': (inputs) => {
    const gender = inputs.gender || 'male';
    const age = toNum(inputs.age, 30);
    const weightKg = toNum(inputs.weightKg, 78);
    const heightCm = toNum(inputs.heightCm, 180);
    const act = inputs.activity || 'moderate';

    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);

    const mults = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const factor = mults[act] || 1.55;
    const tdee = bmr * factor;

    return {
      primaryValue: `${Math.round(tdee).toLocaleString('en-US')} kcal/day`,
      primaryLabel: 'Total Daily Energy Expenditure (TDEE)',
      subtext: `Maintenance calories to maintain current weight of ${weightKg} kg`,
      breakdown: [
        { label: 'Base BMR', value: `${Math.round(bmr)} kcal` },
        { label: 'Activity Level', value: act.replace(/_/g, ' ') },
        { label: 'Activity Multiplier', value: `${factor}×` },
        { label: 'Maintenance TDEE', value: `${Math.round(tdee)} kcal / day` },
        { label: 'Fat Loss (-500 kcal)', value: `${Math.round(tdee - 500)} kcal / day` },
        { label: 'Muscle Gain (+300 kcal)', value: `${Math.round(tdee + 300)} kcal / day` }
      ],
      steps: [
        `Computed Base Metabolic Rate (BMR): ${Math.round(bmr)} kcal`,
        `Applied activity multiplier: ${Math.round(bmr)} × ${factor} = ${Math.round(tdee)} kcal/day`
      ]
    };
  },

  'calorie-calculator': (inputs) => {
    const tdee = toNum(inputs.tdee, 2400);
    const goal = inputs.goal || 'moderate_loss';

    let target = tdee;
    let label = 'Weight Maintenance';
    if (goal === 'mild_loss') { target = tdee - 250; label = 'Mild Weight Loss (0.25 kg/wk)'; }
    else if (goal === 'moderate_loss') { target = tdee - 500; label = 'Weight Loss (0.5 kg/wk)'; }
    else if (goal === 'extreme_loss') { target = tdee - 1000; label = 'Fast Weight Loss (1 kg/wk)'; }
    else if (goal === 'mild_gain') { target = tdee + 250; label = 'Mild Weight Gain (+0.25 kg/wk)'; }
    else if (goal === 'gain') { target = tdee + 500; label = 'Muscle Building Gain (+0.5 kg/wk)'; }

    return {
      primaryValue: `${Math.round(target).toLocaleString('en-US')} kcal/day`,
      primaryLabel: `Daily Target (${label})`,
      subtext: `TDEE Baseline: ${Math.round(tdee)} kcal | Deficit/Surplus: ${Math.round(target - tdee)} kcal`,
      breakdown: [
        { label: 'Maintenance TDEE', value: `${Math.round(tdee)} kcal` },
        { label: 'Fitness Goal', value: label },
        { label: 'Recommended Calorie Intake', value: `${Math.round(target)} kcal / day` }
      ],
      steps: [
        `Base maintenance energy: ${Math.round(tdee)} kcal`,
        `Adjusted for goal (${label}): ${Math.round(target - tdee) >= 0 ? '+' : ''}${Math.round(target - tdee)} kcal`,
        `Prescribed target = ${Math.round(target)} kcal / day`
      ]
    };
  },

  'ideal-weight-calculator': (inputs) => {
    const gender = inputs.gender || 'male';
    const heightCm = toNum(inputs.heightCm, 175);

    const heightInches = heightCm / 2.54;
    const over5ft = Math.max(0, heightInches - 60);

    // Devine formula
    const devine = gender === 'male' ? 50 + 2.3 * over5ft : 45.5 + 2.3 * over5ft;
    // Robinson formula
    const robinson = gender === 'male' ? 52 + 1.9 * over5ft : 49 + 1.7 * over5ft;
    // Miller formula
    const miller = gender === 'male' ? 56.2 + 1.41 * over5ft : 53.1 + 1.36 * over5ft;

    const avgIdeal = (devine + robinson + miller) / 3;

    return {
      primaryValue: `${formatNum(avgIdeal, 1)} kg (${formatNum(avgIdeal * 2.20462, 1)} lbs)`,
      primaryLabel: `Ideal Body Weight (Height: ${heightCm} cm)`,
      subtext: `Composite consensus across Devine, Robinson & Miller medical equations`,
      breakdown: [
        { label: 'Devine Formula (1974)', value: `${formatNum(devine, 1)} kg (${formatNum(devine * 2.20462, 1)} lbs)` },
        { label: 'Robinson Formula (1983)', value: `${formatNum(robinson, 1)} kg (${formatNum(robinson * 2.20462, 1)} lbs)` },
        { label: 'Miller Formula (1983)', value: `${formatNum(miller, 1)} kg (${formatNum(miller * 2.20462, 1)} lbs)` },
        { label: 'Healthy BMI Weight Range (18.5-24.9)', value: `${formatNum(18.5 * Math.pow(heightCm / 100, 2), 1)} - ${formatNum(24.9 * Math.pow(heightCm / 100, 2), 1)} kg` }
      ],
      steps: [
        `Height in inches: ${formatNum(heightInches, 1)} in (${formatNum(over5ft, 1)} inches over 5 ft)`,
        `Devine: ${gender === 'male' ? '50kg + 2.3kg/in' : '45.5kg + 2.3kg/in'} = ${formatNum(devine, 1)} kg`,
        `Average consensus ideal body weight = ${formatNum(avgIdeal, 1)} kg`
      ]
    };
  },

  'body-fat-calculator': (inputs) => {
    const gender = inputs.gender || 'male';
    const weightKg = toNum(inputs.weightKg, 78);
    const heightCm = toNum(inputs.heightCm, 178);
    const neckCm = toNum(inputs.neckCm, 38);
    const waistCm = toNum(inputs.waistCm, 84);
    const hipCm = toNum(inputs.hipCm, 95);

    let bodyFatPct = 0;
    if (gender === 'male') {
      const diff = waistCm - neckCm;
      if (diff <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Waist circumference must exceed neck circumference.' };
      bodyFatPct = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      const diff = waistCm + hipCm - neckCm;
      if (diff <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Waist + Hip must exceed neck circumference.' };
      bodyFatPct = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(heightCm)) - 450;
    }

    bodyFatPct = Math.max(3, Math.min(60, bodyFatPct));
    const fatMass = weightKg * (bodyFatPct / 100);
    const leanMass = weightKg - fatMass;

    return {
      primaryValue: `${formatNum(bodyFatPct, 1)}%`,
      primaryLabel: 'Estimated Body Fat Percentage',
      subtext: `Fat Mass: ${formatNum(fatMass, 1)} kg | Lean Mass: ${formatNum(leanMass, 1)} kg`,
      breakdown: [
        { label: 'Body Fat (%)', value: `${formatNum(bodyFatPct, 1)}%` },
        { label: 'Fat Mass', value: `${formatNum(fatMass, 1)} kg` },
        { label: 'Lean Body Mass', value: `${formatNum(leanMass, 1)} kg` },
        { label: 'Total Weight', value: `${formatNum(weightKg)} kg` }
      ],
      steps: [
        `Circumference method equation applied for ${gender}`,
        `Calculated Body Fat = ${formatNum(bodyFatPct, 1)}%`,
        `Fat Mass = ${weightKg} × ${formatNum(bodyFatPct / 100, 3)} = ${formatNum(fatMass, 1)} kg`
      ]
    };
  },

  'lean-body-mass-calculator': (inputs) => {
    const gender = inputs.gender || 'male';
    const weight = toNum(inputs.weightKg, 80);
    const height = toNum(inputs.heightCm, 180);

    // Boer formula
    const lbmBoer = gender === 'male'
      ? 0.407 * weight + 0.267 * height - 19.2
      : 0.252 * weight + 0.473 * height - 48.3;

    // James formula
    const lbmJames = gender === 'male'
      ? 1.1 * weight - 128 * Math.pow(weight / height, 2)
      : 1.07 * weight - 148 * Math.pow(weight / height, 2);

    const avgLbm = Math.max(0, (lbmBoer + lbmJames) / 2);
    const fatMass = Math.max(0, weight - avgLbm);

    return {
      primaryValue: `${formatNum(avgLbm, 1)} kg`,
      primaryLabel: 'Lean Body Mass (LBM)',
      subtext: `Fat Mass: ${formatNum(fatMass, 1)} kg (${formatNum((fatMass / weight) * 100, 1)}% fat)`,
      breakdown: [
        { label: 'Total Body Weight', value: `${formatNum(weight)} kg` },
        { label: 'Lean Body Mass', value: `${formatNum(avgLbm, 1)} kg` },
        { label: 'Fat Mass', value: `${formatNum(fatMass, 1)} kg` },
        { label: 'Boer Formula LBM', value: `${formatNum(lbmBoer, 1)} kg` },
        { label: 'James Formula LBM', value: `${formatNum(lbmJames, 1)} kg` }
      ],
      steps: [
        `Boer Formula: ${formatNum(lbmBoer, 1)} kg`,
        `James Formula: ${formatNum(lbmJames, 1)} kg`,
        `Consensus Lean Body Mass = ${formatNum(avgLbm, 1)} kg`
      ]
    };
  },

  'macro-calculator': (inputs) => {
    const calories = toNum(inputs.calories, 2200);
    const diet = inputs.dietType || 'balanced';

    // Ratios (protein, carbs, fat)
    let pPct = 0.30;
    let cPct = 0.40;
    let fPct = 0.30;

    if (diet === 'low_carb') { pPct = 0.40; cPct = 0.20; fPct = 0.40; }
    else if (diet === 'keto') { pPct = 0.25; cPct = 0.05; fPct = 0.70; }
    else if (diet === 'high_carb') { pPct = 0.25; cPct = 0.55; fPct = 0.20; }

    const pGrams = (calories * pPct) / 4;
    const cGrams = (calories * cPct) / 4;
    const fGrams = (calories * fPct) / 9;

    return {
      primaryValue: `${Math.round(pGrams)}g P | ${Math.round(cGrams)}g C | ${Math.round(fGrams)}g F`,
      primaryLabel: `Macronutrient Split (${diet.replace(/_/g, ' ')})`,
      subtext: `Based on daily target of ${calories.toLocaleString('en-US')} kcal`,
      breakdown: [
        { label: 'Protein (4 kcal/g)', value: `${Math.round(pGrams)}g (${Math.round(pPct * 100)}% = ${Math.round(calories * pPct)} kcal)` },
        { label: 'Carbohydrates (4 kcal/g)', value: `${Math.round(cGrams)}g (${Math.round(cPct * 100)}% = ${Math.round(calories * cPct)} kcal)` },
        { label: 'Fats (9 kcal/g)', value: `${Math.round(fGrams)}g (${Math.round(fPct * 100)}% = ${Math.round(calories * fPct)} kcal)` },
        { label: 'Total Caloric Sum', value: `${calories} kcal` }
      ],
      steps: [
        `Protein: (${calories} × ${Math.round(pPct * 100)}%) / 4 kcal = ${Math.round(pGrams)} g`,
        `Carbs: (${calories} × ${Math.round(cPct * 100)}%) / 4 kcal = ${Math.round(cGrams)} g`,
        `Fat: (${calories} × ${Math.round(fPct * 100)}%) / 9 kcal = ${Math.round(fGrams)} g`
      ]
    };
  },

  'protein-calculator': (inputs) => {
    const weight = toNum(inputs.weightKg, 75);
    const goal = inputs.goal || 'muscle_building';

    let multiplier = 1.8;
    let label = 'Muscle Hypertrophy';
    if (goal === 'sedentary') { multiplier = 0.8; label = 'Sedentary Minimum'; }
    else if (goal === 'endurance') { multiplier = 1.4; label = 'Endurance Athlete'; }
    else if (goal === 'fat_loss') { multiplier = 2.2; label = 'Fat Loss & Muscle Preservation'; }

    const proteinGrams = weight * multiplier;

    return {
      primaryValue: `${Math.round(proteinGrams)} g / day`,
      primaryLabel: `Daily Protein Target (${label})`,
      subtext: `${multiplier} g protein per kg of bodyweight (${weight} kg)`,
      breakdown: [
        { label: 'Body Weight', value: `${weight} kg (${formatNum(weight * 2.20462, 1)} lbs)` },
        { label: 'Target Objective', value: label },
        { label: 'Prescribed Ratio', value: `${multiplier} g / kg` },
        { label: 'Total Daily Protein', value: `${Math.round(proteinGrams)} g (${Math.round(proteinGrams * 4)} kcal)` }
      ],
      steps: [
        `Formula: Daily Protein = Bodyweight (kg) × Goal Multiplier`,
        `${weight} kg × ${multiplier} g/kg = ${Math.round(proteinGrams)} grams per day`
      ]
    };
  },

  'water-intake-calculator': (inputs) => {
    const weight = toNum(inputs.weightKg, 70);
    const exerciseMins = toNum(inputs.exerciseMinutes, 45);
    const climate = inputs.climate || 'moderate';

    let baseLiters = weight * 0.035;
    baseLiters += (exerciseMins / 30) * 0.35;
    if (climate === 'hot') baseLiters += 0.5;

    const ounces = baseLiters * 33.814;
    const glasses = baseLiters / 0.25; // 250ml glass

    return {
      primaryValue: `${formatNum(baseLiters, 2)} Liters / day`,
      primaryLabel: 'Recommended Daily Water Intake',
      subtext: `≈ ${Math.round(ounces)} fl oz (around ${Math.round(glasses)} glasses of 250ml)`,
      breakdown: [
        { label: 'Weight Baseline', value: `${formatNum(weight * 0.035, 2)} L` },
        { label: 'Exercise Sweat Offset', value: `+${formatNum((exerciseMins / 30) * 0.35, 2)} L (${exerciseMins} mins)` },
        { label: 'Climate Offset', value: climate === 'hot' ? '+0.50 L (Hot environment)' : '0.00 L (Moderate)' },
        { label: 'Total Recommended Volume', value: `${formatNum(baseLiters, 2)} L (${Math.round(ounces)} oz)` }
      ],
      steps: [
        `Base hydration: ${weight} kg × 35 ml = ${formatNum(weight * 0.035, 2)} Liters`,
        `Exercise addition: ${exerciseMins} mins = +${formatNum((exerciseMins / 30) * 0.35, 2)} L`,
        `Total Daily Water Intake = ${formatNum(baseLiters, 2)} Liters`
      ]
    };
  },

  'heart-rate-calculator': (inputs) => {
    const age = toNum(inputs.age, 32);
    const restingHR = toNum(inputs.restingHR, 65);

    const maxHR = 220 - age;
    const hrr = maxHR - restingHR; // Heart Rate Reserve (Karvonen)

    // Zones (50%, 60%, 70%, 80%, 90%)
    const z1 = Math.round(restingHR + hrr * 0.50);
    const z2 = Math.round(restingHR + hrr * 0.60);
    const z3 = Math.round(restingHR + hrr * 0.70);
    const z4 = Math.round(restingHR + hrr * 0.80);
    const z5 = Math.round(restingHR + hrr * 0.90);

    return {
      primaryValue: `${maxHR} bpm`,
      primaryLabel: 'Estimated Max Heart Rate (MHR)',
      subtext: `Aerobic Cardio Target (Zone 3): ${z3} - ${z4} bpm`,
      breakdown: [
        { label: 'Age', value: `${age} years` },
        { label: 'Resting Heart Rate', value: `${restingHR} bpm` },
        { label: 'Maximum Heart Rate (220 - Age)', value: `${maxHR} bpm` },
        { label: 'Zone 1 (Warm up, 50-60%)', value: `${z1} - ${z2} bpm` },
        { label: 'Zone 2 (Fat Burn / Base, 60-70%)', value: `${z2} - ${z3} bpm` },
        { label: 'Zone 3 (Aerobic Cardio, 70-80%)', value: `${z3} - ${z4} bpm` },
        { label: 'Zone 4 (Anaerobic Threshold, 80-90%)', value: `${z4} - ${z5} bpm` },
        { label: 'Zone 5 (Max VO2 Output, 90-100%)', value: `${z5} - ${maxHR} bpm` }
      ],
      steps: [
        `Max Heart Rate = 220 - ${age} = ${maxHR} bpm`,
        `Heart Rate Reserve (HRR) = ${maxHR} - ${restingHR} = ${hrr} bpm`,
        `Computed Karvonen zones across exercise intensities`
      ]
    };
  },

  'pace-calculator': (inputs) => {
    const dist = toNum(inputs.distanceKm, 10);
    const hours = toNum(inputs.hours, 0);
    const mins = toNum(inputs.minutes, 50);
    const secs = toNum(inputs.seconds, 0);

    const totalSeconds = hours * 3600 + mins * 60 + secs;
    if (dist <= 0 || totalSeconds <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Distance and time must be greater than zero.' };

    const secPerKm = totalSeconds / dist;
    const paceMinKm = Math.floor(secPerKm / 60);
    const paceSecKm = Math.round(secPerKm % 60);

    const distMiles = dist * 0.621371;
    const secPerMile = totalSeconds / distMiles;
    const paceMinMile = Math.floor(secPerMile / 60);
    const paceSecMile = Math.round(secPerMile % 60);

    const speedKmh = (dist / (totalSeconds / 3600));

    return {
      primaryValue: `${paceMinKm}:${paceSecKm < 10 ? '0' : ''}${paceSecKm} / km`,
      primaryLabel: 'Running Pace per Kilometer',
      subtext: `Per Mile: ${paceMinMile}:${paceSecMile < 10 ? '0' : ''}${paceSecMile} / mi | Speed: ${formatNum(speedKmh, 2)} km/h`,
      breakdown: [
        { label: 'Distance', value: `${dist} km (${formatNum(distMiles, 2)} miles)` },
        { label: 'Total Time', value: `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}s` },
        { label: 'Pace (per km)', value: `${paceMinKm}:${paceSecKm < 10 ? '0' : ''}${paceSecKm} min/km` },
        { label: 'Pace (per mile)', value: `${paceMinMile}:${paceSecMile < 10 ? '0' : ''}${paceSecMile} min/mile` },
        { label: 'Average Speed', value: `${formatNum(speedKmh, 2)} km/h (${formatNum(speedKmh * 0.621371, 2)} mph)` }
      ],
      steps: [
        `Total duration = ${totalSeconds} seconds`,
        `Seconds per km = ${totalSeconds} / ${dist} = ${formatNum(secPerKm, 1)} seconds`,
        `Pace = ${paceMinKm} minutes and ${paceSecKm} seconds per km`
      ]
    };
  },

  'pregnancy-calculator': (inputs) => {
    const lmpStr = String(inputs.lmpDate || '2026-03-01').trim();
    const lmp = new Date(lmpStr);

    if (isNaN(lmp.getTime())) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid Last Menstrual Period date (YYYY-MM-DD).' };
    }

    // Naegele's rule: LMP + 280 days
    const due = new Date(lmp.getTime() + 280 * 24 * 3600 * 1000);
    const today = new Date();
    const elapsedDays = Math.max(0, Math.floor((today - lmp) / (24 * 3600 * 1000)));
    const weeks = Math.floor(elapsedDays / 7);
    const days = elapsedDays % 7;

    let trimester = 'First Trimester (Weeks 1 - 12)';
    if (weeks >= 27) trimester = 'Third Trimester (Weeks 27 - 40)';
    else if (weeks >= 13) trimester = 'Second Trimester (Weeks 13 - 26)';

    const dueDateFormatted = due.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return {
      primaryValue: dueDateFormatted,
      primaryLabel: 'Estimated Due Date (EDD)',
      subtext: `Gestational Age: ${weeks} weeks, ${days} days | ${trimester}`,
      breakdown: [
        { label: 'Last Menstrual Period (LMP)', value: lmp.toISOString().split('T')[0] },
        { label: 'Estimated Due Date (EDD)', value: dueDateFormatted },
        { label: 'Current Gestational Age', value: `${weeks} weeks + ${days} days` },
        { label: 'Current Trimester', value: trimester },
        { label: 'Total Pregnancy Progress', value: `${Math.min(100, Math.round((elapsedDays / 280) * 100))}%` }
      ],
      steps: [
        `Applied standard Naegele's Rule: LMP date + 280 calendar days`,
        `Estimated Date of Delivery = ${dueDateFormatted}`,
        `Current Gestational Stage: ${weeks}w ${days}d (${trimester})`
      ]
    };
  },

  'age-calculator': (inputs) => {
    const birthStr = String(inputs.birthDate || '1995-08-24').trim();
    const birth = new Date(birthStr);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid past birth date.' };
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

    const diffMs = now - birth;
    const totalDays = Math.floor(diffMs / (24 * 3600 * 1000));
    const totalHours = Math.floor(diffMs / (3600 * 1000));

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    const daysUntilNext = Math.ceil((nextBday - now) / (24 * 3600 * 1000));

    return {
      primaryValue: `${years} years, ${months} months, ${days} days`,
      primaryLabel: 'Exact Chronological Age',
      subtext: `Total Days Lived: ${totalDays.toLocaleString('en-US')} | Next Birthday in: ${daysUntilNext} days`,
      breakdown: [
        { label: 'Exact Age', value: `${years} yrs, ${months} mos, ${days} days` },
        { label: 'Total Days', value: `${totalDays.toLocaleString('en-US')} days` },
        { label: 'Total Hours Lived', value: `${totalHours.toLocaleString('en-US')} hours` },
        { label: 'Days to Next Birthday', value: `${daysUntilNext} days` }
      ],
      steps: [
        `Computed chronological delta from ${birth.toISOString().split('T')[0]} to today`,
        `Calculated calendar month and day offsets`,
        `Exact age: ${years} years, ${months} months, ${days} days`
      ]
    };
  },

  'running-pace-calculator': (inputs) => {
    const dist = toNum(inputs.recentDistKm, 5);
    const timeMin = toNum(inputs.recentTimeMin, 24);

    if (dist <= 0 || timeMin <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Recent distance and time must be positive.' };

    // Pete Riegel formula: T2 = T1 × (D2 / D1)^1.06
    const predictTime = (targetDist) => {
      const predMins = timeMin * Math.pow(targetDist / dist, 1.06);
      const h = Math.floor(predMins / 60);
      const m = Math.floor(predMins % 60);
      const s = Math.round((predMins * 60) % 60);
      return `${h > 0 ? h + 'h ' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
    };

    const pred10k = predictTime(10);
    const predHalf = predictTime(21.0975);
    const predMarathon = predictTime(42.195);

    return {
      primaryValue: predMarathon,
      primaryLabel: 'Predicted Marathon Finish Time',
      subtext: `Based on your ${dist} km time of ${timeMin} minutes (Riegel Formula)`,
      breakdown: [
        { label: 'Recent Performance', value: `${dist} km in ${timeMin} mins` },
        { label: 'Predicted 10K', value: pred10k },
        { label: 'Predicted Half Marathon (21.1 km)', value: predHalf },
        { label: 'Predicted Full Marathon (42.2 km)', value: predMarathon }
      ],
      steps: [
        `Applied Pete Riegel fatigue formula: T₂ = T₁ × (D₂ / D₁)^1.06`,
        `Extrapolated aerobic endurance and race pace scaling`,
        `Predicted Marathon Time: ${predMarathon}`
      ]
    };
  }
};

module.exports = engines;

