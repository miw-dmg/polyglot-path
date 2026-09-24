UPDATE public.sessions SET capacity = 1;
ALTER TABLE public.sessions ALTER COLUMN capacity SET DEFAULT 1;
CREATE UNIQUE INDEX IF NOT EXISTS session_bookings_one_per_session ON public.session_bookings(session_id);