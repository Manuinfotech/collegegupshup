-- College Gupshup - Complete Database Schema
-- PostgreSQL Migration for Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- TABLES
-- ============================================

-- States
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, state_id)
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('super_admin', 'manager', 'college_admin', 'student')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'standard', 'premium')),
  description TEXT,
  price_monthly DECIMAL(10, 2) DEFAULT 0,
  price_quarterly DECIMAL(10, 2) DEFAULT 0,
  price_yearly DECIMAL(10, 2) DEFAULT 0,
  features JSONB DEFAULT '[]',
  max_photos INTEGER DEFAULT 20,
  max_courses INTEGER DEFAULT 5,
  max_leads_per_month INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) DEFAULT 'trial' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  razorpay_subscription_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colleges
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  logo_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  short_description VARCHAR(500),
  established_year INTEGER,
  ownership_type VARCHAR(20) CHECK (ownership_type IN ('government', 'private', 'deemed', 'autonomous')),
  accreditation VARCHAR(255),
  affiliation VARCHAR(255),
  university VARCHAR(255),
  campus_area VARCHAR(100),
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city_id UUID REFERENCES cities(id),
  state_id UUID REFERENCES states(id),
  pincode VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  social_media JSONB DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')),
  manager_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK to subscriptions
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE;

-- College Users (many-to-many)
CREATE TABLE college_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(college_id, user_id)
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  degree_type VARCHAR(20) NOT NULL CHECK (degree_type IN ('undergraduate', 'postgraduate', 'diploma', 'doctorate', 'certificate')),
  duration VARCHAR(50),
  duration_years DECIMAL(3, 1),
  fees_min DECIMAL(12, 2),
  fees_max DECIMAL(12, 2),
  eligibility TEXT,
  intake_capacity INTEGER,
  entrance_exams TEXT[] DEFAULT '{}',
  curriculum_url TEXT,
  highlights TEXT[] DEFAULT '{}',
  goal_id UUID REFERENCES goals(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(college_id, slug)
);

-- Course Specializations
CREATE TABLE course_specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fees
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  tuition_fee DECIMAL(12, 2),
  hostel_fee DECIMAL(12, 2),
  examination_fee DECIMAL(12, 2),
  registration_fee DECIMAL(12, 2),
  other_charges DECIMAL(12, 2),
  total_fee DECIMAL(12, 2),
  fee_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placements
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  placement_percentage DECIMAL(5, 2),
  highest_package DECIMAL(12, 2),
  average_package DECIMAL(12, 2),
  median_package DECIMAL(12, 2),
  students_placed INTEGER,
  total_students INTEGER,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(college_id, year)
);

-- Recruiters
CREATE TABLE recruiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faculty
CREATE TABLE faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  department VARCHAR(100),
  qualification VARCHAR(255),
  experience_years INTEGER,
  specialization VARCHAR(255),
  image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galleries
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  category VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brochures
CREATE TABLE brochures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  course_interest VARCHAR(255),
  source VARCHAR(30) NOT NULL CHECK (source IN ('apply_now', 'download_brochure', 'contact_form', 'admission_enquiry')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  razorpay_payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Categories
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  cover_image_url TEXT,
  author_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES blog_categories(id),
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rankings
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  agency VARCHAR(255) NOT NULL,
  rank INTEGER NOT NULL,
  year INTEGER NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(college_id, agency, year, category)
);

-- SEO Meta
CREATE TABLE seo_meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type VARCHAR(50) NOT NULL,
  page_identifier VARCHAR(500) NOT NULL,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  canonical_url TEXT,
  og_image TEXT,
  schema_markup JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_type, page_identifier)
);

-- Advertisements
CREATE TABLE advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  position VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- College Goals (many-to-many)
CREATE TABLE college_goals (
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  PRIMARY KEY (college_id, goal_id)
);

