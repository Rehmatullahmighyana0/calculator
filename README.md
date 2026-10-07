# CalcHub — The Ultimate All-in-One Online Calculator Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Vanilla CSS](https://img.shields.io/badge/Style-Vanilla_CSS-ff3e00.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**CalcHub** is a fast, responsive, and SEO-optimized web platform hosting **150+ genuine, mathematically accurate online calculators** organized across **15 comprehensive categories**. Built with modern React 19, TypeScript, and a bespoke Vanilla CSS design system featuring dark/light themes, live fuzzy search, favorites, calculation history, formula explanations, and interactive keypads and timers.

---

## 🌟 Key Features

- **15 Rich Categories & 150+ Working Calculators**:
  - 🧮 **Basic & Everyday**: Basic, Scientific, Fraction, Percentage, Tip, Sales Tax, Discount, Age, Currency.
  - 📐 **Math**: Algebra, Quadratic Solver, Exponent, Matrix, Prime Checker, LCM/GCD, Logarithm, Polynomial, and more.
  - 📏 **Geometry**: Area, Perimeter, Volume, Surface Area, Pythagorean, Triangle, Sphere, Cone, Cylinder, Trigonometry, and more.
  - 💰 **Finance**: Mortgage, Auto Loan, Compound Interest, SIP, ROI, Retirement 401(k), Inflation, Crypto Profit, Black-Scholes Options, Credit Card Payoff, Amortization, and more.
  - 🏃 **Health & Fitness**: BMI, BMR, Calorie Deficit, Body Fat (US Navy), Macro Split, Water Intake, Target Heart Rate (Tanaka), Race Time Predictor (Pete Riegel), One-Rep Max, Due Date, and more *(with prominent medical disclaimers)*.
  - ⏳ **Date & Time**: Date Difference, Time Zone, Add/Subtract Days, Workday/Business Days, Stopwatch, Age in Seconds, Leap Year, and more.
  - 🔄 **Unit Converters**: Length, Weight, Temperature, Area, Speed, Volume, Pressure, Energy, Fuel Economy, Digital Storage, Power, and more.
  - 🔨 **Construction & DIY**: Concrete Yardage, Tile, Flooring, Paint Gallons, Drywall, Brick, Mulch, Gravel, Roofing, and more.
  - ⚡ **Electrical & Electronics**: Ohm's Law, Resistor Color Code, Voltage Drop, Wire Gauge (AWG), Battery Life, Solar Panel Output, LED Resistor, and more.
  - 🔬 **Physics**: Velocity/Kinematics, Force ($F=ma$), Kinetic & Potential Energy, Density, Projectile Motion, Gravitational Force, Wave Speed, Photon Energy, Pendulum Period, and more.
  - 🧪 **Chemistry**: Molar Mass, Solution Dilution ($M_1V_1 = M_2V_2$), pH to $[H^+]$, Ideal Gas Law ($PV=nRT$), Boyle's & Charles's Laws, Empirical Formula, and more.
  - 📊 **Statistics & Probability**: Mean/Median/Mode, Standard Deviation & Variance, Z-Score & P-Value, Permutations & Combinations ($nPr$, $nCr$), Sample Size Calculator, Correlation ($r$), and more.
  - 💻 **Computer & Data**: Byte / Data Size, Subnet / CIDR, Hex to Decimal to Binary, Hash Length, Screen DPI / Aspect Ratio, Base64 Encoder/Decoder, CSS Pixel to REM, Unix Timestamp, and more.
  - ⏱️ **Time & Productivity**: Interactive Pomodoro Timer, Pomodoro Plan Estimator, Reading Time, Typing Speed WPM, Billable Hours & Rate, Meeting Cost, Deep Work Tracker.
  - 💼 **Business & Marketing**: Profit Margin & Markup, Break-Even Analysis, Customer Lifetime Value (LTV), Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS), Burn Rate & Runway, Net Promoter Score (NPS), Churn Rate, and more.

- **Fast Search (`Ctrl + K` / `Cmd + K`)**:
  - Live fuzzy search filtering across all 150+ calculators by title, category, formula keywords, and description.

- **User Preferences & Persistence**:
  - 🌓 **Dark & Light Mode** with persistent system/user preference.
  - ⭐ **Favorites Bar** (localStorage backed) with instant toggle on any calculator card or detail page.
  - 📜 **Calculation History** (localStorage backed) with timestamp, inputs, outputs, and one-click "Reuse" restoring fields.

- **Actionable Tooling**:
  - 📋 **Copy Results** to clipboard with toast notification.
  - 🔗 **Share Result** using native Web Share API (mobile/desktop supported) with automatic clipboard fallback.
  - 🔄 **Reset to Defaults** button.
  - ⌨️ **Interactive Scientific Keypad** on basic & scientific calculators.
  - ⏲️ **Live Interactive Timers** (Pomodoro work/break intervals, stopwatch with lap recording).

- **SEO & Performance**:
  - Dynamic `<title>`, `<meta name="description">`, Open Graph, and Twitter Cards per calculator.
  - Dynamic Schema.org structured data (`SoftwareApplication`, `WebApplication`, `FAQPage`).
  - Pre-generated `robots.txt` and comprehensive `sitemap.xml` with all 150+ URLs indexed.
  - Zero heavy CSS frameworks — 100% pure Vanilla CSS with zero runtime overhead.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Node.js**: v18.0 or newer (tested on Node v20/v24)
- **npm**: v9.0 or newer

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Production assets will be generated in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Architecture

