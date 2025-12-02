-- SQL script to update pharmacy products based on formulary data
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- First, delete all existing products
DELETE FROM products;

-- Delete duplicate SouthLake pharmacy (keep the original)
DELETE FROM pharmacies WHERE id = '14a8abd6-2808-429f-9c1a-7be25f76495a';

-- Get pharmacy IDs (these are the existing IDs in your database)
-- Wellvi/Reviv: a1b2c3d4-e5f6-4789-a012-3456789abcde
-- Wells FL: b2c3d4e5-f6a7-4890-b123-456789abcdef
-- Wells TX: c3d4e5f6-a7b8-4901-c234-56789abcdef0
-- Brooksville: d4e5f6a7-b8c9-4012-d345-6789abcdef01
-- Hallandale: e5f6a7b8-c9d0-4123-e456-789abcdef012
-- Hometown: dc9f2faa-52c9-4869-aee3-931d6792031f
-- Empower: ba887f67-1dcd-440c-8b37-a4dcfd04045b
-- SouthLake: 14a8abd6-2808-429f-9c1a-7be25176495a
-- CRE8: f6a7b8c9-d0e1-4234-f567-89abcdef0123

-- Insert Wellvi/Reviv products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 10mg/ml 1ml', 10, 1, 74, 74, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 10mg/ml 2ml', 10, 2, 94, 94, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 10mg/ml 3ml', 10, 3, 105, 105, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 20mg/ml 2ml', 20, 2, 120, 120, true),
('a1b2c3d4-e5f6-4789-a012-3456789abcde', 'Tirzepatide 20mg/ml 3ml', 20, 3, 169, 169, true);

-- Insert Wells FL products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Tirzepatide 10mg/ml 2ml', 10, 2, 264, 264, true),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Tirzepatide 16.6mg/ml 2ml', 16.6, 2, 264, 264, true),
('b2c3d4e5-f6a7-4890-b123-456789abcdef', 'Tirzepatide 16.6mg/ml 4.5ml', 16.6, 4.5, 491, 491, true);

-- Insert Wells TX products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'Tirzepatide 16.6mg/ml 2ml', 16.6, 2, 264, 264, true),
('c3d4e5f6-a7b8-4901-c234-56789abcdef0', 'Tirzepatide 16.6mg/ml 4.5ml', 16.6, 4.5, 491, 491, true);

-- Insert Brooksville products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('d4e5f6a7-b8c9-4012-d345-6789abcdef01', 'Tirzepatide 10mg/ml 2ml', 10, 2, 200, 200, true);

-- Insert Hallandale products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'Tirzepatide 10mg/ml 2ml', 10, 2, 187.50, 187.50, true),
('e5f6a7b8-c9d0-4123-e456-789abcdef012', 'Tirzepatide 10mg/ml 3ml', 10, 3, 250, 250, true);

-- Insert Hometown products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('dc9f2faa-52c9-4869-aee3-931d6792031f', 'Tirzepatide 17mg/ml 2ml', 17, 2, 246.82, 246.82, true),
('dc9f2faa-52c9-4869-aee3-931d6792031f', 'Tirzepatide 17mg/ml 4ml', 17, 4, 447.37, 447.37, true);

-- Insert Empower products
INSERT INTO products (pharmacy_id, name, concentration, volume, cost, retail_price, active) VALUES
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'Tirzepatide 17mg/ml 2ml', 17, 2, 246.82, 246.82, true),
('ba887f67-1dcd-440c-8b37-a4dcfd04045b', 'Tirzepatide 17mg/ml 4ml', 17, 4, 447.37, 447.37, true);

-- SouthLake and CRE8 have no tirzepatide products (no inserts needed)

-- Verify the data
SELECT p.name as product, p.concentration, p.volume, p.cost, ph.name as pharmacy
FROM products p
JOIN pharmacies ph ON p.pharmacy_id = ph.id
ORDER BY ph.name, p.concentration, p.volume;
