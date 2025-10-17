import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, AlertCircle, DollarSign, MapPin, Loader2 } from 'lucide-react';
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

  const standardTitration = [
    { week: 1, dose: 2.5 },
    { week: 2, dose: 3.75 },
    { week: 3, dose: 5 },
    { week: 4, dose: 7.5 },
    { week: 5, dose: 10 }
  ];

  const [loading, setLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);
  const [products, setProducts] = useState([]);
  const [shippingRestrictions, setShippingRestrictions] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [duration, setDuration] = useState(8);
  const [useCustomTitration, setUseCustomTitration] = useState(false);
  const [customTitration, setCustomTitration] = useState(standardTitration);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: pharmaciesData, error: pharmaciesError } = await supabase
          .from('pharmacies')
          .select('*')
          .eq('active', true)
          .order('name');

        if (pharmaciesError) throw pharmaciesError;

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

        setPharmacies(pharmaciesData || []);
        setProducts(productsData || []);
        setShippingRestrictions(restrictionsData || []);
        
        if (productsData && productsData.length > 0) {
          setSelectedProduct(productsData[0]);
        }
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
    if (!selectedState) return products;
    return products.filter(product => canShipToState(product, selectedState));
  }, [products, selectedState, shippingRestrictions]);

  const isSelectedProductAvailable = useMemo(() => {
    return canShipToState(selectedProduct, selectedState);
  }, [selectedProduct, selectedState, shippingRestrictions]);

  useEffect(() => {
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
    if (!selectedProduct) return [];
    
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
      const dosage = calculateDosage(dose, selectedProduct.concentration);
      schedule.push({ week, dose, ...dosage });
    }
    return schedule;
  }, [selectedProduct, duration, useCustomTitration, customTitration]);

  const totalVolume = useMemo(() => {
    return weeklySchedule.reduce((sum, week) => sum + parseFloat(week.ml), 0);
  }, [weeklySchedule]);

  const vialsNeeded = useMemo(() => {
    if (!selectedProduct) return 0;
    return Math.ceil(totalVolume / selectedProduct.volume);
  }, [totalVolume, selectedProduct]);

  const costCalculations = useMemo(() => {
    if (!selectedProduct) return { totalCost: 0, totalRetail: 0, totalProfit: 0, profitMargin: 0, costPerVial: 0, retailPerVial: 0 };
    
    const totalCost = vialsNeeded * selectedProduct.cost;
    const totalRetail = vialsNeeded * selectedProduct.retail_price;
    const totalProfit = totalRetail - totalCost;
    const profitMargin = totalRetail > 0 ? ((totalProfit / totalRetail) * 100) : 0;
    return {
      totalCost, totalRetail, totalProfit, profitMargin,
      costPerVial: selectedProduct.cost, retailPerVial: selectedProduct.retail_price
    };
  }, [vialsNeeded, selectedProduct]);

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

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">No products available. Please check your database configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Tirzepatide Dosage Calculator</h1>
          </div>

          {selectedState && !isSelectedProductAvailable && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-semibold mb-1">Shipping Restriction</p>
                  <p>The selected product cannot be shipped to {US_STATES.find(s => s.code === selectedState)?.name}. Please select a different product or state.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                Patient Delivery State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select State...</option>
                {US_STATES.map(state => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Product Selection
              </label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {products.map(product => {
                  const available = canShipToState(product, selectedState);
                  return (
                    <option key={product.id} value={product.id} disabled={!available}>
                      {product.name} {!available ? '(Not available in selected state)' : ''}
                    </option>
                  );
                })}
              </select>
              <div className="text-sm text-gray-600 mt-1">
                Concentration: {selectedProduct.concentration}mg/ml | Volume: {selectedProduct.volume}cc
                <br />
                Pharmacy: {selectedProduct.pharmacy.name}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Prescription Duration (weeks)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[4, 8, 12, 16, 20, 24].map(weeks => (
                  <option key={weeks} value={weeks}>{weeks} weeks ({weeks / 4} months)</option>
                ))}
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
              <h2 className="text-lg font-semibold text-gray-800">Current Product Pricing</h2>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-medium text-gray-800 mb-2">{selectedProduct.name}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Cost per Vial:</span><span className="ml-2 font-semibold text-gray-900">${selectedProduct.cost.toFixed(2)}</span></div>
                <div><span className="text-gray-600">Retail per Vial:</span><span className="ml-2 font-semibold text-gray-900">${selectedProduct.retail_price.toFixed(2)}</span></div>
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
              <div className="text-xs opacity-75 mt-1">({selectedProduct.volume}cc per vial)</div>
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
                  <li>Shipping restrictions vary by pharmacy and state regulations</li>
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
