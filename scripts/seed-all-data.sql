-- Complete pharmacy data seed script
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- =============================================
-- STEP 1: Clear existing data
-- =============================================
DELETE FROM shipping_restrictions;
DELETE FROM products;
DELETE FROM pharmacies;

-- =============================================
-- STEP 2: Insert pharmacies
-- =============================================
INSERT INTO pharmacies (id, name, active) VALUES
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Wellvi/Reviv', true),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Wells FL', true),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'Wells TX', true),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'Brooksville', true),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'Hallandale', true),
('dc9f2faa-52c9-4869-aee3-931d6792031f', 'Hometown', true),
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'Empower', true),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'SouthLake', true),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'CRE8', true);

-- =============================================
-- STEP 3: Insert shipping restrictions
-- (Only inserting NO and Some Limitations states - Yes means can ship)
-- =============================================

-- Brooksville (63% coverage) - States where they CANNOT ship
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'AL', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'AK', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'AR', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'CA', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'DC', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'KS', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'KY', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'LA', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'MA', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'MI', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'NV', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'NC', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'OH', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'PR', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'SC', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'TX', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'VA', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'WA', false, NULL),
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'WV', false, NULL);

-- CRE8 (77% coverage)
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'AL', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'AR', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'CA', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'KY', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'LA', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'MA', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'MN', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'MS', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'NC', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'SC', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'VA', false, NULL),
('f6a7b8c9-d0e1-4234-f567-89abcdef0123', 'WV', false, NULL);

-- Empower (92% coverage) - Some Limitations treated as can ship with notes
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'CA', true, 'Some Limitations'),
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'IA', true, 'Some Limitations'),
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'MN', true, 'Some Limitations'),
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'WI', true, 'Some Limitations');

-- Hallandale (77% coverage)
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'AL', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'AR', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'CA', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'CO', true, 'Some Limitations'),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'HI', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'KS', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'LA', true, 'Some Limitations'),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'MA', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'MI', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'MN', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'MS', false, NULL),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'NM', true, 'Some Limitations');

-- Hometown (100% coverage) - Ships everywhere!
-- No restrictions needed

-- SouthLake (71% coverage)
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('14a8abd6-2808-429f-9c1a-7be25176495a', 'AL', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'CA', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'DC', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'KY', true, 'Some Limitations'),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'LA', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'MA', true, 'Some Limitations'),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'MI', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'MN', true, 'Some Limitations'),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'MS', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'MT', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'NM', true, 'Some Limitations'),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'TX', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'VA', true, 'Some Limitations'),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'WA', false, NULL),
('14a8abd6-2808-429f-9c1a-7be25176495a', 'WV', false, NULL);

-- Wells FL (75% coverage)
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'AL', false, NULL),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'AR', true, 'Some Limitations'),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'CA', true, 'Some Limitations'),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'IA', false, NULL),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'KY', true, 'Some Limitations'),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'LA', false, NULL),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'MA', false, NULL),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'MI', true, 'Some Limitations'),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'MN', true, 'Some Limitations'),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'NM', true, 'Some Limitations'),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'TX', false, NULL),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'WA', false, NULL),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'WV', false, NULL);

-- Wells TX (83% coverage)
INSERT INTO shipping_restrictions (pharmacy_id, state_code, can_ship, notes) VALUES
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'AL', false, NULL),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'CA', false, NULL),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'KY', true, 'Some Limitations'),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'LA', true, 'Some Limitations'),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'MA', true, 'Some Limitations'),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'MI', true, 'Some Limitations'),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'MN', true, 'Some Limitations'),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'NM', true, 'Some Limitations'),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'WA', true, 'Some Limitations');

-- =============================================
-- STEP 4: Insert ALL products from each pharmacy
-- =============================================

-- Wellvi/Reviv Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 10mg/ml 1ml', 10, 1, 74, 74, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 10mg/ml 2ml', 10, 2, 94, 94, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 10mg/ml 3ml', 10, 3, 105, 105, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 20mg/ml 2ml', 20, 2, 120, 120, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 20mg/ml 3ml', 20, 3, 169, 169, true);

-- Wells FL Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Tirzepatide 10mg/ml 2ml', 10, 2, 264, 264, true),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Tirzepatide 16.6mg/ml 2ml', 16.6, 2, 264, 264, true),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Tirzepatide 16.6mg/ml 4.5ml', 16.6, 4.5, 491, 491, true);

-- Wells TX Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'Tirzepatide 16.6mg/ml 2ml', 16.6, 2, 264, 264, true),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'Tirzepatide 16.6mg/ml 4.5ml', 16.6, 4.5, 491, 491, true);

-- Brooksville Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'Tirzepatide 10mg/ml 2ml', 10, 2, 200, 200, true);

-- Hallandale Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'Tirzepatide 10mg/ml 2ml', 10, 2, 187.50, 187.50, true),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'Tirzepatide 10mg/ml 3ml', 10, 3, 250, 250, true);

-- Hometown Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('dc9f2faa-52c9-4869-aee3-931d6792031f', 'Tirzepatide 17mg/ml 2ml', 17, 2, 246.82, 246.82, true),
('dc9f2faa-52c9-4869-aee3-931d6792031f', 'Tirzepatide 17mg/ml 4ml', 17, 4, 447.37, 447.37, true);

-- Empower Products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
-- Tirzepatide
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'Tirzepatide 17mg/ml 2ml', 17, 2, 246.82, 246.82, true),
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'Tirzepatide 17mg/ml 4ml', 17, 4, 447.37, 447.37, true);

-- SouthLake and CRE8 have no Tirzepatide products

-- =============================================
-- STEP 5: Verify the data
-- =============================================
SELECT 'Pharmacies' as table_name, COUNT(*) as count FROM pharmacies
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Shipping Restrictions', COUNT(*) FROM shipping_restrictions;

-- Show pharmacies and their coverage
SELECT
  p.name,
  COUNT(DISTINCT CASE WHEN sr.can_ship = false THEN sr.state_code END) as blocked_states,
  51 - COUNT(DISTINCT CASE WHEN sr.can_ship = false THEN sr.state_code END) as available_states
FROM pharmacies p
LEFT JOIN shipping_restrictions sr ON p.id = sr.pharmacy_id
GROUP BY p.name
ORDER BY available_states DESC;
