-- Reference schema for a NEW, EMPTY marketing database only.
-- This is not a migration for an existing Proto database.
CREATE TABLE early_access_requests (
  email text PRIMARY KEY,
  full_name text,
  role text NOT NULL,
  phone text,
  twitter_handle text,
  excitement text NOT NULL,
  follows_proto boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memo_views (
  email text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
