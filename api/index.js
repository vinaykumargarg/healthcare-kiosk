import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// ── Auth ────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { data, error } = await supabase
    .from('Users').select('*').eq('username', req.body.username).single();
  if (error) return res.status(401).json({ error: 'User not found. Please register.' });
  res.json({ user: data });
});

app.post('/api/register', async (req, res) => {
  const { name, mobile, role = 'patient', state = 'UP', district = '' } = req.body;
  const { data, error } = await supabase
    .from('Users').insert({ username: mobile, role, name, state, district }).select().single();
  if (error) return res.status(400).json({ error: 'Mobile number already registered.' });
  res.json({ user: data });
});

app.put('/api/user', async (req, res) => {
  const { id, name, state, district } = req.body;
  const { error } = await supabase
    .from('Users').update({ name, state, district }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Providers ──────────────────────────────────────────
app.get('/api/providers', async (req, res) => {
  const { type, state, district, query } = req.query;
  let q = supabase.from('Providers').select('*');
  if (type && type !== 'all') q = q.eq('type', type);
  if (state) q = q.eq('state', state);
  if (district) q = q.ilike('district', `%${district}%`);
  if (query) q = q.or(`name.ilike.%${query}%,services.ilike.%${query}%`);
  q = q.order('rating', { ascending: false }).limit(50);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/providers/:id', async (req, res) => {
  const { data, error } = await supabase.from('Providers').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

app.post('/api/providers', async (req, res) => {
  const { type, name, name_hi, address, pincode, district, state, phone, whatsapp, services, timings, accepts_ayushman, accepts_pmjay, license, owner_user_id } = req.body;
  const { data, error } = await supabase.from('Providers').insert({
    type, name, name_hi: name_hi || '', address, pincode, district, state, phone,
    whatsapp: whatsapp || '', services: JSON.stringify(services || []), timings: timings || '',
    accepts_ayushman: accepts_ayushman ? 1 : 0, accepts_pmjay: accepts_pmjay ? 1 : 0,
    license: license || '', owner_user_id: owner_user_id || null
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id: data.id });
});

app.put('/api/providers/:id', async (req, res) => {
  const { open_now, name, address, phone, services, timings } = req.body;
  const { error } = await supabase.from('Providers').update({
    open_now: open_now ? 1 : 0, name, address, phone,
    services: JSON.stringify(services || []), timings
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/my-providers/:userId', async (req, res) => {
  const { data, error } = await supabase.from('Providers').select('*').eq('owner_user_id', req.params.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Blood Donors ──────────────────────────────────────
app.get('/api/blood-donors', async (req, res) => {
  const { blood_group, state, district } = req.query;
  let q = supabase.from('BloodDonors').select('*').eq('available', 1);
  if (blood_group) q = q.eq('blood_group', blood_group);
  if (state) q = q.eq('state', state);
  if (district) q = q.ilike('district', `%${district}%`);
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/blood-donors', async (req, res) => {
  const { name, blood_group, district, state, phone } = req.body;
  const { data, error } = await supabase.from('BloodDonors').insert({ name, blood_group, district, state, phone }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id: data.id });
});

// ── Queue ─────────────────────────────────────────────
app.get('/api/queue', async (req, res) => {
  const { data, error } = await supabase
    .from('Queue').select('*, Patients(name, age, gender)').order('timestamp', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  const rows = data.map(r => ({ ...r, ...r.Patients, Patients: undefined }));
  res.json(rows);
});

app.post('/api/queue', async (req, res) => {
  const { patient_name, age, gender, triage_notes } = req.body;
  const { data: patient } = await supabase.from('Patients').insert({ name: patient_name, age: age || 0, gender: gender || 'U' }).select().single();
  if (!patient) return res.status(500).json({ error: 'Failed to create patient' });
  const { data: queue, error } = await supabase.from('Queue').insert({ patient_id: patient.id, status: 'waiting', triage_notes }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, queue_id: queue.id });
});

app.put('/api/queue/:id', async (req, res) => {
  const { error } = await supabase.from('Queue').update({ status: req.body.status }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Patient Bookings ──────────────────────────────────
app.get('/api/patient/:name/bookings', async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const { data: patient } = await supabase.from('Patients').select('id').eq('name', name).single();
  if (!patient) return res.json({ queue: null, diagnostics: [] });
  const { data: queue } = await supabase.from('Queue').select('*').eq('patient_id', patient.id).not('status', 'in', '("completed","cancelled")').order('timestamp', { ascending: false }).limit(1).single();
  const { data: diagnostics } = await supabase.from('DiagnosticRequests').select('*').eq('patient_id', patient.id).not('status', 'in', '("completed","cancelled")').order('timestamp', { ascending: false });
  res.json({ queue: queue || null, diagnostics: diagnostics || [] });
});

// ── Diagnostics ───────────────────────────────────────
app.get('/api/diagnostics', async (req, res) => {
  const { data, error } = await supabase.from('DiagnosticRequests').select('*').order('timestamp', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/diagnostics', async (req, res) => {
  const { patient_name, test_type, request_type, location, scheduled_date, scheduled_time } = req.body;
  const { data: patient } = await supabase.from('Patients').insert({ name: patient_name }).select().single();
  const { data, error } = await supabase.from('DiagnosticRequests').insert({
    patient_id: patient.id, test_type, request_type, location, status: 'Scheduled', scheduled_date, scheduled_time
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id: data.id });
});

// ── Vitals ────────────────────────────────────────────
app.post('/api/vitals', async (req, res) => {
  const { patient_name, bp, sugar, weight } = req.body;
  const { error } = await supabase.from('Vitals').insert({ patient_name, bp, sugar, weight });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/vitals/:name', async (req, res) => {
  const { data, error } = await supabase.from('Vitals').select('*').eq('patient_name', decodeURIComponent(req.params.name)).order('timestamp', { ascending: false }).limit(10);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Static / Mock ─────────────────────────────────────
app.get('/api/doctors', (req, res) => {
  res.json([
    { id: 1, name: "Dr. Anil Sharma", name_hi: "डॉ. अनिल शर्मा", specialty: "General Physician", specialty_hi: "सामान्य चिकित्सक", fee: 200, exp: "12 yrs" },
    { id: 2, name: "Dr. Rekha Gupta", name_hi: "डॉ. रेखा गुप्ता", specialty: "Gynaecologist", specialty_hi: "स्त्री रोग विशेषज्ञ", fee: 350, exp: "15 yrs" },
    { id: 3, name: "Dr. Priya Joshi", name_hi: "डॉ. प्रिया जोशी", specialty: "Paediatrician", specialty_hi: "बाल रोग विशेषज्ञ", fee: 250, exp: "8 yrs" },
    { id: 4, name: "Dr. Suresh Patel", name_hi: "डॉ. सुरेश पटेल", specialty: "Cardiologist", specialty_hi: "हृदय रोग विशेषज्ञ", fee: 500, exp: "20 yrs" },
    { id: 5, name: "Dr. Meena Verma", name_hi: "डॉ. मीना वर्मा", specialty: "Dermatologist", specialty_hi: "त्वचा रोग विशेषज्ञ", fee: 300, exp: "10 yrs" },
  ]);
});

app.get('/api/labs', (req, res) => {
  res.json([
    { id: 1, name: "Surajpur Primary Health Lab", name_hi: "सूरजपुर प्राथमिक स्वास्थ्य लैब", tests: "CBC, Malaria, Typhoid", fee: "₹50–200", distance: "0.5 km" },
    { id: 2, name: "Asha Wellness & Diagnostics", name_hi: "आशा वेलनेस डायग्नोस्टिक्स", tests: "X-Ray, Ultrasound, ECG", fee: "₹200–800", distance: "2.1 km" },
    { id: 3, name: "City Central Diagnostics", name_hi: "सिटी सेंट्रल डायग्नोस्टिक्स", tests: "MRI, CT Scan, PET Scan", fee: "₹1000–5000", distance: "5.3 km" },
  ]);
});

app.get('/api/awareness', (req, res) => {
  res.json([
    { type: "Yojna", title: "Ayushman Bharat PM-JAY", title_hi: "आयुष्मान भारत PM-JAY", desc: "Free healthcare up to ₹5 Lakhs/family/year.", desc_hi: "₹5 लाख तक मुफ्त इलाज।" },
    { type: "Yojna", title: "PMJSY Maternity Scheme", title_hi: "PMJSY मातृत्व योजना", desc: "₹6,000 benefit for pregnant women.", desc_hi: "गर्भवती महिलाओं को ₹6,000 सहायता।" },
    { type: "Yojna", title: "Jan Aushadhi Scheme", title_hi: "जन औषधि योजना", desc: "Generic medicines 50-90% cheaper.", desc_hi: "जेनेरिक दवाएं 50-90% सस्ती।" },
    { type: "Tip", title: "Monsoon Health Alert", title_hi: "मानसून सावधानी", desc: "Boil water, use mosquito nets.", desc_hi: "पानी उबालें, मच्छरदानी प्रयोग करें।" },
    { type: "Tip", title: "Nutrition for Mothers", title_hi: "माँ के लिए पोषण", desc: "Spinach, jaggery, lentils prevent anemia.", desc_hi: "पालक, गुड़, दाल खाएं।" },
    { type: "Tip", title: "Child Vaccination", title_hi: "बच्चों का टीकाकरण", desc: "Ensure all vaccines per govt schedule.", desc_hi: "सरकारी कार्यक्रम के अनुसार टीके लगवाएं।" },
  ]);
});

// ── Medicines ─────────────────────────────────────────
app.get('/api/medicines/:name', async (req, res) => {
  const { data, error } = await supabase.from('Medicines').select('*').eq('patient_name', decodeURIComponent(req.params.name)).eq('active', 1).order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/medicines', async (req, res) => {
  const { patient_name, name, dose, time } = req.body;
  const { data, error } = await supabase.from('Medicines').insert({ patient_name, name, dose, time }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id: data.id });
});

app.delete('/api/medicines/:id', async (req, res) => {
  const { error } = await supabase.from('Medicines').update({ active: 0 }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── AI Symptoms ───────────────────────────────────────
app.post('/api/ai/symptoms', (req, res) => {
  const s = (req.body.symptoms || '').toLowerCase();
  let report = "General check recommended. Consult a physician.";
  let severity = "low";
  if (s.includes('fever') || s.includes('cough')) { report = "Possible viral/flu. Check temperature, SpO2."; severity = "medium"; }
  if (s.includes('chest') || s.includes('breath')) { report = "URGENT: Possible cardiac distress. Seek immediate care!"; severity = "high"; }
  if (s.includes('vomit') || s.includes('diarrhea')) { report = "Gastroenteritis likely. Stay hydrated — take ORS."; severity = "medium"; }
  if (s.includes('pregnan') || s.includes('pregnant')) { report = "Consult gynaecologist. Monitor fetal movement."; severity = "medium"; }
  if (s.includes('sugar') || s.includes('diabetes')) { report = "Check blood glucose. Avoid sweets, consult physician."; severity = "medium"; }
  setTimeout(() => res.json({ report, severity }), 800);
});

export default app;
