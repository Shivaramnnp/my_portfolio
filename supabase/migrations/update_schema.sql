-- 1. Update public.profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS os_name TEXT DEFAULT 'ShivaOS';

-- 2. Update public.projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Update public.experiences table
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 4. Update public.education table
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 5. Update and fix public.certifications table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certifications' AND column_name='name') THEN
    ALTER TABLE public.certifications RENAME COLUMN name TO title;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certifications' AND column_name='issuing_organization') THEN
    ALTER TABLE public.certifications RENAME COLUMN issuing_organization TO issuer;
  END IF;
END $$;

ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 6. Create public.posts (blog) table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on public.posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid errors
DROP POLICY IF EXISTS "Public read posts" ON public.posts;
DROP POLICY IF EXISTS "Admin all posts" ON public.posts;

-- Create policies for posts table
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admin all posts" ON public.posts USING (auth.role() = 'authenticated');
