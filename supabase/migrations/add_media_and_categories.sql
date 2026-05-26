-- KYIVHELP — медіа, категорії (TEXT), Storage bucket post-images
-- Supabase Dashboard → SQL Editor → Run

-- =============================================================================
-- 1. image_url + category (enum → TEXT) + district nullable
-- =============================================================================
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE posts ALTER COLUMN category DROP DEFAULT;

ALTER TABLE posts
  ALTER COLUMN category TYPE TEXT
  USING (
    CASE
      WHEN post_type::text = 'need' THEN 'Шукаю допомогу'
      WHEN post_type::text = 'offer' THEN 'Пропоную допомогу'
      ELSE 'Інше'
    END
  );

ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'Інше';

ALTER TABLE posts ALTER COLUMN district DROP NOT NULL;

COMMENT ON COLUMN posts.image_url IS 'Публічне URL фото з Supabase Storage (post-images)';
COMMENT ON COLUMN posts.category IS 'Пропоную допомогу | Шукаю допомогу | Волонтерство | Інше';

CREATE INDEX IF NOT EXISTS idx_posts_category_text ON posts (category)
  WHERE status = 'active';

-- =============================================================================
-- 2. Storage bucket: post-images (public read)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- 3. Storage RLS — публічне читання + завантаження для anon
-- =============================================================================
DROP POLICY IF EXISTS post_images_public_read ON storage.objects;
CREATE POLICY post_images_public_read
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'post-images');

DROP POLICY IF EXISTS post_images_anon_upload ON storage.objects;
CREATE POLICY post_images_anon_upload
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'post-images'
    AND (storage.foldername(name))[1] = 'uploads'
  );

DROP POLICY IF EXISTS post_images_anon_update ON storage.objects;
CREATE POLICY post_images_anon_update
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');
