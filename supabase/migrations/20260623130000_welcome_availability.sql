-- Add welcome_message and availability_status columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS welcome_message TEXT DEFAULT 'WELCOME TO MY PORTFOLIO';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'Available for Internship · Summer 2026';
