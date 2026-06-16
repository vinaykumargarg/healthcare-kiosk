const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  // ── Tables ─────────────────────────────────────────────────────────
  db.run(`CREATE TABLE Users (
    id INTEGER PRIMARY KEY, username TEXT UNIQUE, role TEXT,
    name TEXT, state TEXT DEFAULT 'UP', district TEXT DEFAULT 'Gautam Buddh Nagar')`);

  db.run(`CREATE TABLE Patients (
    id INTEGER PRIMARY KEY, name TEXT, age INTEGER, gender TEXT, contact TEXT)`);

  db.run(`CREATE TABLE Queue (
    id INTEGER PRIMARY KEY, patient_id INTEGER, status TEXT,
    triage_notes TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  db.run(`CREATE TABLE DiagnosticRequests (
    id INTEGER PRIMARY KEY, patient_id INTEGER, test_type TEXT,
    request_type TEXT, location TEXT, status TEXT,
    scheduled_date TEXT, scheduled_time TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  db.run(`CREATE TABLE Vitals (
    id INTEGER PRIMARY KEY, patient_name TEXT, bp TEXT,
    sugar TEXT, weight TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  db.run(`CREATE TABLE Medicines (
    id INTEGER PRIMARY KEY, patient_name TEXT, name TEXT,
    dose TEXT, time TEXT, active INTEGER DEFAULT 1,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  db.run(`CREATE TABLE Providers (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    name_hi TEXT,
    address TEXT,
    pincode TEXT,
    district TEXT,
    state TEXT,
    phone TEXT,
    whatsapp TEXT,
    services TEXT,
    timings TEXT,
    rating REAL DEFAULT 4.0,
    accepts_ayushman INTEGER DEFAULT 0,
    accepts_pmjay INTEGER DEFAULT 0,
    open_now INTEGER DEFAULT 1,
    license TEXT,
    owner_user_id INTEGER,
    verified INTEGER DEFAULT 0,
    lat REAL,
    lng REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  db.run(`CREATE TABLE BloodDonors (
    id INTEGER PRIMARY KEY,
    name TEXT, blood_group TEXT, district TEXT, state TEXT,
    phone TEXT, last_donated TEXT,
    available INTEGER DEFAULT 1,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  // ── Seed Users ────────────────────────────────────────────────────
  const uStmt = db.prepare("INSERT INTO Users (username,role,name,state,district) VALUES (?,?,?,?,?)");
  uStmt.run('kiosk1',   'operator', 'Kiosk Operator (Surajpur)', 'UP', 'Gautam Buddh Nagar');
  uStmt.run('doctor1',  'doctor',   'Dr. Anil Sharma',           'UP', 'Gautam Buddh Nagar');
  uStmt.run('provider1','provider', 'Asha Wellness Lab',          'UP', 'Gautam Buddh Nagar');
  uStmt.finalize();

  // ── Seed Patients ─────────────────────────────────────────────────
  db.run("INSERT INTO Patients (name,age,gender,contact) VALUES ('Ramesh Kumar',45,'M','9876543210')");
  db.run("INSERT INTO Patients (name,age,gender,contact) VALUES ('Sunita Devi',38,'F','9876543211')");
  db.run("INSERT INTO Queue (patient_id,status,triage_notes) VALUES (1,'waiting','Fever and severe body ache for 3 days.')");
  db.run("INSERT INTO DiagnosticRequests (patient_id,test_type,request_type,location,status) VALUES (2,'Chest X-Ray','Mobile Van','Village Jewar Center','Scheduled')");

  // ── Seed Providers (15 across 5 states) ──────────────────────────
  const pStmt = db.prepare(`INSERT INTO Providers
    (type,name,name_hi,address,pincode,district,state,phone,whatsapp,services,timings,rating,accepts_ayushman,accepts_pmjay,open_now,verified,lat,lng)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

  // Uttar Pradesh
  pStmt.run('lab','Surajpur Primary Health Lab','सूरजपुर प्राथमिक स्वास्थ्य लैब','Main Market, Surajpur','201306','Gautam Buddh Nagar','UP','+91 98765 43210','+91 98765 43210','["CBC","Malaria Antigen","Typhoid","Sugar","Urine"]','8AM–8PM',4.8,1,1,1,1,28.5736,77.5099);
  pStmt.run('lab','Asha Wellness & Diagnostics','आशा वेलनेस डायग्नोस्टिक्स','Near Panchayat Bhawan, Jewar','203135','Gautam Buddh Nagar','UP','+91 91234 56789','+91 91234 56789','["X-Ray","Ultrasound","ECG","Lipid Panel"]','7AM–9PM',4.5,1,1,1,1,28.1196,77.5577);
  pStmt.run('lab','City Central Diagnostics','सिटी सेंट्रल डायग्नोस्टिक्स','District Hospital Road, Greater Noida','201310','Gautam Buddh Nagar','UP','+91 99887 76655','+91 99887 76655','["MRI","CT Scan","PET Scan","Biopsy"]','24 hrs',4.2,1,1,1,1,28.4744,77.5040);
  pStmt.run('pharmacy','Jan Aushadhi Kendra','जन औषधि केंद्र','Ward 5, Surajpur Market','201306','Gautam Buddh Nagar','UP','+91 70012 34567','+91 70012 34567','["Generic Medicines","Vitamins","Surgical"]','8AM–10PM',4.6,0,0,1,1,28.5740,77.5110);
  pStmt.run('doctor','Dr. Rekha Gupta','डॉ. रेखा गुप्ता','Clinic 12, Civil Lines, Noida','201301','Gautam Buddh Nagar','UP','+91 88001 22334','+91 88001 22334','["General Physician","Diabetes","Hypertension"]','10AM–6PM',4.9,0,0,1,1,28.5706,77.3219);
  pStmt.run('hospital','Kailash Hospital','कैलाश हॉस्पिटल','Sector 27, Noida','201301','Gautam Buddh Nagar','UP','+91 120-4444444','+91 98100 44444','["Emergency","ICU","Surgery","Maternity","Ortho"]','24 hrs',4.4,1,1,1,1,28.5686,77.3207);

  // Madhya Pradesh
  pStmt.run('lab','Bhopal Diagnostics Hub','भोपाल डायग्नोस्टिक्स हब','MP Nagar, Bhopal','462011','Bhopal','MP','+91 75512 34567','+91 75512 34567','["CBC","Thyroid","Hormones","X-Ray"]','8AM–8PM',4.3,1,1,1,0,23.2332,77.4272);
  pStmt.run('pharmacy','Medico Pharma','मेडिको फार्मा','Near Bus Stand, Vidisha','464001','Vidisha','MP','+91 76812 98765',null,'["All Medicines","Ayurvedic","Baby Products"]','9AM–9PM',4.1,0,0,1,0,23.5244,77.8129);
  pStmt.run('doctor','Dr. Suresh Patel','डॉ. सुरेश पटेल','Gandhi Nagar, Indore','452001','Indore','MP','+91 73122 11223','+91 73122 11223','["Cardiologist","ECG","Heart Checkup"]','11AM–5PM',4.7,0,0,1,1,22.7196,75.8577);

  // Rajasthan
  pStmt.run('lab','Jaipur Path Labs','जयपुर पैथ लैब्स','Malviya Nagar, Jaipur','302017','Jaipur','RJ','+91 94123 45678','+91 94123 45678','["Full Body Checkup","CBC","Kidney","Liver"]','7AM–9PM',4.6,1,1,1,1,26.8467,75.8056);
  pStmt.run('hospital','SMS Hospital (Govt)','SMS सरकारी अस्पताल','JLN Marg, Jaipur','302004','Jaipur','RJ','+91 141-2518888',null,'["Emergency","Trauma","ICU","Cancer","Eye"]','24 hrs',4.0,1,1,1,1,26.9124,75.8216);

  // Bihar
  pStmt.run('lab','Patna Diagnostics Centre','पटना डायग्नोस्टिक्स सेंटर','Exhibition Road, Patna','800001','Patna','BR','+91 61222 34567','+91 61222 34567','["Dengue","Malaria","Typhoid","Pregnancy Test"]','8AM–8PM',4.2,1,0,1,0,25.6093,85.1376);
  pStmt.run('pharmacy','Bihar Medical Store','बिहार मेडिकल स्टोर','Station Road, Gaya','823001','Gaya','BR','+91 96310 11223',null,'["All Medicines","Surgical","Equipment"]','8AM–10PM',4.0,0,0,1,0,24.7955,85.0002);

  // Maharashtra
  pStmt.run('lab','Pune Pathology Lab','पुणे पैथोलॉजी लैब','Shivajinagar, Pune','411005','Pune','MH','+91 20-12345678','+91 98220 12345','["NABL Accredited","MRI","CT","All Tests"]','6AM–10PM',4.9,1,1,1,1,18.5204,73.8567);
  pStmt.run('doctor','Dr. Priya Joshi','डॉ. प्रिया जोशी','FC Road, Pune','411004','Pune','MH','+91 98200 56789','+91 98200 56789','["Gynecologist","Obstetrics","Fertility","Maternity"]','10AM–7PM',4.8,0,0,1,1,18.5208,73.8552);
  pStmt.finalize();

  // ── Seed Blood Donors ─────────────────────────────────────────────
  const bStmt = db.prepare("INSERT INTO BloodDonors (name,blood_group,district,state,phone,last_donated,available) VALUES (?,?,?,?,?,?,?)");
  bStmt.run('Vikram Singh',  'A+', 'Gautam Buddh Nagar','UP','+91 98765 11111','2024-01-10',1);
  bStmt.run('Meera Sharma',  'B+', 'Gautam Buddh Nagar','UP','+91 98765 22222','2024-02-15',1);
  bStmt.run('Ajay Kumar',    'O+', 'Bhopal',            'MP','+91 75511 33333','2024-03-01',1);
  bStmt.run('Priya Verma',   'AB+','Jaipur',            'RJ','+91 94122 44444','2024-01-20',1);
  bStmt.run('Sanjay Mishra', 'O-', 'Patna',             'BR','+91 61222 55555','2024-02-28',1);
  bStmt.run('Sunita Devi',   'B-', 'Pune',              'MH','+91 98200 66666','2024-03-10',1);
  bStmt.run('Rahul Gupta',   'A+', 'Gautam Buddh Nagar','UP','+91 99999 77777','2023-12-15',1);
  bStmt.run('Lakshmi Patel', 'A-', 'Indore',            'MP','+91 73122 88888','2024-01-05',1);
  bStmt.finalize();
});

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════
app.post('/api/login', (req, res) => {
  db.get("SELECT * FROM Users WHERE username=?", [req.body.username], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'User not found. Please register.' });
    res.json({ user: row });
  });
});

app.post('/api/register', (req, res) => {
  const { name, mobile, age, gender, role='patient', state='UP', district='' } = req.body;
  db.run("INSERT INTO Users (username,role,name,state,district) VALUES (?,?,?,?,?)",
    [mobile, role, name, state, district], function(err) {
      if (err) return res.status(400).json({ error: 'Mobile number already registered.' });
      res.json({ user: { id: this.lastID, username: mobile, role, name, state, district } });
    });
});

app.put('/api/user', (req, res) => {
  const { id, name, state, district } = req.body;
  db.run("UPDATE Users SET name=?,state=?,district=? WHERE id=?", [name,state,district,id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ═══════════════════════════════════════════════
// PROVIDERS
// ═══════════════════════════════════════════════
app.get('/api/providers', (req, res) => {
  const { type, state, district, query } = req.query;
  let sql = "SELECT * FROM Providers WHERE 1=1";
  const p = [];
  if (type && type !== 'all') { sql += " AND type=?";              p.push(type); }
  if (state)                  { sql += " AND state=?";             p.push(state); }
  if (district)               { sql += " AND district LIKE ?";     p.push(`%${district}%`); }
  if (query)                  { sql += " AND (name LIKE ? OR services LIKE ?)"; p.push(`%${query}%`,`%${query}%`); }
  sql += " ORDER BY rating DESC LIMIT 50";
  db.all(sql, p, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/providers/:id', (req, res) => {
  db.get("SELECT * FROM Providers WHERE id=?", [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

app.post('/api/providers', (req, res) => {
  const { type,name,name_hi,address,pincode,district,state,phone,whatsapp,services,timings,accepts_ayushman,accepts_pmjay,license,owner_user_id } = req.body;
  db.run(`INSERT INTO Providers (type,name,name_hi,address,pincode,district,state,phone,whatsapp,services,timings,accepts_ayushman,accepts_pmjay,license,owner_user_id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [type,name,name_hi||'',address,pincode,district,state,phone,whatsapp||'',JSON.stringify(services||[]),timings||'',accepts_ayushman?1:0,accepts_pmjay?1:0,license||'',owner_user_id||null],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/providers/:id', (req, res) => {
  const { open_now, name, address, phone, services, timings } = req.body;
  db.run("UPDATE Providers SET open_now=?,name=?,address=?,phone=?,services=?,timings=? WHERE id=?",
    [open_now?1:0,name,address,phone,JSON.stringify(services||[]),timings,req.params.id],
    (err) => { if (err) return res.status(500).json({ error: err.message }); res.json({ success: true }); });
});

app.get('/api/my-providers/:userId', (req, res) => {
  db.all("SELECT * FROM Providers WHERE owner_user_id=?", [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ═══════════════════════════════════════════════
// BLOOD DONORS
// ═══════════════════════════════════════════════
app.get('/api/blood-donors', (req, res) => {
  const { blood_group, state, district } = req.query;
  let sql = "SELECT * FROM BloodDonors WHERE available=1";
  const p = [];
  if (blood_group) { sql += " AND blood_group=?"; p.push(blood_group); }
  if (state)       { sql += " AND state=?";       p.push(state); }
  if (district)    { sql += " AND district LIKE ?"; p.push(`%${district}%`); }
  db.all(sql, p, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/blood-donors', (req, res) => {
  const { name, blood_group, district, state, phone } = req.body;
  db.run("INSERT INTO BloodDonors (name,blood_group,district,state,phone) VALUES (?,?,?,?,?)",
    [name,blood_group,district,state,phone], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// ═══════════════════════════════════════════════
// PATIENT / QUEUE / DIAGNOSTICS / VITALS
// ═══════════════════════════════════════════════
app.get('/api/queue', (req, res) => {
  db.all(`SELECT Queue.*,Patients.name,Patients.age,Patients.gender
    FROM Queue JOIN Patients ON Queue.patient_id=Patients.id ORDER BY Queue.timestamp ASC`,
    [], (err,rows) => { if(err) return res.status(500).json({error:err.message}); res.json(rows); });
});

app.post('/api/queue', (req, res) => {
  const { patient_name, age, gender, triage_notes } = req.body;
  db.run("INSERT INTO Patients (name,age,gender) VALUES (?,?,?)", [patient_name,age||0,gender||'U'], function(err) {
    if (err) return res.status(500).json({error:err.message});
    db.run("INSERT INTO Queue (patient_id,status,triage_notes) VALUES (?,'waiting',?)", [this.lastID,triage_notes], function(err2) {
      if (err2) return res.status(500).json({error:err2.message});
      res.json({ success:true, queue_id:this.lastID });
    });
  });
});

app.put('/api/queue/:id', (req, res) => {
  db.run("UPDATE Queue SET status=? WHERE id=?", [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json({error:err.message}); res.json({success:true});
  });
});

app.get('/api/patient/:name/bookings', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  db.get(`SELECT Queue.* FROM Queue JOIN Patients ON Queue.patient_id=Patients.id
    WHERE Patients.name=? AND Queue.status NOT IN ('completed','cancelled')
    ORDER BY Queue.timestamp DESC LIMIT 1`, [name], (err, q) => {
    db.all(`SELECT DiagnosticRequests.* FROM DiagnosticRequests JOIN Patients ON DiagnosticRequests.patient_id=Patients.id
      WHERE Patients.name=? AND DiagnosticRequests.status NOT IN ('completed','cancelled')
      ORDER BY DiagnosticRequests.timestamp DESC`, [name], (err2, d) => {
      res.json({ queue: q||null, diagnostics: d||[] });
    });
  });
});

app.post('/api/diagnostics', (req, res) => {
  const { patient_name, test_type, request_type, location, scheduled_date, scheduled_time } = req.body;
  db.run("INSERT INTO Patients (name) VALUES (?)", [patient_name], function(err) {
    db.run("INSERT INTO DiagnosticRequests (patient_id,test_type,request_type,location,status,scheduled_date,scheduled_time) VALUES (?,?,?,?,'Scheduled',?,?)",
      [this.lastID,test_type,request_type,location,scheduled_date,scheduled_time], function(err2) {
        if (err2) return res.status(500).json({error:err2.message});
        res.json({ success:true, id:this.lastID });
      });
  });
});

app.post('/api/vitals', (req, res) => {
  const { patient_name, bp, sugar, weight } = req.body;
  db.run("INSERT INTO Vitals (patient_name,bp,sugar,weight) VALUES (?,?,?,?)", [patient_name,bp,sugar,weight], function(err) {
    if (err) return res.status(500).json({error:err.message}); res.json({success:true});
  });
});

app.get('/api/vitals/:name', (req, res) => {
  db.all("SELECT * FROM Vitals WHERE patient_name=? ORDER BY timestamp DESC LIMIT 10", [decodeURIComponent(req.params.name)], (err,rows) => {
    if (err) return res.status(500).json({error:err.message}); res.json(rows);
  });
});

// ═══════════════════════════════════════════════
// STATIC / MOCK DATA
// ═══════════════════════════════════════════════
app.get('/api/doctors', (req, res) => {
  res.json([
    { id:1, name:"Dr. Anil Sharma",  name_hi:"डॉ. अनिल शर्मा",  specialty:"General Physician", specialty_hi:"सामान्य चिकित्सक",   fee:200, exp:"12 yrs" },
    { id:2, name:"Dr. Rekha Gupta",  name_hi:"डॉ. रेखा गुप्ता",  specialty:"Gynaecologist",     specialty_hi:"स्त्री रोग विशेषज्ञ",fee:350, exp:"15 yrs" },
    { id:3, name:"Dr. Priya Joshi",  name_hi:"डॉ. प्रिया जोशी",  specialty:"Paediatrician",     specialty_hi:"बाल रोग विशेषज्ञ",   fee:250, exp:"8 yrs"  },
    { id:4, name:"Dr. Suresh Patel", name_hi:"डॉ. सुरेश पटेल", specialty:"Cardiologist",       specialty_hi:"हृदय रोग विशेषज्ञ",  fee:500, exp:"20 yrs" },
    { id:5, name:"Dr. Meena Verma",  name_hi:"डॉ. मीना वर्मा",   specialty:"Dermatologist",     specialty_hi:"त्वचा रोग विशेषज्ञ", fee:300, exp:"10 yrs" },
  ]);
});

app.get('/api/awareness', (req, res) => {
  res.json([
    { type:"Yojna", title:"Ayushman Bharat PM-JAY", title_hi:"आयुष्मान भारत PM-JAY", desc:"Free healthcare up to ₹5 Lakhs/family/year.", desc_hi:"₹5 लाख तक मुफ्त इलाज।" },
    { type:"Yojna", title:"PMJSY Maternity Scheme",  title_hi:"PMJSY मातृत्व योजना",  desc:"₹6,000 benefit for pregnant women.",         desc_hi:"गर्भवती महिलाओं को ₹6,000 सहायता।" },
    { type:"Yojna", title:"Jan Aushadhi Scheme",      title_hi:"जन औषधि योजना",       desc:"Generic medicines 50-90% cheaper.",           desc_hi:"जेनेरिक दवाएं 50-90% सस्ती।" },
    { type:"Tip",   title:"Monsoon Health Alert",     title_hi:"मानसून सावधानी",       desc:"Boil water, use mosquito nets.",              desc_hi:"पानी उबालें, मच्छरदानी प्रयोग करें।" },
    { type:"Tip",   title:"Nutrition for Mothers",    title_hi:"माँ के लिए पोषण",      desc:"Spinach, jaggery, lentils prevent anemia.",   desc_hi:"पालक, गुड़, दाल खाएं।" },
    { type:"Tip",   title:"Child Vaccination",        title_hi:"बच्चों का टीकाकरण",    desc:"Ensure all vaccines per govt schedule.",      desc_hi:"सरकारी कार्यक्रम के अनुसार टीके लगवाएं।" },
  ]);
});

app.get('/api/medicines/:name', (req, res) => {
  db.all("SELECT * FROM Medicines WHERE patient_name=? AND active=1 ORDER BY id DESC", [decodeURIComponent(req.params.name)], (err,rows) => {
    if (err) return res.status(500).json({error:err.message}); res.json(rows);
  });
});
app.post('/api/medicines', (req, res) => {
  const { patient_name, name, dose, time } = req.body;
  db.run("INSERT INTO Medicines (patient_name,name,dose,time) VALUES (?,?,?,?)", [patient_name,name,dose,time], function(err) {
    if (err) return res.status(500).json({error:err.message}); res.json({success:true,id:this.lastID});
  });
});
app.delete('/api/medicines/:id', (req, res) => {
  db.run("UPDATE Medicines SET active=0 WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({error:err.message}); res.json({success:true});
  });
});

app.post('/api/ai/symptoms', (req, res) => {
  const s = (req.body.symptoms||'').toLowerCase();
  let report = "General check recommended. Consult a physician.";
  let severity = "low";
  if (s.includes('fever')||s.includes('cough'))        { report="Possible viral/flu. Check temperature, SpO2."; severity="medium"; }
  if (s.includes('chest')||s.includes('breath'))       { report="URGENT: Possible cardiac distress. Seek immediate care!"; severity="high"; }
  if (s.includes('vomit')||s.includes('diarrhea'))     { report="Gastroenteritis likely. Stay hydrated — take ORS."; severity="medium"; }
  if (s.includes('pregnan')||s.includes('pregnant'))   { report="Consult gynaecologist. Monitor fetal movement."; severity="medium"; }
  if (s.includes('sugar')||s.includes('diabetes'))     { report="Check blood glucose. Avoid sweets, consult physician."; severity="medium"; }
  setTimeout(() => res.json({ report, severity }), 800);
});

// ═══════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🏥 Lok Kalyan National Backend → http://localhost:${PORT}`);
});
