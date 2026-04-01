-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (synced from Clerk via webhook)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  category      TEXT NOT NULL DEFAULT 'Geral',
  duration      TEXT NOT NULL DEFAULT '',
  is_published  BOOLEAN NOT NULL DEFAULT false,
  "order"       INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id        UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  video_url        TEXT,
  duration_seconds INT NOT NULL DEFAULT 0,
  "order"          INT NOT NULL DEFAULT 0,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);

-- ============================================================
-- CHANNELS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.channels (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  type        TEXT NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'private')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id     UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  author_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  media_urls     TEXT[],
  likes_count    INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_channel_id ON public.posts(channel_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- ============================================================
-- POST LIKES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Function to update likes count automatically
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_likes_count
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);

-- Function to update comments count automatically
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_comments_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id   TEXT UNIQUE NOT NULL,
  plan                     TEXT NOT NULL DEFAULT 'pro',
  status                   TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end       TIMESTAMPTZ NOT NULL,
  created_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users: public read, self update
CREATE POLICY "Users are publicly readable" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (clerk_id = current_setting('app.clerk_user_id', true));

-- Courses: public read if published
CREATE POLICY "Published courses are public" ON public.courses FOR SELECT USING (is_published = true);

-- Lessons: public read if published
CREATE POLICY "Published lessons are public" ON public.lessons FOR SELECT USING (is_published = true);

-- Lesson progress: own rows only
CREATE POLICY "Users manage own progress" ON public.lesson_progress
  FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = current_setting('app.clerk_user_id', true)));

-- Channels: public read
CREATE POLICY "Channels are publicly readable" ON public.channels FOR SELECT USING (true);

-- Posts: authenticated read, author write
CREATE POLICY "Posts are publicly readable" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE
  USING (author_id IN (SELECT id FROM public.users WHERE clerk_id = current_setting('app.clerk_user_id', true)));

-- Post likes: authenticated users
CREATE POLICY "Post likes readable by all" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can unlike own likes" ON public.post_likes FOR DELETE
  USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = current_setting('app.clerk_user_id', true)));

-- Comments: public read, authenticated write
CREATE POLICY "Comments are publicly readable" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.comments FOR INSERT WITH CHECK (true);

-- Subscriptions: own only
CREATE POLICY "Users read own subscription" ON public.subscriptions
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = current_setting('app.clerk_user_id', true)));

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default channels
INSERT INTO public.channels (name, description, type) VALUES
  ('geral', 'Canal principal da comunidade', 'public'),
  ('apresentações', 'Se apresente para a comunidade', 'public'),
  ('dúvidas', 'Tire suas dúvidas aqui', 'public'),
  ('cases', 'Compartilhe seus resultados', 'public'),
  ('oportunidades', 'Vagas e oportunidades de negócio', 'public')
ON CONFLICT DO NOTHING;

-- Default courses
INSERT INTO public.courses (slug, title, description, thumbnail_url, category, duration, is_published, "order") VALUES
  ('bootcamp-mental', 'Bootcamp Mental', 'Desenvolva a mentalidade certa para empreender com sucesso.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80', 'Mindset', '4h 30min', true, 1),
  ('financas', 'Finanças', 'Aprenda a gerenciar seu dinheiro e construir patrimônio.', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', 'Finanças', '3h 15min', true, 2),
  ('seu-negocio', 'Seu Negócio', 'Monte, estruture e escale o seu negócio do zero.', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80', 'Negócios', '6h 00min', true, 3),
  ('venda', 'Venda', 'Técnicas e estratégias de vendas para vender mais.', 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&q=80', 'Vendas', '4h 45min', true, 4)
ON CONFLICT (slug) DO NOTHING;
