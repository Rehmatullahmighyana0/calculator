import { CalculatorDef, CategoryId } from '../../types/calculator';
import { basicEverydayCalculators } from './basicEveryday';
import { mathCalculators } from './math';
import { geometryCalculators } from './geometry';
import { financeCalculators } from './finance';
import { healthFitnessCalculators } from './healthFitness';
import { dateTimeCalculators } from './dateTime';
import { unitConverters } from './unitConverters';
import { constructionCalculators } from './construction';
import { electricalCalculators } from './electrical';
import { physicsCalculators } from './physics';
import { chemistryCalculators } from './chemistry';
import { statisticsCalculators } from './statistics';
import { dataComputerCalculators } from './dataComputer';
import { timeProductivityCalculators } from './timeProductivity';
import { businessCalculators } from './business';

export const ALL_CALCULATORS: CalculatorDef[] = [
  ...basicEverydayCalculators,
  ...mathCalculators,
  ...geometryCalculators,
  ...financeCalculators,
  ...healthFitnessCalculators,
  ...dateTimeCalculators,
  ...unitConverters,
  ...constructionCalculators,
  ...electricalCalculators,
  ...physicsCalculators,
  ...chemistryCalculators,
  ...statisticsCalculators,
  ...dataComputerCalculators,
  ...timeProductivityCalculators,
  ...businessCalculators
];

// Map lookup by ID or slug
export const CALCULATORS_BY_ID = new Map<string, CalculatorDef>();
ALL_CALCULATORS.forEach((calc) => {
  CALCULATORS_BY_ID.set(calc.id, calc);
  CALCULATORS_BY_ID.set(calc.slug, calc);
});

// Group by category
export const CALCULATORS_BY_CATEGORY = new Map<CategoryId, CalculatorDef[]>();
ALL_CALCULATORS.forEach((calc) => {
  const existing = CALCULATORS_BY_CATEGORY.get(calc.category) || [];
  existing.push(calc);
  CALCULATORS_BY_CATEGORY.set(calc.category, existing);
});

// Search across titles, categories, descriptions, and keywords
export const searchCalculators = (query: string): CalculatorDef[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return ALL_CALCULATORS.filter((calc) => {
    return (
      calc.title.toLowerCase().includes(q) ||
      calc.category.toLowerCase().includes(q) ||
      calc.shortDesc.toLowerCase().includes(q) ||
      (calc.keywords && calc.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });
};

export const getPopularCalculators = (limit = 12): CalculatorDef[] => {
  return ALL_CALCULATORS.filter((c) => c.badge === 'popular').slice(0, limit);
};

export const getFeaturedCalculators = (limit = 6): CalculatorDef[] => {
  const featured = ALL_CALCULATORS.filter((c) => c.badge === 'featured' || c.badge === 'popular');
  return featured.slice(0, limit);
};

export const getRelatedCalculators = (currentCalc: CalculatorDef, limit = 4): CalculatorDef[] => {
  const sameCategory = (CALCULATORS_BY_CATEGORY.get(currentCalc.category) || []).filter(
    (c) => c.id !== currentCalc.id
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const remaining = ALL_CALCULATORS.filter(
    (c) => c.id !== currentCalc.id && !sameCategory.some((sc) => sc.id === c.id)
  );
  return [...sameCategory, ...remaining].slice(0, limit);
};
