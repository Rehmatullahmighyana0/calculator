import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--color-success)" />}
          {t.type === 'error' && <AlertCircle size={18} color="var(--color-danger)" />}
          {t.type === 'info' && <Info size={18} color="var(--color-info)" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
