INSERT INTO public.courses (slug,title,language,level,format,price_cents,summary,description,duration_hours,is_featured)
VALUES ('cours-a-la-demande','Cours à la demande - 1H','Anglais','debutant','live',5000,'Réservez vos cours un par un.','Choisissez cette option si vous souhaitez réserver vos cours un par un.',1,false)
ON CONFLICT DO NOTHING;
INSERT INTO public.sessions (course_id, starts_at, duration_minutes, capacity, meeting_url)
SELECT c.id, t, 60, 1, 'https://meet.jit.si/linguist-demande-' || to_char(t,'YYYYMMDDHH24MI')
FROM public.courses c, (VALUES
 ('2026-09-28 08:00+00'::timestamptz),('2026-09-29 12:00+00'),('2026-09-30 16:30+00'),
 ('2026-10-01 08:00+00'),('2026-10-02 12:00+00'),('2026-10-05 16:30+00')) v(t)
WHERE c.slug='cours-a-la-demande';