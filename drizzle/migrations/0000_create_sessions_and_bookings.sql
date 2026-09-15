CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  capacity integer NOT NULL DEFAULT 8,
  meeting_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sessions TO anon, authenticated;
GRANT ALL ON public.sessions TO service_role;

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions are publicly viewable"
ON public.sessions FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.session_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.session_bookings TO authenticated;
GRANT ALL ON public.session_bookings TO service_role;

ALTER TABLE public.session_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own bookings"
ON public.session_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Enrolled users book sessions"
ON public.session_bookings FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.sessions s ON s.course_id = e.course_id
    WHERE e.user_id = auth.uid() AND s.id = session_id
  )
);

CREATE POLICY "Users cancel own bookings"
ON public.session_bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE VIEW public.session_booking_counts
AS SELECT session_id, count(*)::integer AS booked_count
FROM public.session_bookings
GROUP BY session_id;

GRANT SELECT ON public.session_booking_counts TO anon, authenticated;
GRANT ALL ON public.session_booking_counts TO service_role;

INSERT INTO public.sessions (course_id, starts_at, duration_minutes, capacity, meeting_url)
SELECT c.id, s.starts_at, 60, 8, 'https://meet.jit.si/linguist-' || c.slug || '-' || to_char(s.starts_at AT TIME ZONE 'Europe/Paris', 'YYYYMMDD-HH24MI')
FROM public.courses c
CROSS JOIN (
  VALUES
    ('anglais-conversationnel', '2026-09-17 18:30:00+02'::timestamptz),
    ('anglais-conversationnel', '2026-09-19 10:00:00+02'::timestamptz),
    ('anglais-conversationnel', '2026-09-22 18:30:00+02'::timestamptz),
    ('anglais-conversationnel', '2026-09-24 18:30:00+02'::timestamptz),
    ('anglais-conversationnel', '2026-09-26 10:00:00+02'::timestamptz),
    ('anglais-conversationnel', '2026-09-29 18:30:00+02'::timestamptz),
    ('anglais-affaires', '2026-09-16 12:30:00+02'::timestamptz),
    ('anglais-affaires', '2026-09-17 18:00:00+02'::timestamptz),
    ('anglais-affaires', '2026-09-21 12:30:00+02'::timestamptz),
    ('anglais-affaires', '2026-09-23 18:00:00+02'::timestamptz),
    ('anglais-affaires', '2026-09-28 12:30:00+02'::timestamptz),
    ('anglais-affaires', '2026-09-30 18:00:00+02'::timestamptz),
    ('anglais-toefl', '2026-09-17 19:00:00+02'::timestamptz),
    ('anglais-toefl', '2026-09-19 14:00:00+02'::timestamptz),
    ('anglais-toefl', '2026-09-22 19:00:00+02'::timestamptz),
    ('anglais-toefl', '2026-09-24 19:00:00+02'::timestamptz),
    ('anglais-toefl', '2026-09-26 14:00:00+02'::timestamptz),
    ('anglais-toefl', '2026-09-29 19:00:00+02'::timestamptz)
) AS s(slug, starts_at)
WHERE c.slug = s.slug;