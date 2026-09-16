-- Admissions
CREATE TABLE admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  process TEXT,
  eligibility TEXT,
  application_start_date DATE,
  application_end_date DATE,
  entrance_exams TEXT[],
  counseling_process TEXT,
  documents_required TEXT[],
  selection_criteria TEXT,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Scholarships
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount NUMERIC,
  eligibility TEXT,
  type VARCHAR(100),
  provider VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Hostel Details
CREATE TABLE hostel_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  capacity INTEGER,
  room_types TEXT[],
  fees_per_year NUMERIC,
  facilities TEXT[],
  mess_menu TEXT,
  rules TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hostel_details ENABLE ROW LEVEL SECURITY;

-- Cutoffs
CREATE TABLE cutoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exam_name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  opening_rank INTEGER,
  closing_rank INTEGER,
  cutoff_score NUMERIC,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cutoffs ENABLE ROW LEVEL SECURITY;
