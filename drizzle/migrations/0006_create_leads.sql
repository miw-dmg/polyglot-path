CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  goal text NOT NULL CHECK (char_length(goal) <= 100),
  source text CHECK (source IS NULL OR char_length(source) <= 200),
  booked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;