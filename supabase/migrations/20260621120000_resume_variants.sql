-- Create Resume Variants table
CREATE TABLE resume_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL, -- e.g., 'Google Internship', 'Software Engineer'
    template_type VARCHAR(50) DEFAULT 'portfolio', -- 'ats' or 'portfolio'
    is_public_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Ensure only one public default exists at a time
CREATE UNIQUE INDEX only_one_public_default ON resume_variants (is_public_default) WHERE is_public_default = true;

-- Linking tables for specific selections
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

-- Enable RLS
ALTER TABLE resume_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variant_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variant_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variant_experiences ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read resume_variants" ON resume_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read resume_variant_projects" ON resume_variant_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read resume_variant_skills" ON resume_variant_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read resume_variant_experiences" ON resume_variant_experiences FOR SELECT USING (true);

-- Authenticated all access policies
CREATE POLICY "Allow admin all resume_variants" ON resume_variants USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all resume_variant_projects" ON resume_variant_projects USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all resume_variant_skills" ON resume_variant_skills USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all resume_variant_experiences" ON resume_variant_experiences USING (auth.role() = 'authenticated');
