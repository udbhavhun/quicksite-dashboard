
// Use this script only for development purposes
// To create the customer data tables, run the following in the Supabase SQL editor:

/*
-- Create table for customer-specific content data
CREATE TABLE IF NOT EXISTS public.customer_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id UUID NOT NULL,
  content_type TEXT NOT NULL,  -- e.g., 'faq', 'documentation', 'contact', etc.
  content_key TEXT NOT NULL,   -- specific identifier for the content item
  content_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX customer_content_user_id_idx ON public.customer_content(user_id);
CREATE INDEX customer_content_order_id_idx ON public.customer_content(order_id);
CREATE INDEX customer_content_type_key_idx ON public.customer_content(content_type, content_key);

-- Add Row Level Security (RLS)
ALTER TABLE public.customer_content ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_content table
-- Users can view their own content
CREATE POLICY "Users can view their own content" 
  ON public.customer_content 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own content
CREATE POLICY "Users can create their own content" 
  ON public.customer_content 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own content
CREATE POLICY "Users can update their own content" 
  ON public.customer_content 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins can view all content
CREATE POLICY "Admins can view all content" 
  ON public.customer_content 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert all content
CREATE POLICY "Admins can insert all content" 
  ON public.customer_content 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all content
CREATE POLICY "Admins can update all content" 
  ON public.customer_content 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create table for system-wide dynamic settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Only admins can access system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Admins can view system settings
CREATE POLICY "Admins can view system settings" 
  ON public.system_settings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update system settings
CREATE POLICY "Admins can update system settings" 
  ON public.system_settings 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert system settings
CREATE POLICY "Admins can insert system settings" 
  ON public.system_settings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
*/

// To run this SQL, go to the Supabase SQL Editor and execute it
