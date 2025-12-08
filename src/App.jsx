import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Calculator, AlertCircle, Loader2, Award, Package, Check, Copy, Building2, Syringe, Droplet, MapPin, FileText, Truck, CheckCircle, XCircle, AlertTriangle, Search, X, LogOut, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

// Multi-select search component for medications
const MedicationMultiSelect = ({ products, selectedMedications, setSelectedMedications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Extract unique medication names from products
  const availableMedications = useMemo(() => {
    const medicationSet = new Set();
    products.forEach(product => {
      // Extract the base medication name (first word or words before concentration)
      const name = product.name;
      // Try to extract medication name - usually the first part before numbers
      const match = name.match(/^([A-Za-z\s\-\/]+?)(?:\s+\d|$)/);
      if (match) {
        medicationSet.add(match[1].trim());
      } else {
        // Fallback: use the whole name
        medicationSet.add(name);
      }
    });
    return Array.from(medicationSet).sort();
  }, [products]);

  // Filter medications based on search term
  const filteredMedications = useMemo(() => {
    if (!searchTerm) return availableMedications;
    return availableMedications.filter(med =>
      med.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMedications, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addMedication = (medication) => {
    if (!selectedMedications.includes(medication)) {
      setSelectedMedications([...selectedMedications, medication]);
    }
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeMedication = (medication) => {
    setSelectedMedications(selectedMedications.filter(m => m !== medication));
  };

  const clearAll = () => {
    setSelectedMedications([]);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Medications
        {selectedMedications.length > 0 && (
          <span className="ml-2 text-xs font-normal text-indigo-600">
            ({selectedMedications.length} selected)
          </span>
        )}
      </label>

      {/* Selected medications as tags */}
      {selectedMedications.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedMedications.map(med => (
            <span
              key={med}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
            >
              {med}
              <button
                onClick={() => removeMedication(med)}
                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search medications..."
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-indigo-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredMedications.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-sm">
              {searchTerm ? 'No medications found' : 'No medications available'}
            </div>
          ) : (
            <>
              {searchTerm === '' && (
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                  {availableMedications.length} medications available - type to search
                </div>
              )}
              {filteredMedications.slice(0, 50).map(medication => {
                const isSelected = selectedMedications.includes(medication);
                return (
                  <button
                    key={medication}
                    onClick={() => addMedication(medication)}
                    disabled={isSelected}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed'
                        : 'hover:bg-indigo-50 text-gray-700'
                    }`}
                  >
                    <span>{medication}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-500" />}
                  </button>
                );
              })}
              {filteredMedications.length > 50 && (
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                  Showing 50 of {filteredMedications.length} results - refine your search
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Ship To State Lookup Component
const ShipToStateLookup = () => {
  const [loading, setLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);
  const [products, setProducts] = useState([]);
  const [shippingRestrictions, setShippingRestrictions] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [expandedPharmacy, setExpandedPharmacy] = useState(null);


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [pharmaciesRes, restrictionsRes, productsRes] = await Promise.all([
          supabase.from('pharmacies').select('*').eq('active', true).order('name'),
          supabase.from('shipping_restrictions').select('*'),
          supabase.from('products').select('*').eq('active', true)
        ]);

        if (pharmaciesRes.error) throw pharmaciesRes.error;
        if (restrictionsRes.error) throw restrictionsRes.error;
        if (productsRes.error) throw productsRes.error;

        setPharmacies(pharmaciesRes.data || []);
        setShippingRestrictions(restrictionsRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get products for a pharmacy, optionally filtered by medication types (array)
  const getPharmacyProducts = (pharmacyId, medicationTypes = []) => {
    let pharmacyProducts = products.filter(p => p.pharmacy_id === pharmacyId);

    if (medicationTypes.length > 0) {
      pharmacyProducts = pharmacyProducts.filter(p =>
        medicationTypes.some(med => p.name.toLowerCase().includes(med.toLowerCase()))
      );
    }

    return pharmacyProducts;
  };

  // Check if pharmacy has products matching any of the medication filters
  const pharmacyHasMedication = (pharmacyId, medicationTypes) => {
    if (!medicationTypes || medicationTypes.length === 0) return true;
    return getPharmacyProducts(pharmacyId, medicationTypes).length > 0;
  };

  // Check if pharmacy has ALL selected medications (returns { hasAll, hasSome, matchedMeds, missingMeds })
  const pharmacyMedicationCoverage = (pharmacyId, medicationTypes) => {
    if (!medicationTypes || medicationTypes.length === 0) {
      return { hasAll: true, hasSome: true, matchedMeds: [], missingMeds: [] };
    }

    const pharmacyProducts = products.filter(p => p.pharmacy_id === pharmacyId);
    const matchedMeds = [];
    const missingMeds = [];

    medicationTypes.forEach(med => {
      const hasProduct = pharmacyProducts.some(p =>
        p.name.toLowerCase().includes(med.toLowerCase())
      );
      if (hasProduct) {
        matchedMeds.push(med);
      } else {
        missingMeds.push(med);
      }
    });

    return {
      hasAll: missingMeds.length === 0,
      hasSome: matchedMeds.length > 0,
      matchedMeds,
      missingMeds
    };
  };

  const getPharmacyStatus = (pharmacyId, stateCode) => {
    if (!stateCode) return { canShip: null, notes: null };

    const restriction = shippingRestrictions.find(
      r => r.pharmacy_id === pharmacyId && r.state_code === stateCode
    );

    if (!restriction) {
      // No restriction found = can ship
      return { canShip: true, notes: null };
    }

    return { canShip: restriction.can_ship, notes: restriction.notes };
  };

  const getPharmaciesForState = (stateCode, medicationTypes = []) => {
    if (!stateCode) return { canShip: [], partial: [], limited: [], cannotShip: [], noProducts: [] };

    const canShip = [];
    const partial = [];
    const limited = [];
    const cannotShip = [];
    const noProducts = [];

    pharmacies.forEach(pharmacy => {
      const status = getPharmacyStatus(pharmacy.id, stateCode);
      const coverage = pharmacyMedicationCoverage(pharmacy.id, medicationTypes);
      const pharmacyProducts = getPharmacyProducts(pharmacy.id, medicationTypes);

      const pharmacyData = {
        ...pharmacy,
        notes: status.notes,
        products: pharmacyProducts,
        productCount: pharmacyProducts.length,
        coverage
      };

      // If filtering by medications and pharmacy doesn't have any of them
      if (medicationTypes.length > 0 && !coverage.hasSome) {
        noProducts.push(pharmacyData);
      } else if (status.canShip === false) {
        cannotShip.push(pharmacyData);
      } else if (status.notes) {
        limited.push(pharmacyData);
      } else if (medicationTypes.length > 1 && !coverage.hasAll) {
        // Has some but not all selected medications - partial match
        partial.push(pharmacyData);
      } else {
        canShip.push(pharmacyData);
      }
    });

    return { canShip, partial, limited, cannotShip, noProducts };
  };

  const pharmacyStatusByState = useMemo(() => {
    if (!selectedState) return null;
    return getPharmaciesForState(selectedState, selectedMedications);
  }, [selectedState, selectedMedications, pharmacies, shippingRestrictions, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading pharmacy data...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ship To State Lookup</h2>
        <p className="text-gray-600">Check which pharmacies can ship to a specific state</p>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 text-lg border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">Select a state...</option>
                {US_STATES.map(state => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <MedicationMultiSelect
                products={products}
                selectedMedications={selectedMedications}
                setSelectedMedications={setSelectedMedications}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedState && pharmacyStatusByState && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className={`grid gap-4 mb-6 ${selectedMedications.length > 1 ? 'grid-cols-5' : selectedMedications.length > 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">{pharmacyStatusByState.canShip.length}</div>
              <div className="text-sm text-green-600 font-medium">{selectedMedications.length > 1 ? 'All Products' : 'Can Ship'}</div>
            </div>
            {selectedMedications.length > 1 && (
              <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 text-center">
                <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-500">{pharmacyStatusByState.partial.length}</div>
                <div className="text-sm text-gray-500 font-medium">Partial</div>
              </div>
            )}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-700">{pharmacyStatusByState.limited.length}</div>
              <div className="text-sm text-yellow-600 font-medium">Some Limitations</div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-700">{pharmacyStatusByState.cannotShip.length}</div>
              <div className="text-sm text-red-600 font-medium">Cannot Ship</div>
            </div>
            {selectedMedications.length > 0 && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center">
                <Package className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-600">{pharmacyStatusByState.noProducts.length}</div>
                <div className="text-sm text-gray-500 font-medium">No Product</div>
              </div>
            )}
          </div>

          {/* Can Ship */}
          {pharmacyStatusByState.canShip.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-green-200 overflow-hidden">
              <div className="bg-green-50 px-6 py-3 border-b border-green-200">
                <h3 className="font-semibold text-green-800 flex items-center gap-2 flex-wrap">
                  <CheckCircle className="w-5 h-5" />
                  Can Ship to {US_STATES.find(s => s.code === selectedState)?.name}
                  {selectedMedications.length > 0 && <span className="text-sm font-normal">({selectedMedications.join(', ')})</span>}
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {pharmacyStatusByState.canShip.map(pharmacy => (
                    <div key={pharmacy.id} className="border border-green-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedPharmacy(expandedPharmacy === pharmacy.id ? null : pharmacy.id)}
                        className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="font-medium text-gray-800">{pharmacy.name}</span>
                          {pharmacy.productCount > 0 && (
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                              {pharmacy.productCount} product{pharmacy.productCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span className="text-green-600 text-sm">
                          {expandedPharmacy === pharmacy.id ? '▲ Hide' : '▼ Show Products'}
                        </span>
                      </button>
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length > 0 && (
                        <div className="p-3 bg-white border-t border-green-200">
                          <div className="grid gap-2">
                            {pharmacy.products.map(product => (
                              <div key={product.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">{product.name}</span>
                                <span className="font-semibold text-gray-900">${product.cost?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length === 0 && (
                        <div className="p-3 bg-white border-t border-green-200 text-sm text-gray-500 italic">
                          No products in database for this pharmacy
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Partial Match - Has some but not all selected medications */}
          {selectedMedications.length > 1 && pharmacyStatusByState.partial.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden opacity-60">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
                <h3 className="font-semibold text-gray-600 flex items-center gap-2 flex-wrap">
                  <Package className="w-5 h-5" />
                  Partial Match - Missing Some Products
                  <span className="text-sm font-normal">(only has some of: {selectedMedications.join(', ')})</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {pharmacyStatusByState.partial.map(pharmacy => (
                    <div key={pharmacy.id} className="border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedPharmacy(expandedPharmacy === pharmacy.id ? null : pharmacy.id)}
                        className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-600">{pharmacy.name}</span>
                          {pharmacy.coverage && (
                            <>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Has: {pharmacy.coverage.matchedMeds.join(', ')}
                              </span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                Missing: {pharmacy.coverage.missingMeds.join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {expandedPharmacy === pharmacy.id ? '▲ Hide' : '▼ Show Products'}
                        </span>
                      </button>
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length > 0 && (
                        <div className="p-3 bg-white border-t border-gray-300">
                          <div className="grid gap-2">
                            {pharmacy.products.map(product => (
                              <div key={product.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">{product.name}</span>
                                <span className="font-semibold text-gray-900">${product.cost?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Some Limitations */}
          {pharmacyStatusByState.limited.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-yellow-200 overflow-hidden">
              <div className="bg-yellow-50 px-6 py-3 border-b border-yellow-200">
                <h3 className="font-semibold text-yellow-800 flex items-center gap-2 flex-wrap">
                  <AlertTriangle className="w-5 h-5" />
                  Some Limitations
                  {selectedMedications.length > 0 && <span className="text-sm font-normal">({selectedMedications.join(', ')})</span>}
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {pharmacyStatusByState.limited.map(pharmacy => (
                    <div key={pharmacy.id} className="border border-yellow-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedPharmacy(expandedPharmacy === pharmacy.id ? null : pharmacy.id)}
                        className="w-full flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <div className="text-left">
                            <span className="font-medium text-gray-800">{pharmacy.name}</span>
                            {pharmacy.notes && (
                              <div className="text-xs text-yellow-700">{pharmacy.notes}</div>
                            )}
                          </div>
                          {pharmacy.productCount > 0 && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                              {pharmacy.productCount} product{pharmacy.productCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span className="text-yellow-600 text-sm">
                          {expandedPharmacy === pharmacy.id ? '▲ Hide' : '▼ Show Products'}
                        </span>
                      </button>
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length > 0 && (
                        <div className="p-3 bg-white border-t border-yellow-200">
                          <div className="grid gap-2">
                            {pharmacy.products.map(product => (
                              <div key={product.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">{product.name}</span>
                                <span className="font-semibold text-gray-900">${product.cost?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length === 0 && (
                        <div className="p-3 bg-white border-t border-yellow-200 text-sm text-gray-500 italic">
                          No products in database for this pharmacy
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cannot Ship */}
          {pharmacyStatusByState.cannotShip.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
              <div className="bg-red-50 px-6 py-3 border-b border-red-200">
                <h3 className="font-semibold text-red-800 flex items-center gap-2 flex-wrap">
                  <XCircle className="w-5 h-5" />
                  Cannot Ship to {US_STATES.find(s => s.code === selectedState)?.name}
                  {selectedMedications.length > 0 && <span className="text-sm font-normal">({selectedMedications.join(', ')})</span>}
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {pharmacyStatusByState.cannotShip.map(pharmacy => (
                    <div key={pharmacy.id} className="border border-red-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedPharmacy(expandedPharmacy === pharmacy.id ? null : pharmacy.id)}
                        className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <span className="font-medium text-gray-800">{pharmacy.name}</span>
                          {pharmacy.productCount > 0 && (
                            <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                              {pharmacy.productCount} product{pharmacy.productCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span className="text-red-600 text-sm">
                          {expandedPharmacy === pharmacy.id ? '▲ Hide' : '▼ Show Products'}
                        </span>
                      </button>
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length > 0 && (
                        <div className="p-3 bg-white border-t border-red-200">
                          <div className="grid gap-2">
                            {pharmacy.products.map(product => (
                              <div key={product.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">{product.name}</span>
                                <span className="font-semibold text-gray-900">${product.cost?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {expandedPharmacy === pharmacy.id && pharmacy.products.length === 0 && (
                        <div className="p-3 bg-white border-t border-red-200 text-sm text-gray-500 italic">
                          No products in database for this pharmacy
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Products (when filtering by medication) */}
          {selectedMedications.length > 0 && pharmacyStatusByState.noProducts.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 flex-wrap">
                  <Package className="w-5 h-5" />
                  No Products for: {selectedMedications.join(', ')}
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pharmacyStatusByState.noProducts.map(pharmacy => (
                    <div key={pharmacy.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-600">{pharmacy.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Full Matrix Table */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mt-8">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">All Pharmacies - Shipping Matrix</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-100">Pharmacy</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.map((pharmacy, idx) => {
                    const status = getPharmacyStatus(pharmacy.id, selectedState);
                    return (
                      <tr key={pharmacy.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-inherit">
                          {pharmacy.name}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {status.canShip === false ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              <XCircle className="w-3 h-3" /> No
                            </span>
                          ) : status.notes ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              <AlertTriangle className="w-3 h-3" /> Limited
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3" /> Yes
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {status.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MedicationCalculator = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedMedication, setSelectedMedication] = useState('tirzepatide');
  const [activeTab, setActiveTab] = useState('calculators'); // 'calculators' or 'shipping'
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">10X Medication Calculator</h1>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700 hidden sm:inline">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              )}

              {activeTab === 'calculators' && selectedState && (
                <button
                  onClick={() => setSelectedState('')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-indigo-700" />
                  <div className="text-left">
                    <div className="text-xs text-indigo-600 font-medium">Shipping to</div>
                    <div className="text-sm font-bold text-indigo-900">{US_STATES.find(s => s.code === selectedState)?.name}</div>
                  </div>
                  <span className="text-xs text-indigo-600 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">Change</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('calculators')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'calculators'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="w-5 h-5" />
              Dosage Calculators
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Truck className="w-5 h-5" />
              Ship To State Lookup
            </button>
          </div>

          {activeTab === 'calculators' ? (
            <>
              {!selectedState ? (
                <div className="max-w-2xl mx-auto py-12">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Where should we ship?</h2>
                    <p className="text-gray-600">Select the patient's delivery state to see available products and pricing</p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 p-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Patient Delivery State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full p-4 text-lg border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      autoFocus
                    >
                      <option value="">Select a state...</option>
                      {US_STATES.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-8 border-b border-gray-200">
                    <button
                      onClick={() => setSelectedMedication('tirzepatide')}
                      className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                        selectedMedication === 'tirzepatide'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Syringe className="w-5 h-5" />
                      Tirzepatide (Injectable)
                    </button>
                    <button
                      onClick={() => setSelectedMedication('tesamorelin')}
                      className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                        selectedMedication === 'tesamorelin'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Syringe className="w-5 h-5" />
                      Tesamorelin (Injectable)
                    </button>
                    <button
                      onClick={() => setSelectedMedication('testosterone')}
                      className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                        selectedMedication === 'testosterone'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Droplet className="w-5 h-5" />
                      Testosterone (Topical)
                    </button>
                  </div>

                  {selectedMedication === 'tirzepatide' ? (
                    <TirzepatideCalculator selectedState={selectedState} />
                  ) : selectedMedication === 'tesamorelin' ? (
                    <TesamorelinCalculator selectedState={selectedState} />
                  ) : (
                    <TestosteroneCalculator selectedState={selectedState} />
                  )}
                </>
              )}
            </>
          ) : (
            <ShipToStateLookup />
          )}
        </div>
      </div>
    </div>
  );
};

const TirzepatideCalculator = ({ selectedState }) => {
  const generateMonthlyTitration = (totalWeeks) => {
    const schedule = [];
    for (let week = 1; week <= totalWeeks; week++) {
      let dose;
      if (week <= 4) dose = 2.5;
      else if (week <= 8) dose = 5.0;
      else if (week <= 12) dose = 7.5;
      else if (week <= 16) dose = 10.0;
      else if (week <= 20) dose = 12.5;
      else dose = 15.0;
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
  const [duration, setDuration] = useState(8);
  const [useCustomTitration, setUseCustomTitration] = useState(false);
  const [customTitration, setCustomTitration] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [copied, setCopied] = useState(false);
  const [directiveConcentration, setDirectiveConcentration] = useState(null);
  const [directiveCopied, setDirectiveCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, restrictionsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*, pharmacies(name)')
            .eq('active', true)
            .order('concentration', { ascending: true }),
          supabase
            .from('shipping_restrictions')
            .select('*')
        ]);

        if (productsRes.error) throw productsRes.error;
        if (restrictionsRes.error) throw restrictionsRes.error;

        setProducts(productsRes.data || []);
        setShippingRestrictions(restrictionsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!useCustomTitration) {
      const schedule = generateMonthlyTitration(duration);
      setCustomTitration(schedule);
    }
  }, [duration, useCustomTitration]);

  const canShipToState = (pharmacyId, state) => {
    const pharmacyRestrictions = shippingRestrictions.filter(r => r.pharmacy_id === pharmacyId);
    
    if (pharmacyRestrictions.length === 0) return true;
    
    const stateRestriction = pharmacyRestrictions.find(r => r.state_code === state);
    const hasPositiveRestrictions = pharmacyRestrictions.some(r => r.can_ship === true);
    
    if (stateRestriction) return stateRestriction.can_ship;
    if (hasPositiveRestrictions) return false;
    return true;
  };

  const totalDose = useMemo(() => {
    return customTitration.reduce((sum, week) => sum + week.dose, 0);
  }, [customTitration]);

  const recommendations = useMemo(() => {
    if (!products.length || !customTitration.length) return [];

    const availableProducts = products.filter(p => 
      canShipToState(p.pharmacy_id, selectedState)
    );

    const grouped = availableProducts.reduce((acc, product) => {
      const key = product.concentration;
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    }, {});

    const recommendations = [];

    Object.entries(grouped).forEach(([concentration, prods]) => {
      const conc = parseFloat(concentration);
      const volumeNeeded = totalDose / conc;
      const sortedByVolume = [...prods].sort((a, b) => b.volume - a.volume);

      let totalVolume = 0;
      let totalCost = 0;
      let totalRetail = 0;
      const vialsUsed = [];

      let remaining = volumeNeeded;
      for (const product of sortedByVolume) {
        while (remaining > 0) {
          const vialVolume = product.volume;
          if (remaining >= vialVolume || sortedByVolume.indexOf(product) === sortedByVolume.length - 1) {
            vialsUsed.push(product);
            totalVolume += vialVolume;
            totalCost += product.cost;
            totalRetail += product.retail_price;
            remaining -= vialVolume;
          } else {
            break;
          }
        }
        if (remaining <= 0) break;
      }

      if (vialsUsed.length > 0) {
        const overage = totalVolume - volumeNeeded;
        const profit = totalRetail - totalCost;
        const profitMargin = (profit / totalRetail) * 100;

        recommendations.push({
          pharmacyId: vialsUsed[0].pharmacy_id,
          pharmacyName: vialsUsed[0].pharmacies.name,
          concentration: conc,
          volumeNeeded,
          vialsUsed,
          totalVolume,
          totalCost,
          totalRetail,
          profit,
          profitMargin,
          overage,
          vialCount: vialsUsed.length
        });
      }
    });

    return recommendations.sort((a, b) => {
      if (Math.abs(a.overage - b.overage) > 0.1) {
        return a.overage - b.overage;
      }
      return b.profitMargin - a.profitMargin;
    });
  }, [products, totalDose, customTitration, selectedState]);

  const copyToClipboard = (recommendation) => {
    const stateName = US_STATES.find(s => s.code === selectedState)?.name;
    
    const summary = `
TIRZEPATIDE ORDER SUMMARY
========================

Patient State: ${stateName}
Duration: ${duration} weeks
Total Dose Needed: ${totalDose.toFixed(1)}mg

PHARMACY: ${recommendation.pharmacyName}
Concentration: ${recommendation.concentration}mg/ml

PRODUCTS:
${recommendation.vialsUsed.map((v, idx) => `${idx + 1}. ${v.name} - ${v.concentration}mg/ml × ${v.volume}ml`).join('\n')}

Total Vials: ${recommendation.vialCount}
Volume Provided: ${recommendation.totalVolume.toFixed(2)}ml
Overage: ${recommendation.overage.toFixed(2)}ml

PRICING:
Cost: $${recommendation.totalCost.toFixed(2)}
Retail: $${recommendation.totalRetail.toFixed(2)}
Gross Margin: ${recommendation.profitMargin.toFixed(1)}%

INJECTION SCHEDULE:
${customTitration.map(w => `Week ${w.week}: ${w.dose}mg (${(w.dose / recommendation.concentration).toFixed(2)}ml / ${((w.dose / recommendation.concentration) * 100).toFixed(0)} units)`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(summary);
    setSelectedRecommendation(recommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomDoseChange = (weekIndex, newDose) => {
    const updated = [...customTitration];
    updated[weekIndex].dose = parseFloat(newDose) || 0;
    setCustomTitration(updated);
  };

  const getMedicalDirective = (concentration) => {
    const stages = getTitrationStages(duration);
    return stages.map(stage => {
      const volume = stage.dose / concentration;
      const units = volume * 100;
      return {
        ...stage,
        volume: volume.toFixed(2),
        units: Math.round(units)
      };
    });
  };

  const copyMedicalDirective = () => {
    if (!directiveConcentration) return;

    const directive = getMedicalDirective(directiveConcentration);
    const text = directive.map(stage =>
`${stage.label} (Weeks ${stage.weeks}):
  Dose: ${stage.dose}mg
  Volume: ${stage.volume}ml (${stage.units} units)
  Inject once weekly subcutaneously`
).join('\n\n');

    navigator.clipboard.writeText(text);
    setDirectiveCopied(true);
    setTimeout(() => setDirectiveCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
          <h2 className="text-lg font-semibold text-gray-800">Prescription Duration</h2>
        </div>
        <select
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full p-4 text-lg border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          {[4, 8, 12, 16, 20, 24].map(weeks => (
            <option key={weeks} value={weeks}>{weeks} weeks ({(weeks / 4).toFixed(1)} months)</option>
          ))}
        </select>
      </div>

      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
          <h2 className="text-lg font-semibold text-gray-800">Titration Schedule</h2>
        </div>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setUseCustomTitration(false)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              !useCustomTitration
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            Standard Monthly Protocol
          </button>
          <button
            onClick={() => setUseCustomTitration(true)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              useCustomTitration
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300'
            }`}
          >
            Custom Schedule
          </button>
        </div>

        {!useCustomTitration && (
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {getTitrationStages(duration).map((stage, idx) => (
                <div key={idx} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="text-xs font-semibold text-indigo-600">{stage.label}</div>
                  <div className="text-xs text-gray-600">Weeks {stage.weeks}</div>
                  <div className="text-lg font-bold text-gray-800 mt-1">{stage.dose}mg</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
              <strong>Protocol:</strong> Each week receives one injection at the dose shown. Dose increases monthly (every 4 weeks): 2.5mg → 5.0mg → 7.5mg → 10.0mg → 12.5mg → 15mg (max)
            </div>
          </div>
        )}

        {useCustomTitration && (
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-100">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto">
              {customTitration.map((week, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Week {week.week}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={week.dose}
                    onChange={(e) => handleCustomDoseChange(idx, e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-indigo-600 text-white rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Dose Needed:</span>
            <span className="text-2xl font-bold">{totalDose.toFixed(2)} mg over {duration} weeks</span>
          </div>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <h2 className="text-lg font-semibold text-gray-800">Select Product</h2>
            <span className="text-sm text-gray-500 ml-2">(Ranked by Least Overage)</span>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl border-2 p-6 transition-all cursor-pointer ${
                  selectedRecommendation === rec
                    ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200'
                    : idx === 0
                      ? 'border-green-300 shadow-md hover:border-indigo-300'
                      : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => {
                  setSelectedRecommendation(rec);
                  setDirectiveConcentration(rec.concentration);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 flex-wrap">
                    {selectedRecommendation === rec && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-300 rounded-full">
                        <Check className="w-4 h-4 text-indigo-700" />
                        <span className="text-xs font-semibold text-indigo-700 uppercase">Selected</span>
                      </div>
                    )}
                    {idx === 0 && selectedRecommendation !== rec && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-full">
                        <Award className="w-4 h-4 text-green-700" />
                        <span className="text-xs font-semibold text-green-700 uppercase">Recommended</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-300 rounded-full">
                      <Building2 className="w-4 h-4 text-indigo-700" />
                      <span className="text-sm font-semibold text-indigo-900">{rec.pharmacyName}</span>
                    </div>

                    <span className="text-sm font-medium text-gray-600">{rec.concentration}mg/ml Concentration</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-gray-200 pl-4">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Vials Required:</div>
                    <div className="space-y-1">
                      {rec.vialsUsed.map((vial, vIdx) => (
                        <div key={vIdx} className="text-sm text-gray-700">
                          <span className="font-medium">{vial.name}</span>
                          <span className="text-gray-500"> - {vial.concentration}mg/ml × {vial.volume}ml</span>
                          <span className="text-gray-600"> (${vial.retail_price.toFixed(2)} each)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Volume Details:</div>
                      <div className="text-sm text-gray-700">
                        <div>Volume Needed: <span className="font-medium">{rec.volumeNeeded.toFixed(2)}ml</span></div>
                        <div>Volume Dispensed: <span className="font-medium">{rec.totalVolume.toFixed(2)}ml</span></div>
                        <div>Overage: <span className={`font-medium ${rec.overage < 0.5 ? 'text-green-600' : 'text-orange-600'}`}>{rec.overage.toFixed(2)}ml ({((rec.overage / rec.volumeNeeded) * totalDose).toFixed(2)}mg)</span></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pricing:</div>
                      <div className="text-sm text-gray-700">
                        <div>Total Retail: <span className="font-medium text-lg">${rec.totalRetail.toFixed(2)}</span></div>
                        <div>Gross Margin: <span className="font-medium text-lg text-indigo-600">{rec.profitMargin.toFixed(1)}%</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-gray-800">No Products Available</h3>
              <p className="text-sm text-gray-600 mt-1">
                No pharmacies can ship Tirzepatide to {US_STATES.find(s => s.code === selectedState)?.name}. Please select a different state.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedRecommendation && directiveConcentration && (
        <div className="mb-6 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
            <h2 className="text-lg font-semibold text-gray-800">Medical Directive</h2>
          </div>

          <div className="bg-white rounded-xl border-2 border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800">Patient Injection Instructions</h3>
                <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{directiveConcentration}mg/ml</span>
              </div>
              <button
                onClick={copyMedicalDirective}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  directiveCopied
                    ? 'bg-green-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {directiveCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Instructions
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {getMedicalDirective(directiveConcentration).map((stage, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                  <div className="text-sm font-bold text-indigo-700 mb-1">{stage.label}</div>
                  <div className="text-xs text-gray-500 mb-2">Weeks {stage.weeks}</div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-gray-900">
                      {stage.volume}ml <span className="text-lg text-gray-600">({stage.units} units)</span>
                    </div>
                    <div className="text-sm text-gray-500">{stage.dose}mg dose</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Instructions:</strong> Inject once weekly subcutaneously. 1ml = 100 units on an insulin syringe.
                Rotate injection sites (abdomen, thigh, upper arm).
              </p>
            </div>
          </div>
        </div>
      )}

      {customTitration.length > 0 && recommendations.length > 0 && (
        <div className="mt-6 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Injection Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-3 text-left font-semibold text-indigo-900">Week</th>
                  <th className="px-4 py-3 text-right font-semibold text-indigo-900">Dose (mg)</th>
                  <th className="px-4 py-3 text-right font-semibold text-indigo-900">Volume (ml)</th>
                  <th className="px-4 py-3 text-right font-semibold text-indigo-900">Units</th>
                </tr>
              </thead>
              <tbody>
                {customTitration.map((week, idx) => {
                  const conc = recommendations[0].concentration;
                  const volume = week.dose / conc;
                  const units = volume * 100;
                  
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium text-gray-900">Week {week.week}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{week.dose.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{volume.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{units.toFixed(0)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-indigo-50 font-bold">
                  <td className="px-4 py-3 text-gray-900">TOTAL</td>
                  <td className="px-4 py-3 text-right text-indigo-900">{totalDose.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-indigo-900">{recommendations[0] ? (totalDose / recommendations[0].concentration).toFixed(2) : '-'}</td>
                  <td className="px-4 py-3 text-right text-indigo-900">{recommendations[0] ? ((totalDose / recommendations[0].concentration) * 100).toFixed(0) : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const TesamorelinCalculator = ({ selectedState }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [shippingRestrictions, setShippingRestrictions] = useState([]);
  const [duration, setDuration] = useState(12);
  const [dailyDose, setDailyDose] = useState(1.0);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, restrictionsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*, pharmacies(name)')
            .eq('active', true)
            .ilike('name', '%tesamorelin%'),
          supabase
            .from('shipping_restrictions')
            .select('*')
        ]);

        if (productsRes.error) throw productsRes.error;
        if (restrictionsRes.error) throw restrictionsRes.error;

        setProducts(productsRes.data || []);
        setShippingRestrictions(restrictionsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const canShipToState = (pharmacyId, state) => {
    const pharmacyRestrictions = shippingRestrictions.filter(r => r.pharmacy_id === pharmacyId);

    if (pharmacyRestrictions.length === 0) return true;

    const stateRestriction = pharmacyRestrictions.find(r => r.state_code === state);
    const hasPositiveRestrictions = pharmacyRestrictions.some(r => r.can_ship === true);

    if (stateRestriction) return stateRestriction.can_ship;
    if (hasPositiveRestrictions) return false;
    return true;
  };

  // 6 days per week (Mon-Sat)
  const daysPerWeek = 6;
  const totalWeeks = duration;
  const totalDays = totalWeeks * daysPerWeek;
  const totalDose = dailyDose * totalDays;

  const recommendations = useMemo(() => {
    if (!products.length) return [];

    const availableProducts = products.filter(p =>
      canShipToState(p.pharmacy_id, selectedState)
    );

    return availableProducts.map(product => {
      const concentration = product.concentration; // mg/ml
      const vialVolume = product.volume; // ml
      const vialTotalMg = concentration * vialVolume;

      const volumeNeeded = totalDose / concentration;
      const vialsNeeded = Math.ceil(volumeNeeded / vialVolume);
      const totalVolume = vialsNeeded * vialVolume;
      const overage = totalVolume - volumeNeeded;
      const overageMg = overage * concentration;

      const totalCost = vialsNeeded * product.cost;
      const totalRetail = vialsNeeded * product.retail_price;
      const profit = totalRetail - totalCost;
      const profitMargin = (profit / totalRetail) * 100;

      // Cost per mg calculations
      const costPerMg = product.cost / vialTotalMg;
      const retailPerMg = product.retail_price / vialTotalMg;

      return {
        product,
        pharmacyName: product.pharmacies.name,
        concentration,
        vialVolume,
        vialTotalMg,
        volumeNeeded,
        vialsNeeded,
        totalVolume,
        overage,
        overageMg,
        totalCost,
        totalRetail,
        profit,
        profitMargin,
        costPerMg,
        retailPerMg
      };
    }).sort((a, b) => a.overage - b.overage);
  }, [products, totalDose, selectedState]);

  const copyToClipboard = (rec) => {
    const stateName = US_STATES.find(s => s.code === selectedState)?.name;
    const volumePerDose = dailyDose / rec.concentration;
    const unitsPerDose = volumePerDose * 100;

    const summary = `
TESAMORELIN ORDER SUMMARY
=========================

Patient State: ${stateName}
Duration: ${duration} weeks
Dosing: ${dailyDose}mg daily, Monday through Saturday
Total Dose Needed: ${totalDose.toFixed(1)}mg

PHARMACY: ${rec.pharmacyName}
Product: ${rec.product.name}
Concentration: ${rec.concentration}mg/ml

VIALS REQUIRED: ${rec.vialsNeeded}
Volume Needed: ${rec.volumeNeeded.toFixed(2)}ml
Volume Provided: ${rec.totalVolume.toFixed(2)}ml
Overage: ${rec.overage.toFixed(2)}ml (${rec.overageMg.toFixed(1)}mg)

PRICING:
Cost: $${rec.totalCost.toFixed(2)} ($${rec.costPerMg.toFixed(2)}/mg)
Retail: $${rec.totalRetail.toFixed(2)} ($${rec.retailPerMg.toFixed(2)}/mg)
Gross Margin: ${rec.profitMargin.toFixed(1)}%

INJECTION INSTRUCTIONS:
Dose: ${dailyDose}mg daily
Volume per injection: ${volumePerDose.toFixed(2)}ml (${unitsPerDose.toFixed(0)} units)
Schedule: Monday through Saturday (6 days/week)
Route: Subcutaneous injection
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedId(rec.product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
          <h2 className="text-lg font-semibold text-gray-800">Prescription Duration</h2>
        </div>
        <select
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full p-4 text-lg border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          {[4, 6, 8, 10, 12].map(weeks => (
            <option key={weeks} value={weeks}>{weeks} weeks ({(weeks / 4).toFixed(1)} months)</option>
          ))}
        </select>
      </div>

      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
          <h2 className="text-lg font-semibold text-gray-800">Daily Dose</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {[0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0].map(dose => (
            <button
              key={dose}
              onClick={() => setDailyDose(dose)}
              className={`px-3 py-3 rounded-lg font-medium transition-all ${
                dailyDose === dose
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300'
              }`}
            >
              {dose}mg
            </button>
          ))}
        </div>
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-800">
            <strong>Dosing Protocol:</strong> {dailyDose}mg subcutaneously, Monday through Saturday (6 days/week)
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-indigo-600 text-white rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Total Dose Needed:</span>
          <span className="text-2xl font-bold">{totalDose.toFixed(1)}mg over {duration} weeks ({totalDays} injections)</span>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <h2 className="text-lg font-semibold text-gray-800">Product Recommendation</h2>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const volumePerDose = dailyDose / rec.concentration;
              const unitsPerDose = volumePerDose * 100;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl border-2 p-6 transition-all ${
                    idx === 0
                      ? 'border-green-300 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 flex-wrap">
                      {idx === 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-full">
                          <Award className="w-4 h-4 text-green-700" />
                          <span className="text-xs font-semibold text-green-700 uppercase">Recommended</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-300 rounded-full">
                        <Building2 className="w-4 h-4 text-indigo-700" />
                        <span className="text-sm font-semibold text-indigo-900">{rec.pharmacyName}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{rec.product.name}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(rec)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        copiedId === rec.product.id
                          ? 'bg-green-600 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {copiedId === rec.product.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Summary
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase">Vials Needed</div>
                      <div className="text-2xl font-bold text-gray-900">{rec.vialsNeeded}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase">Volume per Dose</div>
                      <div className="text-2xl font-bold text-gray-900">{volumePerDose.toFixed(2)}ml</div>
                      <div className="text-xs text-gray-600">{unitsPerDose.toFixed(0)} units</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase">Total Retail</div>
                      <div className="text-2xl font-bold text-gray-900">${rec.totalRetail.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase">Gross Margin</div>
                      <div className="text-2xl font-bold text-indigo-600">{rec.profitMargin.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-600 uppercase tracking-wide">Volume Details:</div>
                      <div className="text-gray-700">
                        <div>Volume Needed: <span className="font-medium">{rec.volumeNeeded.toFixed(2)}ml</span></div>
                        <div>Volume Dispensed: <span className="font-medium">{rec.totalVolume.toFixed(2)}ml</span></div>
                        <div>Overage: <span className={`font-medium ${rec.overage < 1 ? 'text-green-600' : 'text-orange-600'}`}>{rec.overage.toFixed(2)}ml ({rec.overageMg.toFixed(1)}mg)</span></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-600 uppercase tracking-wide">Pricing:</div>
                      <div className="text-gray-700">
                        <div>Cost: <span className="font-medium">${rec.totalCost.toFixed(2)}</span></div>
                        <div>Retail: <span className="font-medium">${rec.totalRetail.toFixed(2)}</span></div>
                        <div>Profit: <span className="font-medium text-green-600">${rec.profit.toFixed(2)}</span></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-600 uppercase tracking-wide">Cost per mg:</div>
                      <div className="text-gray-700">
                        <div>Cost/mg: <span className="font-medium">${rec.costPerMg.toFixed(2)}</span></div>
                        <div>Retail/mg: <span className="font-medium">${rec.retailPerMg.toFixed(2)}</span></div>
                        <div>Total mg: <span className="font-medium">{rec.vialTotalMg}mg/vial</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Instructions:</strong> Inject {volumePerDose.toFixed(2)}ml ({unitsPerDose.toFixed(0)} units) subcutaneously once daily, Monday through Saturday.
                      1ml = 100 units on an insulin syringe.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-gray-800">No Products Available</h3>
              <p className="text-sm text-gray-600 mt-1">
                No pharmacies can ship Tesamorelin to {US_STATES.find(s => s.code === selectedState)?.name}. Please select a different state.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TestosteroneCalculator = ({ selectedState }) => {
  const [duration, setDuration] = useState(12);
  const [medicationType, setMedicationType] = useState('men');
  const [concentration, setConcentration] = useState(200);
  const [clicksPerApplication, setClicksPerApplication] = useState(2);
  const [frequency, setFrequency] = useState('once');
  const [copied, setCopied] = useState(false);

  const concentrationOptions = medicationType === 'men' 
    ? [100, 150, 200, 250] 
    : [1, 2, 3];

  useEffect(() => {
    setConcentration(concentrationOptions[0]);
  }, [medicationType]);

  const totalDays = duration * 7;
  const applicationsPerDay = frequency === 'once' ? 1 : 2;
  const clicksPerDay = clicksPerApplication * applicationsPerDay;
  const totalClicks = clicksPerDay * totalDays;
  const totalVolume = totalClicks / 4;
  const dispensersNeeded = Math.ceil(totalVolume / 30);
  const costPerDispenser = 30;
  const totalCost = dispensersNeeded * costPerDispenser;
  const totalDose = (concentration / 4) * totalClicks;

  const dosePerApplication = (clicksPerApplication * concentration) / 4;
  const dailyDose = (clicksPerDay * concentration) / 4;

  const copyTestosteroneSummary = () => {
    const stateName = US_STATES.find(s => s.code === selectedState)?.name;

    const summary = `
TESTOSTERONE TOPICAL ORDER SUMMARY
==================================

Patient State: ${stateName}
Duration: ${duration} weeks (${totalDays} days)
Type: ${medicationType === 'men' ? "Men's" : "Women's"} Testosterone
Concentration: ${concentration}mg/ml

DOSING:
${clicksPerApplication} clicks per application = ${dosePerApplication.toFixed(2)}mg per application
${frequency === 'once' ? 'Once' : 'Twice'} daily
Total: ${clicksPerDay} clicks/day = ${dailyDose.toFixed(2)}mg/day

TOTALS:
Total Clicks Needed: ${totalClicks.toLocaleString()}
Total Volume: ${totalVolume.toFixed(2)}ml
Total Dose: ${totalDose.toFixed(2)}mg

ORDER:
${dispensersNeeded} × 30ml Topiclick Dispensers
Cost per Dispenser: $${costPerDispenser.toFixed(2)}
Total Cost: $${totalCost.toFixed(2)}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
          <h2 className="text-lg font-semibold text-gray-800">Treatment Duration</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[4, 8, 12, 16, 20, 24].map(weeks => (
            <button
              key={weeks}
              onClick={() => setDuration(weeks)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                duration === weeks
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {weeks} weeks
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
          <h2 className="text-lg font-semibold text-gray-800">Medication Type</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMedicationType('men')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${
              medicationType === 'men'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300'
            }`}
          >
            Men's Testosterone
          </button>
          <button
            onClick={() => setMedicationType('women')}
            className={`px-6 py-4 rounded-lg font-medium transition-all ${
              medicationType === 'women'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300'
            }`}
          >
            Women's Testosterone
          </button>
        </div>
      </div>

      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
          <h2 className="text-lg font-semibold text-gray-800">Concentration</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {concentrationOptions.map(conc => (
            <button
              key={conc}
              onClick={() => setConcentration(conc)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                concentration === conc
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300'
              }`}
            >
              {conc}mg/ml
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
          <h2 className="text-lg font-semibold text-gray-800">Dosing Schedule</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Clicks per Application (as prescribed)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(clicks => (
                <button
                  key={clicks}
                  onClick={() => setClicksPerApplication(clicks)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    clicksPerApplication === clicks
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {clicks}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Application Frequency</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFrequency('once')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  frequency === 'once'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Once Daily
              </button>
              <button
                onClick={() => setFrequency('twice')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  frequency === 'twice'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Twice Daily
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-800">
            <strong>Dosing Summary:</strong> {clicksPerApplication} {clicksPerApplication === 1 ? 'click' : 'clicks'} × {concentration}mg/ml ÷ 4 = <strong>{((clicksPerApplication * concentration) / 4).toFixed(2)}mg per application</strong>
          </p>
          <p className="text-sm text-indigo-800 mt-1">
            {frequency === 'once' ? '1 time' : '2 times'} per day = <strong>{((clicksPerApplication * applicationsPerDay * concentration) / 4).toFixed(2)}mg/day</strong>
          </p>
          <p className="text-xs text-indigo-700 mt-2">
            (1 click = 0.25ml = {(concentration / 4).toFixed(2)}mg)
          </p>
        </div>
      </div>

      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
          </div>
          <button
            onClick={copyTestosteroneSummary}
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Prescription Details</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">State:</span> {US_STATES.find(s => s.code === selectedState)?.name}</div>
              <div><span className="font-semibold">Type:</span> {medicationType === 'men' ? "Men's" : "Women's"} Testosterone</div>
              <div><span className="font-semibold">Concentration:</span> {concentration}mg/ml</div>
              <div><span className="font-semibold">Duration:</span> {duration} weeks ({totalDays} days)</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Volume Calculations</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">Total Clicks:</span> {totalClicks.toLocaleString()}</div>
              <div><span className="font-semibold">Total Volume:</span> {totalVolume.toFixed(2)} ml</div>
              <div><span className="font-semibold">Total Dose:</span> {totalDose.toFixed(2)} mg</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Dispensers Required</h3>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">{dispensersNeeded}</div>
              <div className="text-sm text-gray-600">× 30ml Topiclick Dispensers</div>
              <div className="pt-2 border-t">
                <div className="text-sm"><span className="font-semibold">Cost per Dispenser:</span> $30.00</div>
                <div className="text-lg font-bold text-gray-900 mt-1">Total: ${totalCost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Application Schedule</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Clicks per Application</div>
              <div className="text-3xl font-bold text-indigo-600">{clicksPerApplication}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-sm text-gray-600 mb-1">Dose per Application</div>
              <div className="text-3xl font-bold text-green-600">{((clicksPerApplication * concentration) / 4).toFixed(1)}mg</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Applications per Day</div>
              <div className="text-3xl font-bold text-indigo-600">{applicationsPerDay}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-sm text-gray-600 mb-1">Total Daily Dose</div>
              <div className="text-3xl font-bold text-green-600">{((clicksPerApplication * applicationsPerDay * concentration) / 4).toFixed(1)}mg</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded text-center text-sm text-gray-600">
            Each click delivers <strong>{(concentration / 4).toFixed(2)}mg</strong> of testosterone ({clicksPerApplication} clicks × {(concentration / 4).toFixed(2)}mg = <strong>{((clicksPerApplication * concentration) / 4).toFixed(2)}mg per application</strong>)
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationCalculator;
