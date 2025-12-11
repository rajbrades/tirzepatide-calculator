# 10X Medication Calculator

A comprehensive React-based medication calculator for 10X Health, featuring dosage calculations for multiple medications and pharmacy shipping lookup.

## Authentication

Access is restricted to @10xhealthsystem.com email accounts.

- **Email Magic Link:** Enter your work email to receive a sign-in link
- **Microsoft SSO:** Sign in with your Microsoft 365 account (requires Azure AD configuration)

## Features

### Authentication
- **Microsoft SSO:** Domain-restricted login via @10xhealthsystem.com
- **Email Magic Link:** Alternative authentication option for authorized users

### Dosage Calculators

#### Tirzepatide (Injectable)
- **Multi-Pharmacy Support:** Products from 9 pharmacies with real-time availability
- **State-Based Filtering:** Automatically filters products by shipping availability
- **Flexible Titration Schedules:**
  - Standard monthly protocol (2.5mg → 15mg over 6 months)
  - Custom titration with weekly dose editing
- **Smart Recommendations:** Ranked by least overage and profit margin
- **Medical Directive:** Auto-generated patient injection instructions with copy-to-clipboard
- **Comprehensive Calculations:**
  - Volume in milliliters (ml)
  - Units for insulin syringes (100 units = 1ml)
  - Cost and retail pricing with margin analysis

#### Tesamorelin (Injectable)
- **Pharmacy Options:** Brooksville and Wellvi products
- **Dosing:** 0.8mg to 2.0mg in 0.2mg increments
- **Duration:** 4-12 weeks
- **Schedule:** 6 days per week (Monday-Saturday)
- **State-Based Filtering:** Automatically filters by shipping availability
- **Product Recommendations:** Ranked by least overage
- **Cost Analysis:** Cost per mg and gross margin calculations
- **Copy Summary:** One-click order summary with pricing and instructions

#### Testosterone (Topical)
- Men's and Women's formulations
- Multiple concentration options (Men: 100-250mg/ml, Women: 1-3mg/ml)
- Click-based dosing calculations with effective dose display
- Dose per application and total daily dose calculations
- Dispenser quantity recommendations
- Copy-to-clipboard summary with full dosing details

### Ship To State Lookup
- **State Selection:** Check pharmacy shipping availability by state
- **Multi-Medication Filtering:** Search and filter by multiple medications simultaneously
- **Searchable Medication Select:** Autocomplete dropdown supporting 400+ medications
- **Smart Pharmacy Matching:**
  - **Full Match (green):** Pharmacies that carry ALL selected medications
  - **Partial Match (grey):** Pharmacies that carry only some selected medications
- **Expandable Product Cards:** View available products and costs for each pharmacy
- **Status Categories:**
  - Can Ship (green) - Full shipping available
  - Some Limitations (yellow) - Shipping with restrictions
  - Cannot Ship (red) - No shipping to selected state
  - No Products (gray) - Pharmacy doesn't carry selected medication
- **Summary Dashboard:** Quick count of pharmacies in each category

## Supported Pharmacies

- Wellvi/Reviv
- Wells FL
- Wells TX
- Brooksville
- Hallandale
- Hometown
- Empower
- SouthLake
- CRE8

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for database)

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL seed script in your Supabase SQL Editor:

```bash
# Located at: scripts/seed-all-data.sql
```

This creates and populates:
- `pharmacies` table
- `products` table
- `shipping_restrictions` table

### Steps to Run Locally

1. **Navigate to the project directory:**
   ```bash
   cd 10X-Medication-Calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to http://localhost:5173

## How to Use

### Authentication
1. Navigate to the application URL
2. Sign in with Microsoft SSO (@10xhealthsystem.com) or use email magic link
3. Check your email for the magic link if using email authentication

### Dosage Calculator
1. Select the "Dosage Calculators" tab
2. Choose the patient's delivery state
3. Select medication type (Tirzepatide, Tesamorelin, or Testosterone)
4. Set prescription duration and dosing parameters
5. For Tirzepatide: Choose titration schedule (standard or custom)
6. View ranked product recommendations
7. Copy summary or medical directive for patient instructions

### Ship To State Lookup
1. Select the "Ship To State Lookup" tab
2. Choose a state from the dropdown
3. Search and select one or more medications to filter by
4. Click pharmacy cards to view available products and pricing

## Building for Production

```bash
npm run build
```

The optimized files will be in the `dist` folder.

Preview the production build:

```bash
npm run preview
```

## Important Medical Disclaimer

This calculator is for educational and reference purposes only.

- Always verify dosage calculations with your healthcare provider
- Store medications according to manufacturer guidelines
- Follow proper administration techniques
- Report any adverse reactions to your healthcare provider

## Technical Stack

- React 18
- Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Lucide React (icons)
- Microsoft SSO (Azure AD)

## Project Structure

```
10X-Medication-Calculator/
├── src/
│   ├── App.jsx          # Main application with all components
│   ├── AuthContext.jsx  # Supabase auth context provider
│   ├── LoginPage.jsx    # Authentication page (SSO + Magic Link)
│   ├── main.jsx         # Application entry point with auth routing
│   └── index.css        # Tailwind CSS imports
├── scripts/
│   ├── seed-all-data.sql    # Complete database seed script
│   ├── seed-products.js     # JS-based seeding (alternative)
│   └── update-products.sql  # Product update script
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## License

This project is for internal 10X Health use only. Not for commercial distribution.
