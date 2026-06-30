
DROP POLICY "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Valid email can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND length(email) <= 254);
