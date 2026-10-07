import React from 'react';
import { X, History, Trash2, ArrowUpRight, RotateCcw } from 'lucide-react';
import { HistoryItem } from '../types/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestoreCalculation: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestoreCalculation
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Calculation History"
      >
        <div className="drawer-header">
          <div className="drawer-title">
            <History size={20} color="var(--accent-primary)" />
            <span>Calculation History ({history.length})</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {history.length > 0 && (
              <button
                className="btn btn-secondary"
                style={{ height: '32px', padding: '0 0.65rem', fontSize: '0.75rem' }}
                onClick={onClearHistory}
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
            <button className="icon-btn" onClick={onClose} aria-label="Close history">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <History size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No calculations yet</p>
              <p style={{ fontSize: '0.85rem' }}>Your recent calculation inputs and results will automatically appear here.</p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={item.id} className="drawer-item">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.calcTitle}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{dateStr}</span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {item.primaryResult}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Inputs: {Object.entries(item.inputs).map(([k, v]) => `${k}=${v}`).join(', ')}
                  </div>

                  <button
                    className="open-calc-btn"
                    style={{ alignSelf: 'flex-start', marginTop: '0.35rem', gap: '0.3rem' }}
                    onClick={() => {
                      onRestoreCalculation(item);
                      onClose();
                    }}
                  >
                    <RotateCcw size={13} /> Reuse this calculation
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