-- Saved Colleges
CREATE TABLE saved_colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Colleges
CREATE INDEX idx_colleges_slug ON colleges(slug);
CREATE INDEX idx_colleges_city ON colleges(city_id);
CREATE INDEX idx_colleges_state ON colleges(state_id);
CREATE INDEX idx_colleges_ownership ON colleges(ownership_type);
CREATE INDEX idx_colleges_status ON colleges(status);
CREATE INDEX idx_colleges_featured ON colleges(is_featured) WHERE is_featured = true;
CREATE INDEX idx_colleges_active ON colleges(is_active) WHERE is_active = true;
CREATE INDEX idx_colleges_name_trgm ON colleges USING gin(name gin_trgm_ops);
CREATE INDEX idx_colleges_manager ON colleges(manager_id);

-- Courses
CREATE INDEX idx_courses_college ON courses(college_id);
CREATE INDEX idx_courses_goal ON courses(goal_id);
CREATE INDEX idx_courses_degree_type ON courses(degree_type);
CREATE INDEX idx_courses_fees ON courses(fees_min, fees_max);

-- Leads
CREATE INDEX idx_leads_college ON leads(college_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_college ON reviews(college_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;

-- Blogs
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_category ON blogs(category_id);
CREATE INDEX idx_blogs_published ON blogs(published_at DESC);

-- Cities
CREATE INDEX idx_cities_state ON cities(state_id);
CREATE INDEX idx_cities_slug ON cities(slug);

-- Placements
CREATE INDEX idx_placements_college ON placements(college_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- College Users
CREATE INDEX idx_college_users_user ON college_users(user_id);
CREATE INDEX idx_college_users_college ON college_users(college_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_fees_updated_at BEFORE UPDATE ON fees FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_placements_updated_at BEFORE UPDATE ON placements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_seo_meta_updated_at BEFORE UPDATE ON seo_meta FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update college average rating
CREATE OR REPLACE FUNCTION update_college_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE colleges
  SET 
    average_rating = (SELECT AVG(rating) FROM reviews WHERE college_id = COALESCE(NEW.college_id, OLD.college_id) AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM reviews WHERE college_id = COALESCE(NEW.college_id, OLD.college_id) AND is_approved = true)
  WHERE id = COALESCE(NEW.college_id, OLD.college_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_college_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_college_rating();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE brochures ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_colleges ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if user is manager
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'manager')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if user belongs to college
CREATE OR REPLACE FUNCTION is_college_member(college_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM college_users WHERE user_id = auth.uid() AND college_id = college_uuid
  ) OR is_super_admin() OR EXISTS (
    SELECT 1 FROM colleges WHERE id = college_uuid AND manager_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- USERS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid() OR is_super_admin());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Super admin can manage users" ON users FOR ALL USING (is_super_admin());

-- COLLEGES policies
CREATE POLICY "Public can view active colleges" ON colleges FOR SELECT USING (is_active = true AND status = 'published');
CREATE POLICY "College members can view own college" ON colleges FOR SELECT USING (is_college_member(id));
CREATE POLICY "College members can update own college" ON colleges FOR UPDATE USING (is_college_member(id));
CREATE POLICY "Super admin can manage colleges" ON colleges FOR ALL USING (is_super_admin());
CREATE POLICY "Managers can view assigned colleges" ON colleges FOR SELECT USING (manager_id = auth.uid());

-- COLLEGE_USERS policies
CREATE POLICY "College members can view" ON college_users FOR SELECT USING (is_college_member(college_id));
CREATE POLICY "Super admin manages college_users" ON college_users FOR ALL USING (is_super_admin());

-- COURSES policies
CREATE POLICY "Public can view active courses" ON courses FOR SELECT USING (is_active = true);
CREATE POLICY "College members can manage courses" ON courses FOR ALL USING (is_college_member(college_id));
CREATE POLICY "Super admin manages courses" ON courses FOR ALL USING (is_super_admin());

-- FEES policies
CREATE POLICY "Public can view fees" ON fees FOR SELECT USING (true);
CREATE POLICY "College members can manage fees" ON fees FOR ALL USING (is_college_member(college_id));

-- PLACEMENTS policies
CREATE POLICY "Public can view placements" ON placements FOR SELECT USING (true);
CREATE POLICY "College members manage placements" ON placements FOR ALL USING (is_college_member(college_id));

-- RECRUITERS policies
CREATE POLICY "Public can view recruiters" ON recruiters FOR SELECT USING (true);
CREATE POLICY "College members manage recruiters" ON recruiters FOR ALL USING (is_college_member(college_id));

-- FACULTY policies
CREATE POLICY "Public can view faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "College members manage faculty" ON faculty FOR ALL USING (is_college_member(college_id));

-- GALLERIES policies
CREATE POLICY "Public can view galleries" ON galleries FOR SELECT USING (true);
CREATE POLICY "College members manage galleries" ON galleries FOR ALL USING (is_college_member(college_id));

-- VIDEOS policies
CREATE POLICY "Public can view videos" ON videos FOR SELECT USING (true);
CREATE POLICY "College members manage videos" ON videos FOR ALL USING (is_college_member(college_id));

-- BROCHURES policies
CREATE POLICY "Public can view brochures" ON brochures FOR SELECT USING (true);
CREATE POLICY "College members manage brochures" ON brochures FOR ALL USING (is_college_member(college_id));

-- REVIEWS policies
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Super admin manages reviews" ON reviews FOR ALL USING (is_super_admin());

-- LEADS policies
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "College members can view leads" ON leads FOR SELECT USING (is_college_member(college_id));
CREATE POLICY "College members can update leads" ON leads FOR UPDATE USING (is_college_member(college_id));
CREATE POLICY "Super admin manages leads" ON leads FOR ALL USING (is_super_admin());

-- PLANS policies
CREATE POLICY "Public can view active plans" ON plans FOR SELECT USING (is_active = true);
CREATE POLICY "Super admin manages plans" ON plans FOR ALL USING (is_super_admin());

-- SUBSCRIPTIONS policies
CREATE POLICY "College members view subscriptions" ON subscriptions FOR SELECT USING (is_college_member(college_id));
CREATE POLICY "Super admin manages subscriptions" ON subscriptions FOR ALL USING (is_super_admin());

-- PAYMENTS policies
CREATE POLICY "College members view payments" ON payments FOR SELECT USING (is_college_member(college_id));
CREATE POLICY "Super admin manages payments" ON payments FOR ALL USING (is_super_admin());

-- BLOGS policies
CREATE POLICY "Public can view published blogs" ON blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage own blogs" ON blogs FOR ALL USING (author_id = auth.uid());
CREATE POLICY "Super admin manages blogs" ON blogs FOR ALL USING (is_super_admin());

-- BLOG_CATEGORIES policies
CREATE POLICY "Public can view categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Super admin manages categories" ON blog_categories FOR ALL USING (is_super_admin());

-- RANKINGS policies
CREATE POLICY "Public can view rankings" ON rankings FOR SELECT USING (true);
CREATE POLICY "College members manage rankings" ON rankings FOR ALL USING (is_college_member(college_id));

-- SEO_META policies
CREATE POLICY "Public can view seo_meta" ON seo_meta FOR SELECT USING (true);
CREATE POLICY "Super admin manages seo" ON seo_meta FOR ALL USING (is_super_admin());

-- ADVERTISEMENTS policies
CREATE POLICY "Public can view active ads" ON advertisements FOR SELECT USING (is_active = true);
CREATE POLICY "Super admin manages ads" ON advertisements FOR ALL USING (is_super_admin());

-- AUDIT_LOGS policies
CREATE POLICY "Super admin can view audit logs" ON audit_logs FOR SELECT USING (is_super_admin());
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- SAVED_COLLEGES policies
CREATE POLICY "Users manage own saved colleges" ON saved_colleges FOR ALL USING (user_id = auth.uid());
