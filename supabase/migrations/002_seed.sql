-- College Gupshup - Seed Data

-- States
INSERT INTO states (name, slug) VALUES
('Maharashtra', 'maharashtra'),
('Karnataka', 'karnataka'),
('Tamil Nadu', 'tamil-nadu'),
('Delhi', 'delhi'),
('Uttar Pradesh', 'uttar-pradesh'),
('Gujarat', 'gujarat'),
('Rajasthan', 'rajasthan'),
('Madhya Pradesh', 'madhya-pradesh'),
('West Bengal', 'west-bengal'),
('Telangana', 'telangana'),
('Andhra Pradesh', 'andhra-pradesh'),
('Kerala', 'kerala'),
('Punjab', 'punjab'),
('Haryana', 'haryana'),
('Bihar', 'bihar');

-- Cities (sample)
INSERT INTO cities (name, slug, state_id) VALUES
('Mumbai', 'mumbai', (SELECT id FROM states WHERE slug = 'maharashtra')),
('Pune', 'pune', (SELECT id FROM states WHERE slug = 'maharashtra')),
('Nagpur', 'nagpur', (SELECT id FROM states WHERE slug = 'maharashtra')),
('Bangalore', 'bangalore', (SELECT id FROM states WHERE slug = 'karnataka')),
('Mysore', 'mysore', (SELECT id FROM states WHERE slug = 'karnataka')),
('Chennai', 'chennai', (SELECT id FROM states WHERE slug = 'tamil-nadu')),
('Coimbatore', 'coimbatore', (SELECT id FROM states WHERE slug = 'tamil-nadu')),
('New Delhi', 'new-delhi', (SELECT id FROM states WHERE slug = 'delhi')),
('Noida', 'noida', (SELECT id FROM states WHERE slug = 'uttar-pradesh')),
('Lucknow', 'lucknow', (SELECT id FROM states WHERE slug = 'uttar-pradesh')),
('Ahmedabad', 'ahmedabad', (SELECT id FROM states WHERE slug = 'gujarat')),
('Jaipur', 'jaipur', (SELECT id FROM states WHERE slug = 'rajasthan')),
('Indore', 'indore', (SELECT id FROM states WHERE slug = 'madhya-pradesh')),
('Kolkata', 'kolkata', (SELECT id FROM states WHERE slug = 'west-bengal')),
('Hyderabad', 'hyderabad', (SELECT id FROM states WHERE slug = 'telangana'));

-- Goals
INSERT INTO goals (name, slug, icon, sort_order) VALUES
('MBA', 'mba', 'Briefcase', 1),
('Engineering', 'engineering', 'Cpu', 2),
('Medical', 'medical', 'Stethoscope', 3),
('Law', 'law', 'Scale', 4),
('Design', 'design', 'Palette', 5),
('Commerce', 'commerce', 'TrendingUp', 6),
('Management', 'management', 'Users', 7),
('Pharmacy', 'pharmacy', 'Pill', 8),
('BCA', 'bca', 'Monitor', 9),
('MCA', 'mca', 'Code', 10),
('BBA', 'bba', 'BarChart', 11),
('PGDM', 'pgdm', 'Award', 12);

-- Plans
INSERT INTO plans (name, tier, description, price_monthly, price_quarterly, price_yearly, features, max_photos, max_courses, max_leads_per_month) VALUES
('Free', 'free', 'Basic college profile with limited features', 0, 0, 0, 
  '["Basic College Profile", "Up to 20 Photos", "Limited Leads (50/month)", "Basic Analytics"]',
  20, 5, 50),
('Standard', 'standard', 'Full-featured plan for growing colleges', 2999, 7999, 24999,
  '["Unlimited Photos", "Unlimited Courses", "Lead Export", "Enhanced Analytics", "Priority Support", "Custom Branding"]',
  -1, -1, 500),
('Premium', 'premium', 'Enterprise plan with featured listings', 9999, 24999, 89999,
  '["Featured Listings", "Priority Search Ranking", "Advanced Analytics", "Unlimited Leads", "Premium Branding", "Dedicated Support", "API Access", "Bulk Import"]',
  -1, -1, -1);

-- Blog Categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Admissions', 'admissions', 'College admission guides and updates'),
('Entrance Exams', 'entrance-exams', 'Entrance exam preparation and notifications'),
('Placements', 'placements', 'Placement news and career opportunities'),
('Rankings', 'rankings', 'College rankings and analysis'),
('Careers', 'careers', 'Career guidance and opportunities'),
('Scholarships', 'scholarships', 'Scholarship opportunities and guides'),
('Study Abroad', 'study-abroad', 'International education options');
