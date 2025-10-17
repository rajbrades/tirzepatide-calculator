import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, AlertCircle, DollarSign, MapPin, Loader2, Award, Package, Check, Copy, Droplet } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const TirzepatideCalculator = () => {
  const US_STATES = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
  ];

  // Monthly titration protocol
  const generateMonthlyTitration = (totalWeeks) => {
    const schedule = [];
    for (let week = 1; week <= totalWeeks; week++) {
      let dose;
      if (week <= 4) dose = 2.5;           // Month 1: weeks 1-4
      else if (week <= 8) dose = 5.0;      // Month 2: weeks 5-8
      else if (week <= 12) dose = 7.5;     // Month 3: weeks 9-12
      else if (week <= 16) dose = 10.0;    // Month 4: weeks 13-16
      else if (week <= 20) dose = 12.5;    // Month 5: weeks 17-20
      else dose = 15.0;                     // Month 6+: weeks 21+
      schedule.push({ week, dose });
    }
    return schedule;
  };

  const getTitrationStages = (totalWeeks) => {
    const stages = [
      { label: 'Month 1', weeks: '1-4', dose: 2.5, startWeek: 1, endWeek: 4 },
      { label: 'Month 2', weeks: '5-8', dose: 5.0, startWeek: 5, endWeek: 8 },
      { label: 'Month 3', weeks: '9-12', dose: 7.5, startWeek: 9, endWeek: 12 },
      { label: 'Month 4', weeks: '13-16', dose: 10.0, startWeek: 13, endWeek: 16 },
      { label: 'Month 5', weeks: '17-20', dose: 12.5, startWeek: 17, endWeek: 20 },
      { label: 'Month 6+', weeks: '21+', dose: 15.0, startWeek: 21, endWeek: Infinity }
    ];
    
    return stages.filter(stage => stage.startWeek <= totalWeeks);
  };

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [shippingRestrictions, setShippingRestrictions] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [duration, setDuration] = useState(8);
  const [useCustomTitration, setUseCustomTitration] = useState(false);
  const [customTitration, setCustomTitration] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            pharmacy:pharmacies(id, name)
          `)
          .eq('active', true)
          .order('name');

        if (productsError) throw productsError;

        const { data: restrictionsData, error: restrictionsError } = await supabase
          .from('shipping_restrictions')
          .select('*');

        if (restrictionsError) throw restrictionsError;

        setProducts(productsData || []);
        setShippingRestrictions(restrictionsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading data. Please check your Supabase configuration.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const canShipToState = (product, state) => {
    if (!state || !product) return true;
    
    const pharmacyRestrictions = shippingRestrictions.filter(
      r => r.pharmacy_id === product.pharmacy_id
    );

    if (pharmacyRestrictions.length === 0) return true;

    const stateRestriction = pharmacyRestrictions.find(r => r.state_code === state);
    
    if (!stateRestriction) {
      const hasPositiveRestrictions = pharmacyRestrictions.some(r => r.can_ship === true);
      return !hasPositiveRestrictions;
    }

    return stateRestriction.can_ship;
  };

  const availableProducts = useMemo(() => {
    if (!selectedState) return [];
    return products.filter(product => canShipToState(product, selectedState));
  }, [products, selectedState, shippingRestrictions]);

  // Initialize custom titration when duration changes
  useEffect(() => {
    setCustomTitration(generateMonthlyTitration(duration));
  }, [duration]);

  const calculateDosage = (dose, concentration) => {
    const ml = dose / concentration;
    const units = ml * 100;
    return { ml: ml.toFixed(3), units: units.toFixed(1) };
  };

  const titrationSchedule = useMemo(() => {
    return useCustomTitration ? customTitration : generateMonthlyTitration(duration);
  }, [useCustomTitration, customTitration, duration]);

  const totalVolumeNeeded = useMemo(() => {
    return titrationSchedule.reduce((sum, week) => sum + week.dose, 0);
  }, [titrationSchedule]);

  // Calculate optimal vial combinations for each concentration
  const recommendations = useMemo(() => {
    if (!selectedState || availableProducts.length === 0) return [];

    const concentrations = [...new Set(availableProducts.map(p => p.concentration))];
    const recs = [];

    concentrations.forEach(concentration => {
      const productsWithConc = availableProducts.filter(p => p.concentration === concentration);
      
      productsWithConc.sort((a, b) => b.volume - a.volume);

      const volumeNeededForConc = totalVolumeNeeded / concentration;
      let remainingVolume = volumeNeededForConc;
      const vialCombination = [];
      let totalCost = 0;
      let totalRetail = 0;

      for (const product of productsWithConc) {
        const vialsNeeded = Math.floor(remainingVolume / product.volume);
        if (vialsNeeded > 0) {
          vialCombination.push({
            product,
            quantity: vialsNeeded
          });
          totalCost += vialsNeeded * product.cost;
          totalRetail += vialsNeeded * product.retail_price;
          remainingVolume -= vialsNeeded * product.volume;
        }
      }

      if (remainingVolume > 0) {
        const smallestViablVial = productsWithConc.find(p => p.volume >= remainingVolume) || productsWithConc[productsWithConc.length - 1];
        
        const existing = vialCombination.find(v => v.product.id === smallestViablVial.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          vialCombination.push({
            product: smallestViablVial,
            quantity: 1
          });
        }
        totalCost += smallestViablVial.cost;
        totalRetail += smallestViablVial.retail_price;
        remainingVolume -= smallestViablVial.volume;
      }

      const totalVolumeProvided = vialCombination.reduce((sum, v) => sum + (v.quantity * v.product.volume), 0);
      const overage = totalVolumeProvided - volumeNeededForConc;
      const totalProfit = totalRetail - totalCost;
      const profitMargin = totalRetail > 0 ? (totalProfit / totalRetail) * 100 : 0;

      const pharmacies = [...new Set(vialCombination.map(v => v.product.pharmacy.name))];

      recs.push({
        concentration,
        vialCombination,
        totalCost,
        totalRetail,
        totalProfit,
        profitMargin,
        volumeNeeded: volumeNeededForConc,
        volumeProvided: totalVolumeProvided,
        overage,
        overageMg: overage * concentration,
        pharmacies
      });
    });

    return recs.sort((a, b) => {
      if (Math.abs(a.overage - b.overage) < 0.01) {
        return b.profitMargin - a.profitMargin;
      }
      return a.overage - b.overage;
    });
  }, [availableProducts, selectedState, totalVolumeNeeded]);

  const updateCustomDose = (index, value) => {
    const newTitration = [...customTitration];
    newTitration[index].dose = parseFloat(value) || 0;
    setCustomTitration(newTitration);
  };

  const resetToStandard = () => {
    setCustomTitration(generateMonthlyTitration(duration));
    setUseCustomTitration(false);
  };

  const weeklySchedule = useMemo(() => {
    if (!selectedRecommendation) return [];
    
    const schedule = [];
    for (let week = 1; week <= duration; week++) {
      const dose = titrationSchedule[week - 1]?.dose || 0;
      const dosage = calculateDosage(dose, selectedRecommendation.concentration);
      schedule.push({ week, dose, ...dosage });
    }
    return schedule;
  }, [selectedRecommendation, duration, titrationSchedule]);

  const copyOrderSummary = () => {
    if (!selectedRecommendation) return;

    const stateName = US_STATES.find(s => s.code === selectedState)?.name || selectedState;
    const vialDetails = selectedRecommendation.vialCombination
      .map(v => `${v.quantity}× ${v.product.name} ($${v.product.retail_price.toFixed(2)} each)`)
      .join('\n');
    
    const summary = `
