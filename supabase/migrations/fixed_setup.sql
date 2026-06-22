-- 1. DROP EXISTING TABLES TO ENSURE CLEAN SLATE
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS visitor_sessions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS now_status CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS resume_versions CASCADE;
DROP TABLE IF EXISTS resume_variant_projects CASCADE;
DROP TABLE IF EXISTS resume_variant_skills CASCADE;
DROP TABLE IF EXISTS resume_variant_experiences CASCADE;
DROP TABLE IF EXISTS resume_variants CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS project_metrics CASCADE;
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS seo_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. ENABLE UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CREATE CORE TABLES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  title TEXT,
  bio TEXT,
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  problem_statement TEXT,
  solution TEXT,
  architecture TEXT,
  challenges TEXT,
  lessons_learned TEXT,
  live_url TEXT,
  github_url TEXT,
  demo_video_url TEXT,
  tech_stack TEXT[],
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  grade TEXT,
  description TEXT
);

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  credential_url TEXT
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER,
  icon_name TEXT
);

-- 4. CREATE ANALYTICS TABLE (Unified)
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(255) NOT NULL, 
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, 
    metadata JSONB, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. CREATE RESUME VARIANTS TABLES
CREATE TABLE resume_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL, 
    template_type VARCHAR(50) DEFAULT 'portfolio', 
    is_public_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE UNIQUE INDEX only_one_public_default ON resume_variants (is_public_default) WHERE is_public_default = true;

CREATE TABLE resume_variant_projects (
    variant_id UUID REFERENCES resume_variants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (variant_id, project_id)
);

CREATE TABLE resume_variant_skills (
    variant_id UUID REFERENCES resume_variants(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (variant_id, skill_id)
);

CREATE TABLE resume_variant_experiences (
    variant_id UUID REFERENCES resume_variants(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
    PRIMARY KEY (variant_id, experience_id)
);

-- 6. SETUP ROW LEVEL SECURITY
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variant_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variant_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variant_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON projects FOR SELECT USING (true);

CREATE POLICY "Allow public insert to analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read analytics_events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read resume_variants" ON resume_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read resume_variant_projects" ON resume_variant_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read resume_variant_skills" ON resume_variant_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read resume_variant_experiences" ON resume_variant_experiences FOR SELECT USING (true);

CREATE POLICY "Allow admin all resume_variants" ON resume_variants USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all resume_variant_projects" ON resume_variant_projects USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all resume_variant_skills" ON resume_variant_skills USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all resume_variant_experiences" ON resume_variant_experiences USING (auth.role() = 'authenticated');
