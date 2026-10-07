import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  Percent,
  Activity,
  Calendar,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { CalculatorDef, CalculatorResult } from '../types/calculator';
import { CALCULATORS_BY_ID } from '../data/calculators';
import { copyToClipboard } from '../utils/share';

interface HomeQuickCalculatorProps {
  onSelectCalculator: (slug: string) => void;
  onSaveHistory: (
    calcId: string,
    calcSlug: string,
    calcTitle: string,
    inputs: Record<string, any>,
    primaryResult: string
  ) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const FEATURED_TABS = [
  { id: 'basic-calculator', label: 'Basic Calculator', icon: CalcIcon },
  { id: 'percentage-calculator', label: 'Percentage Calculator', icon: Percent },
  { id: 'bmi-calculator', label: 'BMI Calculator', icon: Activity },
  { id: 'age-calculator', label: 'Age Calculator', icon: Calendar }
];

export const HomeQuickCalculator: React.FC<HomeQuickCalculatorProps> = ({
  onSelectCalculator,
  onSaveHistory,
  onShowToast
}) => {
  const [activeTabId, setActiveTabId] = useState<string>('basic-calculator');
  const [calcDef, setCalcDef] = useState<CalculatorDef>(() => {
    return CALCULATORS_BY_ID.get('basic-calculator')!;
  });

  // Form values for active calculator
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    const def = CALCULATORS_BY_ID.get('basic-calculator');
    if (def) {
      def.fields.forEach((f) => {
        initial[f.id] = f.defaultValue;
      });
    }
    return initial;
  });

  // Result state
  const [result, setResult] = useState<CalculatorResult>(() => {
    const def = CALCULATORS_BY_ID.get('basic-calculator');
    return def ? def.calculate(formValues) : { primaryValue: '0', primaryLabel: 'Result' };
  });

  const [copied, setCopied] = useState(false);

  // Switch active calculator tab
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    const def = CALCULATORS_BY_ID.get(tabId);
    if (def) {
      setCalcDef(def);
      const defaults: Record<string, any> = {};
      def.fields.forEach((f) => {
        defaults[f.id] = f.defaultValue;
      });
      setFormValues(defaults);
      const res = def.calculate(defaults);
      setResult(res);
      setCopied(false);
    }
  };

  // Handle Input Changes with instant live calculation
  const handleFieldChange = (fieldId: string, value: any) => {
    const updated = {
      ...formValues,
      [fieldId]: value
    };
    setFormValues(updated);
    if (calcDef) {
      const res = calcDef.calculate(updated);
      setResult(res);
    }
  };

  // Handle Explicit "Calculate" Button Click / Form Submit
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!calcDef) return;
    const res = calcDef.calculate(formValues);
    setResult(res);

    if (!res.error) {
      onSaveHistory(calcDef.id, calcDef.slug, calcDef.title, formValues, res.primaryValue);
      onShowToast(`Calculated: ${res.primaryValue}`, 'success');
    } else {
      onShowToast(res.error, 'error');
    }
  };

  // Reset to default values
  const handleReset = () => {
    if (!calcDef) return;
    const defaults: Record<string, any> = {};
    calcDef.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue;
    });
    setFormValues(defaults);
    const res = calcDef.calculate(defaults);
    setResult(res);
    onShowToast('Inputs reset to defaults', 'info');
  };

  // Copy result
  const handleCopy = async () => {
    const text = `${calcDef.title} Result: ${result.primaryValue}${result.subtext ? ` (${result.subtext})` : ''}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onShowToast('Result copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="quick-calculator-section" className="section" style={{ paddingTop: '0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">
              <Zap size={13} /> Instant Live Calculations
            </span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
            Try Our Top Calculators <span className="text-gradient">Right Now</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Enter your values below and click <strong>Calculate</strong> to see instant results, formulas, and step-by-step solutions without leaving the homepage.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '1.75rem'
          }}
        >
          {FEATURED_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="calculator-panel"
                onClick={() => handleTabChange(tab.id)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  height: '44px',
                  padding: '0 1.25rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Calculator Workspace Grid */}
        <div id="calculator-panel" className="calculator-main-grid" style={{ marginBottom: '2rem' }}>
          {/* Left Column: Form Inputs */}
          <div className="calc-card-container">
            <div className="calc-card-title-bar">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span>{calcDef.title}</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {calcDef.shortDesc}
                </p>
              </div>

              <button
                type="button"
                id="btn-reset"
                className="btn btn-secondary"
                style={{ height: '34px', padding: '0 0.75rem', fontSize: '0.8rem' }}
                onClick={handleReset}
                title="Reset to default values"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <form id="calculator-form" onSubmit={handleCalculate}>
              {calcDef.fields.map((field) => (
                <div key={field.id} className="form-group">
                  <label className="form-label" htmlFor={`calc-input-${field.id}`}>
                    {field.label}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={`calc-input-${field.id}`}
                      className="form-select"
                      value={formValues[field.id] ?? field.defaultValue}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'text' ? (
                    <input
                      id={`calc-input-${field.id}`}
                      type="text"
                      className="form-input"
                      value={formValues[field.id] ?? ''}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                  ) : (
                    <div className={field.unit ? 'input-with-addon' : ''}>
                      <input
                        id={`calc-input-${field.id}`}
                        type="number"
                        className="form-input"
                        value={formValues[field.id] ?? ''}
                        min={field.min}
                        max={field.max}
                        step={field.step || 'any'}
                        placeholder={field.placeholder}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      />
                      {field.unit && <span className="input-addon">{field.unit}</span>}
                    </div>
                  )}

                  {field.helpText && <p className="form-help">{field.helpText}</p>}
                </div>
              ))}

              {/* Quick Arithmetic Buttons if Basic Calculator */}
              {calcDef.id === 'basic-calculator' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Quick operators:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {['+', '-', '*', '/', '(', ')'].map((op) => (
                      <button
                        key={op}
                        type="button"
                        className="btn btn-secondary"
                        style={{ height: '32px', width: '38px', padding: 0, fontSize: '0.95rem', fontWeight: 700 }}
                        onClick={() => {
                          const curr = String(formValues.expression || '');
                          handleFieldChange('expression', curr + ` ${op} `);
                        }}
                      >
                        {op}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ height: '32px', padding: '0 0.6rem', fontSize: '0.8rem' }}
                      onClick={() => handleFieldChange('expression', '')}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {result.error && (
                <div className="form-error" role="alert" style={{ marginBottom: '1rem' }}>
                  <span>⚠️ {result.error}</span>
                </div>
              )}

              <div className="form-btn-group">
                <button
                  type="submit"
                  id="btn-calculate"
                  className="btn btn-primary"
                  style={{ flex: 1, height: '48px', fontSize: '1rem', fontWeight: 700 }}
                >
                  <Zap size={18} /> Calculate Now
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ height: '48px' }}
                  onClick={() => onSelectCalculator(calcDef.slug)}
                >
                  <span>Full Page</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Output / Result Section */}
          <div id="calculator-result" className="results-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Calculation Result</h3>
              <span className="badge badge-popular" style={{ textTransform: 'capitalize' }}>
                {calcDef.category.replace('-', ' ')}
              </span>
            </div>

            {/* Primary Result Box */}
            <div id="primary-result-box" className="primary-result-box">
              <div id="primary-result-label" className="primary-result-label">
                {result.primaryLabel || 'Result'}
              </div>
              <div id="primary-result-value" className="primary-result-value">
                {result.primaryValue || '0'}
              </div>
              {result.subtext && (
                <div id="primary-result-subtext" className="primary-result-subtext">
                  {result.subtext}
                </div>
              )}
            </div>

            {/* Detailed Metric Breakdown */}
            {result.breakdown && result.breakdown.length > 0 && (
              <div id="result-breakdown" className="result-breakdown-list">
                {result.breakdown.map((item, idx) => (
                  <div key={idx} className="result-row">
                    <span className="result-row-label">{item.label}</span>
                    <span className="result-row-value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Calculation Steps */}
            {result.steps && result.steps.length > 0 && (
              <div id="result-steps" className="steps-box">
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  How this was computed:
                </div>
                {result.steps.map((step, idx) => (
                  <div key={idx} className="step-item" style={{ fontSize: '0.85rem' }}>
                    <span className="step-number">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="result-actions-row" style={{ marginTop: 'auto' }}>
              <button
                type="button"
                id="btn-copy-result"
                className="btn btn-secondary"
                onClick={handleCopy}
                style={{ flex: 1 }}
              >
                {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Result'}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onSelectCalculator(calcDef.slug)}
                style={{ flex: 1 }}
              >
                <span>View Formula & Guide</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