TIRZEPATIDE ORDER SUMMARY
========================

Patient State: ${stateName}

PRODUCT SELECTION
-----------------
Concentration: ${selectedRecommendation.concentration}mg/ml
Pharmacy: ${selectedRecommendation.pharmacies.join(', ')}

Vials Required:
${vialDetails}

PRICING
-------
Total Cost: $${selectedRecommendation.totalCost.toFixed(2)}
Total Retail: $${selectedRecommendation.totalRetail.toFixed(2)}
Total Profit: $${selectedRecommendation.totalProfit.toFixed(2)}
Gross Margin: ${selectedRecommendation.profitMargin.toFixed(1)}%

PRESCRIPTION DETAILS
-------------------
Duration: ${duration} weeks (${(duration / 4).toFixed(1)} months)
Total Dose Needed: ${totalVolumeNeeded.toFixed(2)} mg
Total Volume Needed: ${selectedRecommendation.volumeNeeded.toFixed(2)} ml
Total Volume Dispensed: ${selectedRecommendation.volumeProvided.toFixed(2)} ml
Overage: ${selectedRecommendation.overage.toFixed(2)} ml (${selectedRecommendation.overageMg.toFixed(2)} mg)
Titration: ${useCustomTitration ? 'Custom' : 'Standard Monthly Protocol'}

