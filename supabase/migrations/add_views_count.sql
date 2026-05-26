-- KYIVHELP — лічильник переглядів + Realtime
-- Запустіть у Supabase Dashboard → SQL Editor → Run
-- Або: npm run db:views (якщо задано SUPABASE_DB_URL у .env.local)

-- =============================================================================
-- 1. Колонка views_count
-- =============================================================================
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN posts.views_count IS 'Кількість переглядів оголошення';

-- =============================================================================
-- 2. Атомарне збільшення (RPC)
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

-- =============================================================================
-- 3. Supabase Realtime для миттєвого оновлення views_count
-- =============================================================================
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
