-- Allow guest (unauthenticated) orders and session bookings

alter table public.orders alter column user_id drop not null;
alter table public.orders add column if not exists guest_email text;

alter table public.session_bookings alter column user_id drop not null;
alter table public.session_bookings add column if not exists guest_email text;
alter table public.session_bookings add column if not exists order_id uuid references public.orders(id) on delete set null;

-- ensure at least one identity on each row
alter table public.orders drop constraint if exists orders_identity_check;
alter table public.orders add constraint orders_identity_check
  check (user_id is not null or guest_email is not null);

alter table public.session_bookings drop constraint if exists session_bookings_identity_check;
alter table public.session_bookings add constraint session_bookings_identity_check
  check (user_id is not null or guest_email is not null);

-- guests may create orders / items / bookings
grant insert on public.orders to anon;
grant insert on public.order_items to anon;
grant insert on public.session_bookings to anon;

drop policy if exists "Guests can create orders" on public.orders;
create policy "Guests can create orders" on public.orders
  for insert to anon
  with check (user_id is null and guest_email is not null);

drop policy if exists "Guests can create order items" on public.order_items;
create policy "Guests can create order items" on public.order_items
  for insert to anon
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id is null)
  );

drop policy if exists "Guests can book sessions" on public.session_bookings;
create policy "Guests can book sessions" on public.session_bookings
  for insert to anon
  with check (user_id is null and guest_email is not null);
