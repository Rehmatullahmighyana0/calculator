import React from 'react';
import {
  Calculator,
  Sigma,
  Shapes,
  CircleDollarSign,
  HeartPulse,
  Clock,
  ArrowLeftRight,
  Hammer,
  Zap,
  Atom,
  FlaskConical,
  BarChart2,
  Cpu,
  Timer,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Category } from '../types/calculator';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onSelect: (catId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Calculator: <Calculator size={22} />,
  Sigma: <Sigma size={22} />,
  Shapes: <Shapes size={22} />,
  CircleDollarSign: <CircleDollarSign size={22} />,
  HeartPulse: <HeartPulse size={22} />,
  Clock: <Clock size={22} />,
  ArrowLeftRight: <ArrowLeftRight size={22} />,
  Hammer: <Hammer size={22} />,
  Zap: <Zap size={22} />,
  Atom: <Atom size={22} />,
  FlaskConical: <FlaskConical size={22} />,
  BarChart2: <BarChart2 size={22} />,
  Cpu: <Cpu size={22} />,
  Timer: <Timer size={22} />,
  Briefcase: <Briefcase size={22} />
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onSelect }) => {
  return (
    <div
      className={`category-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(category.id);
        }
      }}
      aria-label={`${category.name} category (${category.count} calculators)`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="category-icon-wrap">
          {iconMap[category.icon] || <Calculator size={22} />}
        </div>
        {category.badge && <span className="badge badge-primary">{category.badge}</span>}
      </div>

      <h3 className="category-name">{category.name}</h3>
      <p className="category-desc">{category.description}</p>

      <div className="category-count">
        <span>{category.count} Calculators</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
};
