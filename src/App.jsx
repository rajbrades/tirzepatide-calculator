import React, { useState, useMemo } from 'react';
import { Calculator, AlertCircle, DollarSign } from 'lucide-react';

const TirzepatideCalculator = () => {
  const standardTitration = [
    { week: 1, dose: 2.5 },
    { week: 2, dose: 3.75 },
    { week: 3, dose: 5 },
    { week: 4, dose: 7.5 },
    { week: 5, dose: 10 }
  ];

  const vialOptions = [
    { id: 1, name: '10mg/ml Pyridoxine 2mg/ml - 2cc vial', concentration: 10, volume: 2, cost: 94.00, retail: 349.00 },
    { id: 2, name: '20mg/ml Pyridoxine 2mg/ml - 3cc vial', concentration: 20, volume: 3, cost: 169.00, retail: 769.00 },
    { id: 3, name: '16.6mg/ml Glycine 7.5mg/ml - 2cc vial', concentration: 16.6, volume: 2, cost: 264.00, retail: 600.00 },
    { id: 4, name: '16.6mg/ml Niacinamide 2mg/ml - 2cc vial', concentration: 16.6, volume: 2, cost: 264.00, retail: 600.00 },
    { id: 5, name: '16.6mg/ml Niacinamide 2mg/ml - 4.5cc vial', concentration: 16.6, volume: 4.5, cost: 491.00, retail: 1050.00 },
    { id: 6, name: '16.6mg/ml Glycine 7.5mg/ml - 4.5cc vial', concentration: 16.6, volume: 4.5, cost: 491.00, retail: 1050.00 }
  ];

  const [selectedVial, setSelectedVial] = useState(vialOptions[0]);
  const [duration, setDuration] = useState(8);
  const [useCustomTitration, setUseCustomTitration] = useState(false);
  const [customTitration, setCustomTitration] = useState(standardTitration);

  React.useEffect(() => {
    const newCustomTitration = [];
    for (let week = 1; week <= duration; week++) {
      const existingCustom = customTitration.find(t => t.week === week);
      if (existingCustom) {
        newCustomTitration.push(existingCustom);
      } else if (week <= standardTitration.length) {
        newCustomTitration.push({ week, dose: standardTitration[week - 1].dose });
      } else {
        const lastDose = week > 1 ? newCustomTitration[week - 2].dose : 10;
        newCustomTitration.push({ week, dose: lastDose });
      }
    }
    setCustomTitration(newCustomTitration);
  }, [duration]);

  const calculateDosage = (dose, concentration) => {
    const ml = dose / concentration;
    const units = ml * 100;
    return { ml: ml.toFixed(3), units: units.toFixed(1) };
  };

  const weeklySchedule = useMemo(() => {
    const schedule = [];
    for (let week = 1; week <= duration; week++) {
      let dose;
      if (useCustomTitration) {
        dose = customTitration[week - 1]?.dose || 0;
      } else {
        if (week <= standardTitration.length) {
          dose = standardTitration[week - 1].dose;
        } else {
          dose = standardTitration[standardTitration.length - 1].dose;
        }
      }
      const dosage = calculateDosage(dose, selectedVial.concentration);
      schedule.push({ week, dose, ...dosage });
    }
    return schedule;
  }, [selectedVial, duration, useCustomTitration, customTitration]);

  const totalVolume = useMemo(() => {
    return weeklySchedule.reduce((sum, week) => sum + parseFloat(week.ml), 0);
  }, [weeklySchedule]);

  const vialsNeeded = useMemo(() => {
    return Math.ceil(totalVolume / selectedVial.volume);
  }, [totalVolume, selectedVial]);

  const costCalculations = useMemo(() => {
    const totalCost = vialsNeeded * selectedVial.cost;
    const totalRetail = vialsNeeded * selectedVial.retail;
    const totalProfit = totalRetail - totalCost;
    const profitMargin = totalRetail > 0 ? ((totalProfit / totalRetail) * 100) : 0;
    return {
      totalCost, totalRetail, totalProfit, profitMargin,
      costPerVial: selectedVial.cost, retailPerVial: selectedVial.retail
    };
  }, [vialsNeeded, selectedVial]);

  const updateCustomDose = (index, value) => {
    const newTitration = [...customTitration];
    newTitration[index].dose = parseFloat(value) || 0;
    setCustomTitration(newTitration);
  };

  const resetToStandard = () => {
    const newTitration = [];
    for (let week = 1; week <= duration; week++) {
      if (week <= standardTitration.length) {
        newTitration.push({ week, dose: standardTitration[week - 1].dose });
      } else {
        newTitration.push({ week, dose: standardTitration[standardTitration.length - 1].dose });
      }
    }
    setCustomTitration(newTitration);
    setUseCustomTitration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Tirzepatide Dosage Calculator</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Vial Concentration & Volume</label>
              <select value={selectedVial.id} onChange={(e) => setSelectedVial(vialOptions.find(v => v.id === parseInt(e.target.value)))} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                {vialOptions.map(vial => (<option key={vial.id} value={vial.id}>{vial.name}</option>))}
              </select>
              <div className="text-sm text-gray-600 mt-1">Concentration: {selectedVial.concentration}mg/ml | Volume: {selectedVial.volume}cc</div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Prescription Duration (weeks)</label>
              <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                {[4, 8, 12, 16, 20, 24].map(weeks => (<option key={weeks} value={weeks}>{weeks} weeks ({weeks / 4} months)</option>))}
              </select>
            </div>
          </div>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Titration Schedule</h2>
              <div className="flex gap-2">
                <button onClick={() => setUseCustomTitration(false)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${!useCustomTitration ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>Standard</button>
                <button onClick={() => setUseCustomTitration(true)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${useCustomTitration ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>Custom</button>
              </div>
            </div>
            {!useCustomTitration ? (
              <div className={`grid gap-2 ${duration <= 12 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-8'}`}>
                {weeklySchedule.map((week, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 text-center">
                    <div className="text-xs text-gray-500 mb-1">Week {week.week}</div>
                    <div className="text-sm font-bold text-indigo-600">{week.dose}mg</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {weeklySchedule.map((week, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-20">Week {week.week}:</span>
                    <input type="number" step="0.25" min="0" value={week.dose} onChange={(e) => updateCustomDose(idx, e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    <span className="text-sm text-gray-600 w-8">mg</span>
                  </div>
                ))}
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button onClick={resetToStandard} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Reset to Standard</button>
                </div>
              </div>
            )}
          </div>
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Current Vial Pricing</h2>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-800 mb-2">{selectedVial.name}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Cost per Vial:</span><span className="ml-2 font-semibold text-gray-900">${selectedVial.cost.toFixed(2)}</span></div>
                <div><span className="text-gray-600">Retail per Vial:</span><span className="ml-2 font-semibold text-gray-900">${selectedVial.retail.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-1">Total Volume Needed</div>
              <div className="text-3xl font-bold">{totalVolume.toFixed(2)} ml</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-1">Vials Required</div>
              <div className="text-3xl font-bold">{vialsNeeded}</div>
              <div className="text-xs opacity-75 mt-1">({selectedVial.volume}cc per vial)</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-1">Duration</div>
              <div className="text-3xl font-bold">{duration} weeks</div>
              <div className="text-xs opacity-75 mt-1">({(duration / 4).toFixed(1)} months)</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-1">Total Retail</div>
              <div className="text-3xl font-bold">${costCalculations.totalRetail.toFixed(2)}</div>
              <div className="text-xs opacity-75 mt-1">${costCalculations.retailPerVial.toFixed(2)} × {vialsNeeded} vials</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-1">Gross Margin</div>
              <div className="text-3xl font-bold">{costCalculations.profitMargin.toFixed(1)}%</div>
              <div className="text-xs opacity-75 mt-1">Of retail price</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Injection Schedule</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-300">Week</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-300">Dose (mg)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-300">Volume (ml)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-300">Units</th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((week, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 border-b border-gray-200"><span className="font-medium text-gray-900">Week {week.week}</span></td>
                    <td className="p-3 border-b border-gray-200"><span className="text-indigo-600 font-semibold">{week.dose} mg</span></td>
                    <td className="p-3 border-b border-gray-200"><span className="font-mono text-gray-900">{week.ml} ml</span></td>
                    <td className="p-3 border-b border-gray-200"><span className="font-mono text-gray-900">{week.units} units</span></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50 font-semibold">
                  <td className="p-3 border-t-2 border-gray-300">Total</td>
                  <td className="p-3 border-t-2 border-gray-300">{weeklySchedule.reduce((sum, week) => sum + week.dose, 0).toFixed(2)} mg</td>
                  <td className="p-3 border-t-2 border-gray-300">{totalVolume.toFixed(3)} ml</td>
                  <td className="p-3 border-t-2 border-gray-300">{(totalVolume * 100).toFixed(1)} units</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-2">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Units are based on insulin syringes (100 units = 1ml)</li>
                  <li>Always verify dosage calculations with your healthcare provider</li>
                  <li>Store reconstituted tirzepatide refrigerated (2-8°C)</li>
                  <li>After titration complete, maintenance dose continues for remaining weeks</li>
                  <li>This calculator is for educational purposes only</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TirzepatideCalculator;
