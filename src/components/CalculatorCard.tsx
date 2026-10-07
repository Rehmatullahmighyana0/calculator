import React from 'react';
import { Heart, ArrowUpRight, Calculator, Sparkles } from 'lucide-react';
import { CalculatorDef } from '../types/calculator';

interface CalculatorCardProps {
  calc: CalculatorDef;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (slug: string) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calc,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  const handleCardClick = () => {
    onSelect(calc.slug);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(calc.id);
  };

  return (
    <div
      className="calc-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Open ${calc.title}`}
    >
      <div className="calc-card-top">
        <div className="calc-card-icon">
          <Calculator size={20} />
        </div>
        <div className="calc-card-actions">
          {calc.badge && (
            <span className={`badge ${calc.badge === 'popular' ? 'badge-popular' : 'badge-featured'}`}>
              {calc.badge}
            </span>
          )}
          <button
            className={`calc-favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'currentColor'} />
          </button>
        </div>
      </div>

      <h3 className="calc-card-title">{calc.title}</h3>
      <p className="calc-card-desc">{calc.shortDesc}</p>

      <div className="calc-card-footer">
        <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
          {calc.category.replace('-', ' & ')}
        </span>
        <span className="open-calc-btn">
          Open Calculator <ArrowUpRight size={16} />
        </span>
      </div>
    </div>
  );
};