WEEKLY SCHEDULE
--------------
${weeklySchedule.map(w => `Week ${w.week}: ${w.dose}mg (${w.ml}ml / ${w.units} units)`).join('\n')}

Total Dose: ${weeklySchedule.reduce((sum, week) => sum + week.dose, 0).toFixed(2)} mg
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Tirzepatide Dosage Calculator</h1>
          </div>

          {/* Step 1: State Selection */}
          <div className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h2 className="text-xl font-semibold text-gray-800">Patient Delivery State</h2>
            </div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedRecommendation(null);
              }}
              className="w-full max-w-md p-3 text-lg border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select state...</option>
              {US_STATES.map(state => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </select>
          </div>

          {selectedState && (
            <>
              {/* Step 2: Duration */}
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-semibold text-gray-800">Prescription Duration</h2>
                </div>
                <select
                  value={duration}
                  onChange={(e) => {
                    setDuration(parseInt(e.target.value));
                    setSelectedRecommendation(null);
                  }}
                  className="w-full max-w-md p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[4, 8, 12, 16, 20, 24].map(weeks => (
                    <option key={weeks} value={weeks}>{weeks} weeks ({(weeks / 4).toFixed(1)} months)</option>
                  ))}
                </select>
              </div>

              {/* Step 3: Titration Schedule */}
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-semibold text-gray-800">Titration Schedule</h2>
                </div>
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setUseCustomTitration(false)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${!useCustomTitration ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>Standard Monthly Protocol</button>
                  <button onClick={() => setUseCustomTitration(true)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${useCustomTitration ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>Custom Schedule</button>
                </div>
                
                {!useCustomTitration ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                      {getTitrationStages(duration).map((stage, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border-2 border-indigo-200 text-center">
                          <div className="text-xs font-semibold text-indigo-600 mb-1">{stage.label}</div>
                          <div className="text-2xl font-bold text-gray-800 mb-1">{stage.dose}mg</div>
                          <div className="text-xs text-gray-500">Weeks {stage.weeks}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>Protocol:</strong> Each week receives one injection at the dose shown. Dose increases monthly (every 4 weeks): 2.5mg → 5.0mg → 7.5mg → 10.0mg → 12.5mg → 15mg (max)
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                      {customTitration.map((week, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-20">Week {week.week}:</span>
                          <input type="number" step="0.25" min="0" value={week.dose} onChange={(e) => updateCustomDose(idx, e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                          <span className="text-sm text-gray-600 w-8">mg</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3 rounded-lg mb-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        Custom schedule is active. Product recommendations below update automatically as you edit. Click "Standard Monthly Protocol" to return to preset schedule.
                      </p>
                    </div>
                    <button onClick={resetToStandard} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">Reset to Standard</button>
                  </div>
                )}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Total Dose Needed:</strong> {totalVolumeNeeded.toFixed(2)} mg over {duration} weeks {useCustomTitration && <span className="text-amber-700">(Custom Schedule)</span>}
                  </p>
                </div>
              </div>

              {/* Step 4: Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <h2 className="text-xl font-semibold text-gray-800">Product Recommendations</h2>
                    <span className="text-sm text-gray-500">(Ranked by Least Overage)</span>
                  </div>

                  <div className="space-y-3">
                    {recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedRecommendation(rec)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRecommendation === rec
                            ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {idx === 0 && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                RECOMMENDED
                              </span>
                            )}
                            <h3 className="text-xl font-bold text-gray-800">{rec.concentration}mg/ml Concentration</h3>
                          </div>
                          {selectedRecommendation === rec && (
                            <Check className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Vials Required:</div>
                            <div className="space-y-1">
                              {rec.vialCombination.map((v, i) => (
                                <div key={i} className="text-sm text-gray-700">
                                  <span className="font-semibold">{v.quantity}×</span> {v.product.name} <span className="text-gray-500">(${v.product.retail_price.toFixed(2)} each)</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                              Pharmacy: {rec.pharmacies.join(', ')}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Volume Details:</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Volume Needed:</span>
                                <span className="font-semibold">{rec.volumeNeeded.toFixed(2)} ml</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Volume Dispensed:</span>
                                <span className="font-semibold">{rec.volumeProvided.toFixed(2)} ml</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Overage:</span>
                                <span className="font-semibold text-amber-600">{rec.overage.toFixed(2)} ml ({rec.overageMg.toFixed(2)} mg)</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing:</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Retail:</span>
                                <span className="font-semibold text-gray-900">${rec.totalRetail.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Profit:</span>
                                <span className="font-semibold text-green-600">${rec.totalProfit.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Gross Margin:</span>
                                <span className="font-bold text-indigo-600">{rec.profitMargin.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length === 0 && (
                <div className="mb-6 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-amber-900">No products available for {US_STATES.find(s => s.code === selectedState)?.name}</p>
                      <p className="text-sm text-amber-800 mt-1">Please contact pharmacies to arrange alternative shipping.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {selectedRecommendation && (
                <>
                  <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                      </div>
                      <button
                        onClick={copyOrderSummary}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy for Salesforce
                          </>
                        )}
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div><span className="font-semibold">State:</span> {US_STATES.find(s => s.code === selectedState)?.name}</div>
                        <div><span className="font-semibold">Duration:</span> {duration} weeks</div>
                        <div><span className="font-semibold">Concentration:</span> {selectedRecommendation.concentration}mg/ml</div>
                        <div><span className="font-semibold">Pharmacy:</span> {selectedRecommendation.pharmacies.join(', ')}</div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="font-semibold">Volume Needed:</span> {selectedRecommendation.volumeNeeded.toFixed(2)}ml</div>
                        <div><span className="font-semibold">Volume Dispensed:</span> {selectedRecommendation.volumeProvided.toFixed(2)}ml</div>
                        <div><span className="font-semibold text-amber-600">Overage:</span> <span className="text-amber-600">{selectedRecommendation.overage.toFixed(2)}ml ({selectedRecommendation.overageMg.toFixed(2)}mg)</span></div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="font-semibold">Total Retail:</span> ${selectedRecommendation.totalRetail.toFixed(2)}</div>
                        <div><span className="font-semibold">Total Profit:</span> ${selectedRecommendation.totalProfit.toFixed(2)}</div>
                        <div><span className="font-semibold">Gross Margin:</span> {selectedRecommendation.profitMargin.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekly Injection Schedule</h3>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left font-semibold text-gray-700 border-b-2 border-gray-300">Week</th>
                          <th className="p-2 text-left font-semibold text-gray-700 border-b-2 border-gray-300">Dose (mg)</th>
                          <th className="p-2 text-left font-semibold text-gray-700 border-b-2 border-gray-300">Volume (ml)</th>
                          <th className="p-2 text-left font-semibold text-gray-700 border-b-2 border-gray-300">Units</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeklySchedule.map((week, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2 border-b border-gray-200">Week {week.week}</td>
                            <td className="p-2 border-b border-gray-200 font-semibold text-indigo-600">{week.dose} mg</td>
                            <td className="p-2 border-b border-gray-200 font-mono">{week.ml} ml</td>
                            <td className="p-2 border-b border-gray-200 font-mono">{week.units} units</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TirzepatideCalculator;
