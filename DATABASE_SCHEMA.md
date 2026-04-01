# Comunidade do IAM — Database Schema (Supabase/PostgreSQL)

## Tables

### users
Synced from Clerk via webhook
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Clerk user_id |
| email | text | Email do usuário |
| name | text | Nome completo |
| avatar_url | text | Foto de perfil |
| plan | text | 'free' \| 'pro' |
| created_at | timestamptz | |

### courses
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| slug | text UNIQUE | URL amigável |
| title | text | Nome do curso |
| description | text | |
| thumbnail_url | text | |
| is_published | boolean | |
| order | int | Ordem na lista |
| created_at | timestamptz | |

### lessons
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| course_id | uuid FK → courses | |
| title | text | |
| description | text | |
| video_url | text | URL do Mux/Bunny |
| duration_seconds | int | |
| order | int | |
| is_published | boolean | |
| created_at | timestamptz | |

### lesson_progress
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| user_id | uuid FK → users | |
| lesson_id | uuid FK → lessons | |
| completed | boolean | |
| completed_at | timestamptz | |

### channels
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name | text | Nome do canal |
| description | text | |
| type | text | 'public' \| 'private' |
| created_at | timestamptz | |

### posts
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| channel_id | uuid FK → channels | |
| author_id | uuid FK → users | |
| content | text | |
| media_urls | text[] | |
| created_at | timestamptz | |

### comments
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| post_id | uuid FK → posts | |
| author_id | uuid FK → users | |
| content | text | |
| created_at | timestamptz | |

### messages
Direct messages between users
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| sender_id | uuid FK → users | |
| receiver_id | uuid FK → users | |
| content | text | |
| read | boolean | |
| created_at | timestamptz | |

### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| user_id | uuid FK → users | |
| stripe_subscription_id | text | |
| plan | text | 'pro' |
| status | text | 'active' \| 'canceled' \| 'past_due' |
| current_period_end | timestamptz | |
| created_at | timestamptz | |

## Row Level Security (RLS) Policies

- lesson_progress: users can only read/write their own rows
- messages: users can only read messages where they are sender or receiver
- posts/comments: authenticated users can read; authors can update/delete own
- subscriptions: users can only read their own subscription