```
Calculators/
├── public/
│   ├── _redirects          # Netlify SPA redirect rules (/* /index.html 200)
│   ├── favicon.svg         # Modern vector favicon
│   ├── robots.txt          # SEO crawler directives
│   └── sitemap.xml         # Full XML sitemap of all categories & calculators
├── src/
│   ├── components/         # Modular React components
│   │   ├── CalculatorCard.tsx    # Compact card with favorite button
│   │   ├── CalculatorPage.tsx    # Full calculator page (inputs, formula, steps, FAQ)
│   │   ├── CategoryCard.tsx      # Home category grid card
│   │   ├── FavoritesDrawer.tsx   # Slide-out drawer for saved calculators
│   │   ├── Footer.tsx            # Footer navigation with sitemap & category links
│   │   ├── Header.tsx            # Sticky header with search, theme & drawers
│   │   ├── Hero.tsx              # Hero banner with dynamic search & category pills
│   │   ├── HistoryDrawer.tsx     # Slide-out drawer for past calculation logs
│   │   ├── InteractiveTimer.tsx  # Live Pomodoro & Stopwatch timers
│   │   ├── ScientificKeypad.tsx  # Interactive on-screen keypad
│   │   ├── SearchModal.tsx       # Fuzzy modal dialog (Ctrl+K)
│   │   └── Toast.tsx             # Animated alert feedback
│   ├── data/
│   │   ├── categories.ts         # 15 category definitions and metadata
│   │   └── calculators/          # 15 domain-specific calculation definitions
│   │       ├── basicEveryday.ts
│   │       ├── business.ts
│   │       ├── chemistry.ts
│   │       ├── construction.ts
│   │       ├── dataComputer.ts
│   │       ├── dateTime.ts
│   │       ├── electrical.ts
│   │       ├── finance.ts
│   │       ├── geometry.ts
│   │       ├── healthFitness.ts
│   │       ├── math.ts
│   │       ├── physics.ts
│   │       ├── statistics.ts
│   │       ├── timeProductivity.ts
│   │       ├── unitConverters.ts
│   │       └── index.ts          # Master lookup, search index & registry
│   ├── styles/
│   │   ├── theme.css             # HSL color palettes, dark mode tokens, typography
│   │   ├── main.css              # Global resets, animations, utilities
│   │   ├── components.css        # Cards, modals, drawers, header, footer
│   │   └── calculator.css        # Calculator layout, inputs, results, FAQ
│   ├── types/
│   │   └── calculator.ts         # TypeScript interfaces & types
│   ├── utils/
│   │   ├── seo.ts                # Dynamic metadata & JSON-LD generator
│   │   ├── share.ts              # Web Share API & clipboard copy helper
│   │   └── storage.ts            # LocalStorage wrappers (history, favorites, theme)
│   ├── App.tsx                   # Main stateful router and application shell
│   └── main.tsx                  # React DOM mount point
├── netlify.toml                  # Netlify deployment configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🌐 Step-by-Step Deployment to Netlify

### Method A: Connect with GitHub (Recommended for Automated CI/CD)

1. **Initialize Git & Create Repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete CalcHub all-in-one calculator platform"
   ```

2. **Push to GitHub**:
   - Go to [GitHub.com](https://github.com) and click **New repository**.
   - Name your repository `calchub` (or your choice). Leave "Initialize with README" unchecked.
   - Run the commands provided by GitHub:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/calchub.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy on Netlify**:
   - Log in to your [Netlify Dashboard](https://app.netlify.com).
   - Click **Add new site** > **Import an existing project**.
   - Select **GitHub** and authorize access to your repository.
   - Netlify will automatically detect the settings from `netlify.toml`:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click **Deploy site**.
   - Your website will be live in under 60 seconds with SSL enabled!

4. **Updating the Website**:
   Every time you push new commits to your GitHub `main` branch, Netlify will automatically build and deploy the update:
   ```bash
   git add .
   git commit -m "update: added new calculators"
   git push origin main
   ```

---

### Method B: Manual Drag-and-Drop / Netlify CLI

1. Run the production build locally:
   ```bash
   npm run build
   ```
2. Drag and drop the generated `dist` folder into the Netlify **Deploys** dropzone, or deploy via CLI:
   ```bash
   npx netlify-cli deploy --prod --dir=dist
   ```

---

## ➕ How to Add a New Calculator

Adding a calculator takes less than 3 minutes thanks to the declarative architecture:

1. Open the relevant category file in `src/data/calculators/<category>.ts`.
2. Add a new object conforming to the `CalculatorDef` interface:
   ```typescript
   {
     id: 'my-custom-calc',
     name: 'My Custom Calculator',
     slug: 'my-custom-calc',
     categoryId: 'math',
     description: 'Brief explanation of what this calculator computes.',
     keywords: ['tag1', 'tag2', 'formula'],
     formula: 'Result = a * b',
     explanation: 'Detailed explanation of how the formula works.',
     example: 'Example: 5 * 10 = 50.',
     fields: [
       { id: 'a', label: 'Value A', type: 'number', defaultValue: 10, step: 'any' },
       { id: 'b', label: 'Value B', type: 'number', defaultValue: 5, step: 'any' }
     ],
     calculate: (values) => {
       const a = Number(values.a) || 0;
       const b = Number(values.b) || 0;
       const res = a * b;
       return {
         primaryValue: res.toLocaleString(),
         primaryLabel: 'Total Product',
         steps: [
           `Step 1: Multiply ${a} by ${b}`,
           `Step 2: Total = ${res}`
         ]
       };
     },
     faqs: [
       { question: 'What is this used for?', answer: 'This computes the product of two values.' }
     ]
   }
   ```
3. Export it in the array — it will automatically appear in search, category listings, sitemap, and router!

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
