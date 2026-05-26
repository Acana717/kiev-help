-- KYIVHELP — ізольована таблиця для scripts/verify-ads.ts
-- Запустіть один раз: Supabase Dashboard → SQL Editor → Run

CREATE TABLE IF NOT EXISTS test_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type post_type NOT NULL,
  category help_category NOT NULL DEFAULT 'other',
  district TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  phone_enc TEXT,
  telegram_enc TEXT,
  card_number_enc TEXT,
  bank_name TEXT,
  jar_link_enc TEXT,
  status post_status NOT NULL DEFAULT 'active',
  report_count INT NOT NULL DEFAULT 0,
  client_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days')
);

CREATE INDEX IF NOT EXISTS idx_test_posts_created ON test_posts (created_at DESC);

DROP TRIGGER IF EXISTS test_posts_updated_at ON test_posts;
CREATE TRIGGER test_posts_updated_at
  BEFORE UPDATE ON test_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE test_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS test_posts_service_all ON test_posts;
CREATE POLICY test_posts_service_all ON test_posts
  FOR ALL USING (true) WITH CHECK (true);

COMMENT ON TABLE test_posts IS 'KYIVHELP — технічна таблиця для npm run test (verify-ads.ts), не використовується фронтендом';
