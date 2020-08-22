-- DROP and recreate stories table

DROP TABLE IF EXISTS stories CASCADE;
CREATE TABLE stories (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'No Title',
  content TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  photo_url VARCHAR(255) DEFAULT 'no photo',
  created_at TIMESTAMP NOT NULL
);