-- Paste this in Supabase SQL Editor and run it

CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient',
  name TEXT NOT NULL DEFAULT '',
  state TEXT DEFAULT 'UP',
  district TEXT DEFAULT 'Gautam Buddh Nagar'
);

CREATE TABLE IF NOT EXISTS "Patients" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER DEFAULT 0,
  gender TEXT DEFAULT 'U',
  contact TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS "Queue" (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES "Patients"(id),
  status TEXT NOT NULL DEFAULT 'waiting',
  triage_notes TEXT DEFAULT '',
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "DiagnosticRequests" (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES "Patients"(id),
  test_type TEXT NOT NULL DEFAULT '',
  request_type TEXT DEFAULT '',
  location TEXT DEFAULT '',
  status TEXT DEFAULT 'Scheduled',
  scheduled_date TEXT DEFAULT '',
  scheduled_time TEXT DEFAULT '',
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Vitals" (
  id SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL DEFAULT '',
  bp TEXT DEFAULT '',
  sugar TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Medicines" (
  id SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL DEFAULT '',
  name TEXT DEFAULT '',
  dose TEXT DEFAULT '',
  time TEXT DEFAULT 'Morning',
  active INTEGER DEFAULT 1,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Providers" (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  name_hi TEXT DEFAULT '',
  address TEXT DEFAULT '',
  pincode TEXT DEFAULT '',
  district TEXT DEFAULT '',
  state TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  services TEXT DEFAULT '[]',
  timings TEXT DEFAULT '',
  rating REAL DEFAULT 4.0,
  accepts_ayushman INTEGER DEFAULT 0,
  accepts_pmjay INTEGER DEFAULT 0,
  open_now INTEGER DEFAULT 1,
  license TEXT DEFAULT '',
  owner_user_id INTEGER DEFAULT NULL,
  verified INTEGER DEFAULT 0,
  lat REAL DEFAULT 0,
  lng REAL DEFAULT 0,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "BloodDonors" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  blood_group TEXT DEFAULT '',
  district TEXT DEFAULT '',
  state TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  last_donated TEXT DEFAULT '',
  available INTEGER DEFAULT 1,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Seed Users
INSERT INTO "Users" (username, role, name, state, district) VALUES
  ('kiosk1', 'operator', 'Kiosk Operator (Surajpur)', 'UP', 'Gautam Buddh Nagar'),
  ('doctor1', 'doctor', 'Dr. Anil Sharma', 'UP', 'Gautam Buddh Nagar'),
  ('provider1', 'provider', 'Asha Wellness Lab', 'UP', 'Gautam Buddh Nagar')
ON CONFLICT (username) DO NOTHING;

-- Seed Patients
INSERT INTO "Patients" (name, age, gender, contact) VALUES
  ('Ramesh Kumar', 45, 'M', '9876543210'),
  ('Sunita Devi', 38, 'F', '9876543211')
ON CONFLICT DO NOTHING;

-- Seed Queue
INSERT INTO "Queue" (patient_id, status, triage_notes) VALUES
  (1, 'waiting', 'Fever and severe body ache for 3 days.')
ON CONFLICT DO NOTHING;

-- Seed Diagnostic Requests
INSERT INTO "DiagnosticRequests" (patient_id, test_type, request_type, location, status) VALUES
  (2, 'Chest X-Ray', 'Mobile Van', 'Village Jewar Center', 'Scheduled')
ON CONFLICT DO NOTHING;

-- Seed Providers
INSERT INTO "Providers" (type, name, name_hi, address, pincode, district, state, phone, whatsapp, services, timings, rating, accepts_ayushman, accepts_pmjay, open_now, verified, lat, lng) VALUES
  ('lab', 'Surajpur Primary Health Lab', 'सूरजपुर प्राथमिक स्वास्थ्य लैब', 'Main Market, Surajpur', '201306', 'Gautam Buddh Nagar', 'UP', '+91 98765 43210', '+91 98765 43210', '["CBC","Malaria Antigen","Typhoid","Sugar","Urine"]', '8AM–8PM', 4.8, 1, 1, 1, 1, 28.5736, 77.5099),
  ('lab', 'Asha Wellness & Diagnostics', 'आशा वेलनेस डायग्नोस्टिक्स', 'Near Panchayat Bhawan, Jewar', '203135', 'Gautam Buddh Nagar', 'UP', '+91 91234 56789', '+91 91234 56789', '["X-Ray","Ultrasound","ECG","Lipid Panel"]', '7AM–9PM', 4.5, 1, 1, 1, 1, 28.1196, 77.5577)
ON CONFLICT DO NOTHING;

-- Seed Blood Donors
INSERT INTO "BloodDonors" (name, blood_group, district, state, phone, last_donated, available) VALUES
  ('Vikram Singh', 'A+', 'Gautam Buddh Nagar', 'UP', '+91 98765 11111', '2024-01-10', 1)
ON CONFLICT DO NOTHING;
