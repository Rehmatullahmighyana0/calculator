import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ALL_CALCULATORS, searchCalculators } from '../data/calculators';
import { CalculatorDef } from '../types/calculator';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculatorDef[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setResults(ALL_CALCULATORS.slice(0, 8)); // Popular default preview
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(ALL_CALCULATORS.filter((c) => c.badge === 'popular').slice(0, 8));
    } else {
      const matches = searchCalculators(query);
      setResults(matches.slice(0, 15));
    }
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation: Escape, ArrowUp, ArrowDown, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectCalculator(results[selectedIndex].slug);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectCalculator]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search all calculators"
      >
        <div className="modal-search-header">
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            className="modal-search-input"
            placeholder="Search by name, category, or keywords (e.g. loan, bmi, matrix, hex)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="icon-btn" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        <div className="modal-results-list">
          {results.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No calculators found matching "{query}". Try a different keyword!
            </div>
          ) : (
            results.map((calc, idx) => (
              <div
                key={calc.id}
                className={`modal-result-item ${selectedIndex === idx ? 'selected' : ''}`}
                onClick={() => {
                  onSelectCalculator(calc.slug);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'var(--accent-primary-light)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Calculator size={16} />
                  </div>
                  <div>
                    <div className="modal-result-title">{calc.title}</div>
                    <div className="modal-result-cat">
                      {calc.category.replace('-', ' & ')} • {calc.shortDesc}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {calc.badge && <span className="badge badge-popular">{calc.badge}</span>}
                  <CornerDownLeft size={16} color="var(--text-muted)" />
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Use ↑ ↓ to navigate, Enter to select, Esc to close</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
