CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL
);

CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  description TEXT
);