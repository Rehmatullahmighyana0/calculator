import React from 'react';
import { Calculator, ShieldCheck, Heart, Github } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div>
            <div className="brand-link" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon">
                <Calculator size={20} />
              </div>
              <span>
                Calc<span className="text-gradient">Hub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '300px' }}>
              The all-in-one free online calculator suite. Fast, precise, responsive, and easy-to-use tools for mathematics, finance, health, engineering, and everyday life.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <span className="badge badge-primary">100% Free</span>
              <span className="badge badge-featured">150+ Tools</span>
              <span className="badge badge-popular">Zero Ads</span>
            </div>
          </div>

          {/* Categories Col 1 */}
          <div>
            <h4 className="footer-col-title">Mathematics & Finance</h4>
            <ul className="footer-links">
              <li>
                <a href="/category/finance" onClick={handleNav('/category/finance')} className="footer-link">
                  Finance Calculators
                </a>
              </li>
              <li>
                <a href="/category/math" onClick={handleNav('/category/math')} className="footer-link">
                  Math Solvers
                </a>
              </li>
              <li>
                <a href="/category/basic-everyday" onClick={handleNav('/category/basic-everyday')} className="footer-link">
                  Basic & Everyday
                </a>
              </li>
              <li>
                <a href="/category/geometry" onClick={handleNav('/category/geometry')} className="footer-link">
                  Geometry Calculators
                </a>
              </li>
              <li>
                <a href="/category/statistics" onClick={handleNav('/category/statistics')} className="footer-link">
                  Statistics Tools
                </a>
              </li>
            </ul>
          </div>

          {/* Categories Col 2 */}
          <div>
            <h4 className="footer-col-title">Health & Science</h4>
            <ul className="footer-links">
              <li>
                <a href="/category/health-fitness" onClick={handleNav('/category/health-fitness')} className="footer-link">
                  Health & Fitness
                </a>
              </li>
              <li>
                <a href="/category/physics" onClick={handleNav('/category/physics')} className="footer-link">
                  Physics Calculators
                </a>
              </li>
              <li>
                <a href="/category/chemistry" onClick={handleNav('/category/chemistry')} className="footer-link">
                  Chemistry Solvers
                </a>
              </li>
              <li>
                <a href="/category/electrical" onClick={handleNav('/category/electrical')} className="footer-link">
                  Electrical & Circuits
                </a>
              </li>
              <li>
                <a href="/category/unit-converters" onClick={handleNav('/category/unit-converters')} className="footer-link">
                  Unit Converters
                </a>
              </li>
            </ul>
          </div>

          {/* Categories Col 3 */}
          <div>
            <h4 className="footer-col-title">Utility & Tech</h4>
            <ul className="footer-links">
              <li>
                <a href="/category/date-time" onClick={handleNav('/category/date-time')} className="footer-link">
                  Date & Time Tools
                </a>
              </li>
              <li>
                <a href="/category/construction" onClick={handleNav('/category/construction')} className="footer-link">
                  Construction Estimators
                </a>
              </li>
              <li>
                <a href="/category/data-computer" onClick={handleNav('/category/data-computer')} className="footer-link">
                  Computer & Subnets
                </a>
              </li>
              <li>
                <a href="/category/time-productivity" onClick={handleNav('/category/time-productivity')} className="footer-link">
                  Productivity & Timers
                </a>
              </li>
              <li>
                <a href="/category/business" onClick={handleNav('/category/business')} className="footer-link">
                  Business & SaaS
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="footer-col-title">Popular Tools</h4>
            <ul className="footer-links">
              <li>
                <a href="/calculators/loan-calculator" onClick={handleNav('/calculators/loan-calculator')} className="footer-link">
                  Loan Calculator
                </a>
              </li>
              <li>
                <a href="/calculators/mortgage-calculator" onClick={handleNav('/calculators/mortgage-calculator')} className="footer-link">
                  Mortgage Calculator
                </a>
              </li>
              <li>
                <a href="/calculators/bmi-calculator" onClick={handleNav('/calculators/bmi-calculator')} className="footer-link">
                  BMI Calculator
                </a>
              </li>
              <li>
                <a href="/calculators/scientific-calculator" onClick={handleNav('/calculators/scientific-calculator')} className="footer-link">
                  Scientific Calculator
                </a>
              </li>
              <li>
                <a href="/calculators/ip-subnet-calculator" onClick={handleNav('/calculators/ip-subnet-calculator')} className="footer-link">
                  IP Subnet Calculator
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} CalcHub Platform. Accurate, Private & Instant Calculations.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="footer-link">
              XML Sitemap
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="footer-link">
              Robots.txt
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for productivity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
