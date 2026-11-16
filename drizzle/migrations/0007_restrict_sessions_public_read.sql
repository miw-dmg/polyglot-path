drop policy if exists "Sessions are publicly viewable" on public.sessions;

create policy "Users view sessions they booked"
on public.sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.session_bookings sb
    where sb.session_id = sessions.id
      and sb.user_id = auth.uid()
  )
);

create or replace view public.session_availability as
select id, course_id, starts_at, duration_minutes, capacity
from public.sessions
where starts_at > now() - interval '1 hour';

grant select on public.session_availability to anon, authenticated;
grant select on public.session_availability to service_role;