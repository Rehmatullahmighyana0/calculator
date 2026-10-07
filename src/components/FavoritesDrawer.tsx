import React from 'react';
import { X, Heart, Trash2, ArrowUpRight, Calculator } from 'lucide-react';
import { ALL_CALCULATORS, CALCULATORS_BY_ID } from '../data/calculators';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onRemoveFavorite: (id: string) => void;
  onSelectCalculator: (slug: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectCalculator
}) => {
  if (!isOpen) return null;

  const favoriteCalcs = favorites
    .map((id) => CALCULATORS_BY_ID.get(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Favorite Calculators"
      >
        <div className="drawer-header">
          <div className="drawer-title">
            <Heart size={20} color="#ef4444" fill="#ef4444" />
            <span>Saved Favorites ({favorites.length})</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close favorites">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {favoriteCalcs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Heart size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No favorites saved yet</p>
              <p style={{ fontSize: '0.85rem' }}>Click the heart icon on any calculator to bookmark it here for fast access.</p>
            </div>
          ) : (
            favoriteCalcs.map((calc) => (
              <div key={calc.id} className="drawer-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{calc.title}</span>
                  <button
                    className="calc-favorite-btn active"
                    onClick={() => onRemoveFavorite(calc.id)}
                    title="Remove from favorites"
                    aria-label="Remove favorite"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {calc.shortDesc}
                </span>
                <button
                  className="open-calc-btn"
                  style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                  onClick={() => {
                    onSelectCalculator(calc.slug);
                    onClose();
                  }}
                >
                  Open Calculator <ArrowUpRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
