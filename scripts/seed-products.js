import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ondmismnxvcsvhwfzunf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZG1pc21ueHZjc3Zod2Z6dW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjE4OTksImV4cCI6MjA3NjE5Nzg5OX0.gH6Oh_2hRrvOoxcBEFwfuwci7hvQbm40F0OMp1JaGwM'
);

// Pharmacy data
const pharmacies = [
  { name: 'Wellvi/Reviv', slug: 'wellvi' },
  { name: 'Wells FL', slug: 'wells-fl' },
  { name: 'Wells TX', slug: 'wells-tx' },
  { name: 'Brooksville', slug: 'brooksville' },
  { name: 'Hallandale', slug: 'hallandale' },
  { name: 'Hometown', slug: 'hometown' },
  { name: 'Empower', slug: 'empower' },
  { name: 'SouthLake', slug: 'southlake' },
  { name: 'CRE8', slug: 'cre8' }
];

// Tirzepatide products by pharmacy (from CSV files)
const productsByPharmacy = {
  'wellvi': [
    { name: 'Tirzepatide 10mg/ml 1ml', concentration: 10, volume: 1, cost: 74 },
    { name: 'Tirzepatide 10mg/ml 2ml', concentration: 10, volume: 2, cost: 94 },
    { name: 'Tirzepatide 10mg/ml 3ml', concentration: 10, volume: 3, cost: 105 },
    { name: 'Tirzepatide 20mg/ml 2ml', concentration: 20, volume: 2, cost: 120 },
    { name: 'Tirzepatide 20mg/ml 3ml', concentration: 20, volume: 3, cost: 169 }
  ],
  'wells-fl': [
    { name: 'Tirzepatide 10mg/ml 2ml', concentration: 10, volume: 2, cost: 264 },
    { name: 'Tirzepatide 16.6mg/ml 2ml', concentration: 16.6, volume: 2, cost: 264 },
    { name: 'Tirzepatide 16.6mg/ml 4.5ml', concentration: 16.6, volume: 4.5, cost: 491 }
  ],
  'wells-tx': [
    { name: 'Tirzepatide 16.6mg/ml 2ml', concentration: 16.6, volume: 2, cost: 264 },
    { name: 'Tirzepatide 16.6mg/ml 4.5ml', concentration: 16.6, volume: 4.5, cost: 491 }
  ],
  'brooksville': [
    { name: 'Tirzepatide 10mg/ml 2ml', concentration: 10, volume: 2, cost: 200 }
  ],
  'hallandale': [
    { name: 'Tirzepatide 10mg/ml 2ml', concentration: 10, volume: 2, cost: 187.50 },
    { name: 'Tirzepatide 10mg/ml 3ml', concentration: 10, volume: 3, cost: 250 }
  ],
  'hometown': [
    { name: 'Tirzepatide 17mg/ml 2ml', concentration: 17, volume: 2, cost: 246.82 },
    { name: 'Tirzepatide 17mg/ml 4ml', concentration: 17, volume: 4, cost: 447.37 }
  ],
  'empower': [
    { name: 'Tirzepatide 17mg/ml 2ml', concentration: 17, volume: 2, cost: 246.82 },
    { name: 'Tirzepatide 17mg/ml 4ml', concentration: 17, volume: 4, cost: 447.37 }
  ],
  'southlake': [], // No tirzepatide products
  'cre8': [] // No tirzepatide products
};

async function seed() {
  console.log('Starting seed process...');

  // First, clear existing data
  console.log('Clearing existing products...');
  const { error: deleteProductsError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteProductsError) {
    console.error('Error deleting products:', deleteProductsError);
  }

  console.log('Clearing existing pharmacies...');
  const { error: deletePharmaciesError } = await supabase
    .from('pharmacies')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deletePharmaciesError) {
    console.error('Error deleting pharmacies:', deletePharmaciesError);
  }

  // Insert pharmacies
  console.log('Inserting pharmacies...');
  const { data: insertedPharmacies, error: pharmacyError } = await supabase
    .from('pharmacies')
    .insert(pharmacies.map(p => ({ name: p.name, active: true })))
    .select();

  if (pharmacyError) {
    console.error('Error inserting pharmacies:', pharmacyError);
    return;
  }

  console.log('Inserted pharmacies:', insertedPharmacies.length);

  // Create a map of pharmacy names to IDs
  const pharmacyMap = {};
  insertedPharmacies.forEach(p => {
    const slug = pharmacies.find(ph => ph.name === p.name)?.slug;
    if (slug) {
      pharmacyMap[slug] = p.id;
    }
  });

  console.log('Pharmacy map:', pharmacyMap);

  // Insert products for each pharmacy
  console.log('Inserting products...');
  const allProducts = [];

  for (const [slug, products] of Object.entries(productsByPharmacy)) {
    const pharmacyId = pharmacyMap[slug];
    if (!pharmacyId) {
      console.log(`Skipping products for ${slug} - pharmacy not found`);
      continue;
    }

    for (const product of products) {
      allProducts.push({
        pharmacy_id: pharmacyId,
        name: product.name,
        concentration: product.concentration,
        volume: product.volume,
        cost: product.cost,
        retail_price: product.cost, // Using cost as retail_price per user instruction
        active: true
      });
    }
  }

  if (allProducts.length > 0) {
    const { data: insertedProducts, error: productError } = await supabase
      .from('products')
      .insert(allProducts)
      .select();

    if (productError) {
      console.error('Error inserting products:', productError);
      return;
    }

    console.log('Inserted products:', insertedProducts.length);
  }

  console.log('Seed complete!');

  // Verify
  const { data: finalProducts } = await supabase
    .from('products')
    .select('*, pharmacies(name)')
    .order('concentration');

  console.log('\nFinal products in database:');
  finalProducts?.forEach(p => {
    console.log(`  - ${p.pharmacies?.name}: ${p.name} (${p.concentration}mg/ml x ${p.volume}ml) - $${p.cost}`);
  });
}

seed().catch(console.error);
