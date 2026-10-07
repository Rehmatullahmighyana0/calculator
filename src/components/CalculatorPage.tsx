import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Copy,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calculator,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CalculatorDef, CalculatorResult } from '../types/calculator';
import { ScientificKeypad } from './ScientificKeypad';
import { InteractiveTimer } from './InteractiveTimer';
import { CalculatorCard } from './CalculatorCard';
import { getRelatedCalculators } from '../data/calculators';
import { shareResult, copyToClipboard } from '../utils/share';

interface CalculatorPageProps {
  calc: CalculatorDef;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSaveHistory: (calcId: string, calcSlug: string, calcTitle: string, inputs: Record<string, any>, primaryResult: string) => void;
  onSelectCalculator: (slug: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialInputs?: Record<string, any>;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  calc,
  isFavorite,
  onToggleFavorite,
  onSaveHistory,
  onSelectCalculator,
  onShowToast,
  initialInputs
}) => {
  // Initialize form state
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    calc.fields.forEach((f) => {
      defaults[f.id] = initialInputs && initialInputs[f.id] !== undefined ? initialInputs[f.id] : f.defaultValue;
    });
    return defaults;
  });

  const [result, setResult] = useState<CalculatorResult>(() => calc.calculate(formData));
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync when calculator changes or initialInputs restored
  useEffect(() => {
    const initial: Record<string, any> = {};
    calc.fields.forEach((f) => {
      initial[f.id] = initialInputs && initialInputs[f.id] !== undefined ? initialInputs[f.id] : f.defaultValue;
    });
    setFormData(initial);
    const initialRes = calc.calculate(initial);
    setResult(initialRes);
    setCopied(false);
  }, [calc, initialInputs]);

  // Handle Input Change with instant live feedback
  const handleInputChange = (fieldId: string, val: any) => {
    const updated = {
      ...formData,
      [fieldId]: val
    };
    setFormData(updated);
    const res = calc.calculate(updated);
    setResult(res);
  };

  // Run Calculation on explicit button click
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = calc.calculate(formData);
    setResult(res);

    if (!res.error) {
      onSaveHistory(calc.id, calc.slug, calc.title, formData, res.primaryValue);
      onShowToast(`Calculated: ${res.primaryValue}`, 'success');
    } else {
      onShowToast(res.error, 'error');
    }
  };

  // Reset to Defaults
  const handleReset = () => {
    const defaults: Record<string, any> = {};
    calc.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue;
    });
    setFormData(defaults);
    const res = calc.calculate(defaults);
    setResult(res);
    onShowToast('Inputs reset to defaults', 'info');
  };

  // Copy Result
  const handleCopy = async () => {
    const textToCopy = `${calc.title} Result: ${result.primaryValue}${result.subtext ? ` (${result.subtext})` : ''}`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      onShowToast('Result copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Share Result
  const handleShare = async () => {
    const shareStatus = await shareResult({
      title: `${calc.title} | CalcHub`,
      text: `${calc.title} calculation result: ${result.primaryValue}. Free online calculators:`,
      url: window.location.href
    });
    if (shareStatus === 'shared') {
      onShowToast('Shared successfully!', 'success');
    } else if (shareStatus === 'copied') {
      onShowToast('Link and result copied to clipboard!', 'success');
    }
  };

  const related = getRelatedCalculators(calc, 3);

  return (
    <div className="container calc-page-wrapper">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
        >
          Home
        </a>
        <span className="breadcrumb-separator">/</span>
        <a
          href={`/category/${calc.category}`}
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', `/category/${calc.category}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          style={{ textTransform: 'capitalize' }}
        >
          {calc.category.replace('-', ' & ')}
        </a>
        <span className="breadcrumb-separator">/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{calc.title}</span>
      </nav>

      {/* Page Header */}
      <div className="calc-page-header">
        <div className="calc-title-area">
          <div className="calc-title-row">
            <h1>{calc.title}</h1>
            {calc.badge && <span className="badge badge-popular">{calc.badge}</span>}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
            {calc.shortDesc}
          </p>
        </div>

        {/* Favorite and Share actions */}
        <div className="calc-header-actions">
          <button
            className={`btn btn-secondary ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(calc.id)}
            title={isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
            aria-label="Toggle favorite"
          >
            <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : 'currentColor'} />
            <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
          </button>
          <button className="btn btn-secondary" onClick={handleShare} aria-label="Share result">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Medical / Legal Disclaimer Banner */}
      {calc.disclaimer && (
        <div className="disclaimer-banner" role="alert">
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{calc.disclaimer}</span>
        </div>
      )}

      {/* Interactive Tool Area (if Pomodoro / Stopwatch / Countdown) */}
      {calc.isInteractiveTimer && (
        <div className="calc-card-container" style={{ marginBottom: '2.5rem' }}>
          <InteractiveTimer type={calc.isInteractiveTimer} />
        </div>
      )}

      {/* Main Grid: Input Form & Results */}
      <div className="calculator-main-grid">
        {/* Left Column: Form Inputs */}
        <div className="calc-card-container">
          <div className="calc-card-title-bar">
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} color="var(--accent-primary)" />
              <span>Input Parameters</span>
            </h2>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ height: '34px', padding: '0 0.75rem', fontSize: '0.8rem' }}
              onClick={handleReset}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <form onSubmit={handleCalculate}>
            {calc.fields.map((field) => (
              <div key={field.id} className="form-group">
                <label className="form-label" htmlFor={field.id}>
                  {field.label}
                </label>

                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    className="form-select"
                    value={formData[field.id]}
                    onChange={(e) => {
                      handleInputChange(field.id, e.target.value);
                      // Live recalculate on select change
                      const next = { ...formData, [field.id]: e.target.value };
                      setResult(calc.calculate(next));
                    }}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'text' ? (
                  <input
                    id={field.id}
                    type="text"
                    className="form-input"
                    value={formData[field.id] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                ) : (
                  <div className={field.unit ? 'input-with-addon' : ''}>
                    <input
                      id={field.id}
                      type="number"
                      className="form-input"
                      value={formData[field.id] ?? ''}
                      min={field.min}
                      max={field.max}
                      step={field.step || 'any'}
                      placeholder={field.placeholder}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                    {field.unit && <span className="input-addon">{field.unit}</span>}
                  </div>
                )}

                {field.helpText && <p className="form-help">{field.helpText}</p>}
              </div>
            ))}

            {result.error && (
              <div className="form-error" role="alert">
                <AlertTriangle size={16} />
                <span>{result.error}</span>
              </div>
            )}

            <div className="form-btn-group">
              <button type="submit" id="btn-calculate" className="btn btn-primary" style={{ flex: 1 }}>
                Calculate
              </button>
            </div>
          </form>

          {/* Interactive Scientific Keypad if applicable */}
          {calc.isInteractiveKeypad && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Interactive On-Screen Keypad</h3>
              <ScientificKeypad
                isScientific={calc.id === 'scientific-calculator'}
                onExpressionCalculated={(expr, evaluated) => {
                  handleInputChange('expression', expr);
                  setResult(calc.calculate({ ...formData, expression: expr }));
                  onSaveHistory(calc.id, calc.slug, calc.title, { expression: expr }, evaluated);
                }}
              />
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Results Card */}
        <div id="calculator-result" className="results-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Calculation Results</h2>

          {/* Highlighted Primary Result Box */}
          <div id="primary-result-box" className="primary-result-box">
            <div id="primary-result-label" className="primary-result-label">{result.primaryLabel}</div>
            <div id="primary-result-value" className="primary-result-value">{result.primaryValue}</div>
            {result.subtext && <div id="primary-result-subtext" className="primary-result-subtext">{result.subtext}</div>}
          </div>

          {/* Metric Breakdown Table */}
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

          {/* Step-by-Step Calculation Flow */}
          {result.steps && result.steps.length > 0 && (
            <div id="result-steps" className="steps-box">
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Calculation Steps
              </div>
              {result.steps.map((step, idx) => (
                <div key={idx} className="step-item">
                  <span className="step-number">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions: Copy & Share */}
          <div className="result-actions-row" style={{ marginTop: 'auto' }}>
            <button className="btn btn-secondary" onClick={handleCopy} style={{ flex: 1 }}>
              {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
            <button className="btn btn-secondary" onClick={handleShare} style={{ flex: 1 }}>
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEO & Educational Sections */}
      <div className="calc-seo-sections">
        {/* Formula Section */}
        {calc.formula && (
          <div className="seo-card">
            <h2 className="seo-card-title">
              <BookOpen size={20} color="var(--accent-primary)" />
              <span>Formula & Mathematical Method</span>
            </h2>
            <p>{calc.explanation}</p>
            <div className="formula-display">{calc.formula}</div>
          </div>
        )}

        {/* How to Use & Real-World Example */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="seo-card">
            <h3 className="seo-card-title">How to Use this Calculator</h3>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              {calc.howToUse.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="seo-card">
            <h3 className="seo-card-title">Worked Example</h3>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inputs:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {Object.entries(calc.example.inputs).map(([k, v]) => `${k} = ${v}`).join(', ')}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculated Output:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {calc.example.output}
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{calc.example.explanation}</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        {calc.faqs && calc.faqs.length > 0 && (
          <div className="seo-card">
            <h2 className="seo-card-title">
              <HelpCircle size={20} color="var(--accent-primary)" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="faq-list">
              {calc.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && <div className="faq-answer">{faq.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Calculators */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Related Calculators</h2>
            <div className="calculator-grid">
              {related.map((rc) => (
                <CalculatorCard
                  key={rc.id}
                  calc={rc}
                  isFavorite={false}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectCalculator}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
