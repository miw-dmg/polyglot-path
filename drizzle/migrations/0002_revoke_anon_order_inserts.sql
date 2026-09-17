-- Guest orders are now created server-side with a trusted client.
revoke insert on public.orders from anon;
revoke insert on public.order_items from anon;
revoke insert on public.session_bookings from anon;

drop policy if exists "Guests can create orders" on public.orders;
drop policy if exists "Guests can create order items" on public.order_items;
drop policy if exists "Guests can book sessions" on public.session_bookings;
