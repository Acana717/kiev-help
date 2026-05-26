-- KYIVHELP — схема бази даних (Supabase / PostgreSQL)
-- Як запустити: Supabase Dashboard → SQL Editor → New query → вставте цей файл → Run

-- =============================================================================
-- Типи
-- =============================================================================
CREATE TYPE post_type AS ENUM ('need', 'offer');

CREATE TYPE help_category AS ENUM (
  'housing',
  'transport',
  'debris',
  'medicine',
  'finance',
  'other'
);

CREATE TYPE post_status AS ENUM ('active', 'fulfilled', 'hidden', 'removed');

CREATE TYPE report_reason AS ENUM ('scam', 'spam', 'fake', 'duplicate', 'other');

-- =============================================================================
-- Таблиця: posts (оголошення)
-- =============================================================================
CREATE TABLE posts (
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
  views_count INT NOT NULL DEFAULT 0,
  client_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days')
);

CREATE INDEX idx_posts_active_feed ON posts (created_at DESC)
  WHERE status = 'active';

CREATE INDEX idx_posts_district ON posts (district)
  WHERE status = 'active';

CREATE INDEX idx_posts_category ON posts (category)
  WHERE status = 'active';

CREATE INDEX idx_posts_type ON posts (post_type)
  WHERE status = 'active';

-- =============================================================================
-- Таблиця: reports (скарги)
-- =============================================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reason report_reason NOT NULL DEFAULT 'other',
  details TEXT CHECK (char_length(details) <= 500),
  reporter_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, reporter_fingerprint)
);

CREATE INDEX idx_reports_post ON reports (post_id);

-- =============================================================================
-- Таблиця: publish_rate_limits (анти-спам, 3 пости/год)
-- =============================================================================
CREATE TABLE publish_rate_limits (
  fingerprint TEXT PRIMARY KEY,
  post_count INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- Тригери
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION increment_report_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET report_count = report_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_insert
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION increment_report_count();

CREATE OR REPLACE FUNCTION auto_hide_reported_posts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET status = 'hidden'
  WHERE id = NEW.post_id AND report_count >= 5 AND status = 'active';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_report_auto_hide
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION auto_hide_reported_posts();

-- =============================================================================
-- Лічильник переглядів (atomic RPC + Realtime)
-- =============================================================================
CREATE OR REPLACE FUNCTION increment_post_views(p_post_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE posts
  SET views_count = views_count + 1
  WHERE id = p_post_id AND status = 'active'
  RETURNING views_count INTO v_count;

  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION increment_post_views(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO service_role;

ALTER TABLE posts REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE posts;
  END IF;
END $$;

-- =============================================================================
-- Row Level Security (RLS)
-- API Next.js використовує service_role — запис через серверні routes
-- =============================================================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_public_read ON posts
  FOR SELECT USING (status = 'active');

CREATE POLICY posts_insert_service ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY reports_insert_anon ON reports
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE posts IS 'KYIVHELP — оголошення взаємодопомоги';
COMMENT ON COLUMN posts.phone_enc IS 'Контакт; віддається лише через /api/posts/[id]/reveal';
COMMENT ON COLUMN posts.card_number_enc IS 'Номер картки; лише через reveal API';
