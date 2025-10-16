# Tirzepatide Dosage Calculator

A comprehensive React-based calculator for computing tirzepatide injection dosages across various vial concentrations and titration schedules.

## Features

- **4 Pre-configured Vial Options:**
  - 10mg/ml - 2cc vial
  - 20mg/ml - 3cc vial
  - 16.6mg/ml - 2cc vial
  - 16.6mg/ml - 4.5cc vial

- **Flexible Titration Schedules:**
  - Standard 5-week titration (2.5mg → 10mg)
  - Custom titration with add/remove/edit capabilities

- **Comprehensive Calculations:**
  - Volume in milliliters (ml)
  - Units for insulin syringes (100 units = 1ml)
  - Total vials needed
  - Week-by-week dosing schedule

- **Multiple Duration Options:**
  - 4, 8, 12, 16, 20, or 24-week prescriptions

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps to Run Locally

1. **Navigate to the project directory:**
   ```bash
   cd tirzepatide-calculator
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The terminal will display a local URL (typically http://localhost:5173)
   - Click the link or navigate to it in your browser

5. **To stop the server:**
   - Press `Ctrl + C` in the terminal

## How to Use

1. **Select Vial:** Choose your vial concentration and volume from the dropdown
2. **Set Duration:** Select your prescription length (4-24 weeks)
3. **Choose Titration:**
   - Use the Standard 5-week titration schedule, or
   - Switch to Custom to create your own dosing schedule
4. **View Results:** See weekly doses, total volume needed, and number of vials required

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Important Medical Disclaimer

⚠️ **This calculator is for educational purposes only.**

- Always verify dosage calculations with your healthcare provider
- Store reconstituted tirzepatide refrigerated (2-8°C)
- Follow proper sterile injection techniques
- Report any adverse reactions to your healthcare provider

## Technical Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
tirzepatide-calculator/
├── src/
│   ├── App.jsx          # Main calculator component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Tailwind CSS imports
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## License

This project is for educational and informational purposes only. Not for commercial use.
