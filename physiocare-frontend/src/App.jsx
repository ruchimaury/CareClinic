import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════
//  PHYSIOCARE PRO  —  Complete App
//  ✅ Single LOGIN button  (role auto-detect)
//  ✅ Real Unsplash images
//  ✅ Professional medical UI
//  ✅ Patient / Doctor / Admin dashboards
// ══════════════════════════════════════════════════

const DEMO_USERS = {
  "patient@demo.com":  { pass:"123456", role:"patient",  name:"Sunita Rao",        avatar:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face" },
  "patient2@demo.com": { pass:"123456", role:"patient",  name:"Vikram Nair",        avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
  "doctor@demo.com":   { pass:"123456", role:"doctor",   name:"Dr. Priya Sharma",   avatar:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face", spec:"Orthopaedic Specialist" },
  "doctor2@demo.com":  { pass:"123456", role:"doctor",   name:"Dr. Rahul Mehta",    avatar:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face", spec:"Neuro Physiotherapist" },
  "admin@demo.com":    { pass:"123456", role:"admin",    name:"Admin",              avatar:"https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=80&h=80&fit=crop&crop=face" },
};

const DOCTORS_DATA = [
  { id:1, email:"doctor@demo.com",  name:"Dr. Priya Sharma",  spec:"Orthopaedic Specialist",   exp:"12 years", rating:4.9, reviews:320, clinicCharge:800,  homeVisitCharge:1000, homeVisitExtra:200, homeVisitEnabled:true,  status:"active",
    bio:"Expert in joint pain, fracture recovery and post-surgery rehabilitation.",
    img:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=320&h=320&fit=crop&crop=face",
    availableDays:["Mon","Tue","Wed","Thu","Fri"] },
  { id:2, email:"doctor2@demo.com", name:"Dr. Rahul Mehta",   spec:"Neuro Physiotherapist",    exp:"8 years",  rating:4.8, reviews:214, clinicCharge:900,  homeVisitCharge:1100, homeVisitExtra:200, homeVisitEnabled:true,  status:"active",
    bio:"Specializes in stroke, paralysis and Parkinson's disease rehabilitation.",
    img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=320&h=320&fit=crop&crop=face",
    availableDays:["Mon","Wed","Fri","Sat"] },
  { id:3, email:"anita@demo.com",   name:"Dr. Anita Singh",   spec:"Sports Rehab Expert",      exp:"10 years", rating:4.9, reviews:287, clinicCharge:750,  homeVisitCharge:950,  homeVisitExtra:200, homeVisitEnabled:false, status:"active",
    bio:"Get back to peak performance with sports-specific physiotherapy.",
    img:"https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=320&h=320&fit=crop&crop=face",
    availableDays:["Tue","Thu","Sat"] },
];

const APPOINTMENTS_DATA = [
  { id:1, patientName:"Sunita Rao",  patientEmail:"patient@demo.com",  doctorId:1, doctorName:"Dr. Priya Sharma", service:"Orthopaedic Rehab",  date:"2025-08-10", time:"10:00 AM", type:"clinic", amount:800,  status:"confirmed", notes:"Knee pain follow-up" },
  { id:2, patientName:"Sunita Rao",  patientEmail:"patient@demo.com",  doctorId:2, doctorName:"Dr. Rahul Mehta",  service:"Back & Spine Pain",  date:"2025-08-15", time:"3:00 PM",  type:"home",   amount:1100, status:"pending",   notes:"Lower back pain" },
  { id:3, patientName:"Vikram Nair", patientEmail:"patient2@demo.com", doctorId:1, doctorName:"Dr. Priya Sharma", service:"Sports Injury",      date:"2025-07-08", time:"11:00 AM", type:"clinic", amount:800,  status:"completed", notes:"Shoulder injury" },
  { id:4, patientName:"Vikram Nair", patientEmail:"patient2@demo.com", doctorId:3, doctorName:"Dr. Anita Singh",  service:"Sports Injury",      date:"2025-08-20", time:"4:00 PM",  type:"clinic", amount:750,  status:"confirmed", notes:"Cricket injury" },
];

const SERVICES = ["Orthopaedic Rehab","Neuro Physiotherapy","Sports Injury","Women's Health","Back & Spine Pain","Geriatric Care","Post-Surgery Rehab","Pediatric Physio"];
const TIME_SLOTS = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];

// ══════════════════════════════════════════════════
// GLOBAL CSS
// ══════════════════════════════════════════════════
const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --teal:#0B7B6B; --teal-light:#E6F4F1; --teal-mid:#14B8A6;
  --navy:#0F2540; --navy-soft:#1E3A5F;
  --gold:#C9973A; --gold-light:#FDF6EC;
  --bg:#F7FAFA; --white:#FFFFFF;
  --text:#1a2e2e; --muted:#607070;
  --border:#DDE8E6; --radius:16px;
  --shadow:0 4px 24px rgba(11,123,107,0.10);
  --shadow-lg:0 12px 40px rgba(11,123,107,0.16);
}
body{font-family:'DM Sans',sans-serif;color:var(--text);background:var(--bg);}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fadeUp{animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
.fadeUp2{animation:fadeUp .7s .15s cubic-bezier(.22,1,.36,1) both}
.fadeUp3{animation:fadeUp .7s .3s cubic-bezier(.22,1,.36,1) both}
.card{background:var(--white);border-radius:var(--radius);border:1px solid var(--border);transition:all .3s cubic-bezier(.22,1,.36,1);}
.card:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 24px;border-radius:12px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;border:none;transition:all .25s cubic-bezier(.22,1,.36,1);}
.btn-primary{background:var(--teal);color:#fff;box-shadow:0 4px 16px rgba(11,123,107,0.3);}
.btn-primary:hover{background:#096b5c;transform:translateY(-2px);box-shadow:0 8px 24px rgba(11,123,107,0.4);}
.btn-outline{background:transparent;color:var(--teal);border:2px solid var(--teal);}
.btn-outline:hover{background:var(--teal);color:#fff;}
.btn-ghost{background:#f0f5f4;color:var(--text);}
.btn-ghost:hover{background:#e2edeb;}
.btn-gold{background:var(--gold);color:#fff;box-shadow:0 4px 16px rgba(201,151,58,0.3);}
.btn-gold:hover{background:#b8862f;transform:translateY(-2px);}
.btn-danger{background:#FEF2F2;color:#DC2626;}
.btn-danger:hover{background:#FECACA;}
.btn-success{background:#F0FDF4;color:#16A34A;}
.btn-success:hover{background:#DCFCE7;}
.input{width:100%;padding:12px 16px;border-radius:12px;border:2px solid var(--border);font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);background:var(--white);transition:all .2s;}
.input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 4px rgba(11,123,107,0.08);}
.nav-link{font-weight:500;font-size:14px;color:var(--muted);text-decoration:none;padding:6px 4px;border-bottom:2px solid transparent;transition:all .2s;}
.nav-link:hover{color:var(--teal);border-bottom-color:var(--teal);}
.sidebar-link{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;font-weight:500;font-size:14px;color:rgba(255,255,255,0.65);cursor:pointer;transition:all .25s;margin-bottom:2px;}
.sidebar-link:hover{background:rgba(255,255,255,0.08);color:#fff;}
.sidebar-link.active{background:rgba(255,255,255,0.15);color:#fff;font-weight:600;}
.tag{display:inline-flex;align-items:center;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:600;}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f0f5f4}::-webkit-scrollbar-thumb{background:var(--teal);border-radius:3px}
select.input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23607070' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}

/* ── MOBILE BOTTOM NAV ── */
.mobile-bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);z-index:200;padding:8px 0 12px;}
.mobile-bottom-nav .mnav-item{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;cursor:pointer;color:var(--muted);font-size:10px;font-weight:600;padding:4px 0;transition:color .2s;}
.mobile-bottom-nav .mnav-item.active{color:var(--teal);}
.mobile-bottom-nav .mnav-item span.ico{font-size:20px;}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .desktop-nav-links{display:none!important;}
  .hamburger-btn{display:flex!important;}
  .mobile-login-btn{display:flex!important;}
  .hero-flex{flex-direction:column!important;padding-top:100px!important;gap:32px!important;}
  .hero-image-wrap{width:clamp(220px,55vw,340px)!important;height:clamp(220px,55vw,340px)!important;}
  .stats-bar{gap:12px!important;}
  .services-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))!important;}
  .home-visit-flex{flex-direction:column!important;}
  .doctors-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))!important;}
  .testimonials-grid{grid-template-columns:1fr!important;}
  .footer-flex{flex-direction:column!important;gap:28px!important;}
}

@media(max-width:768px){
  /* Dashboard sidebar → hide, show bottom nav */
  .dash-sidebar{display:none!important;}
  .dash-main{margin-left:0!important;padding:20px 16px 80px!important;}
  .mobile-bottom-nav{display:flex!important;}
  .dash-topbar{flex-direction:column!important;align-items:flex-start!important;gap:12px!important;}
  .dash-topbar h1{font-size:22px!important;}

  /* Stats grid → 2 columns */
  .stats-grid{grid-template-columns:1fr 1fr!important;}

  /* Landing hero */
  .hero-section{padding:0 5vw!important;}
  .hero-text h1{font-size:36px!important;}
  .hero-btns{flex-direction:column!important;}
  .hero-badges{display:none!important;}

  /* Navbar */
  .navbar{padding:0 16px!important;}
  .navbar-logo span{font-size:17px!important;}

  /* Section padding */
  .section-pad{padding:52px 16px!important;}
  .section-title{font-size:30px!important;}

  /* Cards */
  .card-grid-2{grid-template-columns:1fr!important;}
  .charge-cards{flex-direction:column!important;}

  /* Modals */
  .modal-inner{padding:22px 18px!important;border-radius:18px!important;}

  /* Appt cards */
  .appt-card-row{flex-direction:column!important;align-items:flex-start!important;}
  .appt-card-right{margin-top:8px!important;}

  /* Doctor profile card */
  .doc-card-row{flex-direction:column!important;}

  /* Admin table */
  .admin-appt-row{flex-direction:column!important;gap:8px!important;}
}

@media(max-width:480px){
  .hero-text h1{font-size:30px!important;}
  .stats-num{font-size:28px!important;}
  .stat-card-val{font-size:20px!important;}
  .time-grid{grid-template-columns:repeat(3,1fr)!important;}
  .modal-inner{padding:18px 14px!important;}
  .service-img{height:160px!important;}
}
`;

// ══════════════════════════════════════════════════
// MOBILE BOTTOM NAV (shows on mobile instead of sidebar)
// ══════════════════════════════════════════════════
function MobileBottomNav({ items, active, onChange }) {
  return (
    <div className="mobile-bottom-nav">
      {items.slice(0,5).map(n => (
        <div key={n.id} className={`mnav-item ${active===n.id?"active":""}`} onClick={() => onChange(n.id)}>
          <span className="ico">{n.icon}</span>
          <span>{n.short||n.label.split(" ")[0]}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════
// SMALL HELPERS
// ══════════════════════════════════════════════════
const Tag = ({ children, color = "var(--teal)", bg }) => (
  <span className="tag" style={{ background: bg || color + "18", color }}>
    {children}
  </span>
);

const StatusTag = ({ s }) => {
  const map = { confirmed:["#0B7B6B","Confirmed ✓"], pending:["#D97706","Pending ⏳"], completed:["#16A34A","Completed ✅"], cancelled:["#DC2626","Cancelled ✗"] };
  const [c, l] = map[s] || ["#888", s];
  return <Tag color={c}>{l}</Tag>;
};

const StatCard = ({ icon, label, value, color = "var(--teal)", sub }) => (
  <div className="card" style={{ padding:"20px 24px" }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div>
        <p style={{ fontSize:"12px", color:"var(--muted)", fontWeight:600, marginBottom:6, letterSpacing:".5px", textTransform:"uppercase" }}>{label}</p>
        <p style={{ fontSize:"26px", fontWeight:700, color:"var(--text)", fontFamily:"'Cormorant Garamond',serif" }}>{value}</p>
        {sub && <p style={{ fontSize:"11px", color:"#16A34A", marginTop:4, fontWeight:600 }}>{sub}</p>}
      </div>
      <div style={{ width:48, height:48, borderRadius:14, background:color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{icon}</div>
    </div>
  </div>
);

const Modal = ({ title, children, onClose, w = "500px" }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(15,37,64,0.55)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)", animation:"fadeIn .2s" }}>
    <div style={{ background:"#fff", borderRadius:24, padding:36, width:`min(${w},95vw)`, maxHeight:"92vh", overflowY:"auto", animation:"fadeUp .35s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"var(--navy)" }}>{title}</h2>
        <button onClick={onClose} style={{ width:36, height:36, borderRadius:"50%", border:"none", background:"#f0f5f4", cursor:"pointer", fontSize:18, color:"var(--muted)" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Avatar = ({ src, name, size = 40 }) => (
  src
    ? <img src={src} alt={name} style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", border:"2px solid var(--border)" }} />
    : <div style={{ width:size, height:size, borderRadius:"50%", background:"var(--teal-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.4, fontWeight:700, color:"var(--teal)", border:"2px solid var(--border)" }}>
        {name?.[0]?.toUpperCase()}
      </div>
);

// ══════════════════════════════════════════════════
// USER STORE  (in-memory — replace with Django API)
// All signups → patient by default
// Doctor role → only Admin can approve
// ══════════════════════════════════════════════════
const REGISTERED_USERS = { ...DEMO_USERS };

// Pending doctor applications — Admin approves/rejects these
const DOCTOR_APPLICATIONS = [
  // Example pre-loaded application
  {
    id: "app_001",
    email: "newdoctor@example.com",
    name: "Dr. Kavita Rao",
    qualification: "MPT - Musculoskeletal",
    experience: "6 years",
    location: "Bangalore",
    phone: "+91 98765 43210",
    message: "I specialise in post-surgical rehabilitation and sports injuries.",
    appliedAt: "2025-08-01",
    status: "pending", // "pending" | "approved" | "rejected"
  },
];

// ══════════════════════════════════════════════════
// LOGIN / SIGNUP MODAL
// - Smart: email check se pata chalta hai login ya signup
// - Signup mein role choose karna ZAROORI hai
// - Koi hints nahi
// ══════════════════════════════════════════════════
function LoginModal({ onClose, onLogin }) {
  // Steps: "email" → check karo exist karta hai ya nahi → "login" ya "signup"
  const [step, setStep]       = useState("email");   // "email"|"login"|"signup"|"apply"|"app_sent"
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [pass2, setPass2]     = useState("");
  const [fullName, setFullName] = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [docForm, setDocForm] = useState({ name:"", qualification:"", experience:"", location:"", phone:"", message:"" });

  // Step 1: Email check — exist karta hai → login, naya → signup
  const checkEmail = () => {
    const e = email.trim().toLowerCase();
    if (!e || !e.includes("@")) { setErr("Please enter a valid email address."); return; }
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (REGISTERED_USERS[e]) {
        setStep("login");   // purana user → login form
      } else {
        setStep("signup");  // naya user → signup form
      }
    }, 600);
  };

  // Step 2a: Login
  const doLogin = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const e = email.trim().toLowerCase();
      const u = REGISTERED_USERS[e];
      if (u && u.pass === pass) {
        onLogin({ ...u, email: e });
      } else {
        setErr("Incorrect password. Please try again.");
      }
    }, 700);
  };

  // Step 2b: Signup — ALWAYS creates a patient account
  // Doctors must apply separately; Admin approves them
  const doSignup = () => {
    if (!fullName.trim()) { setErr("Please enter your full name."); return; }
    if (pass.length < 6)  { setErr("Password must be at least 6 characters."); return; }
    if (pass !== pass2)   { setErr("Passwords do not match."); return; }
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const e = email.trim().toLowerCase();
      const newUser = {
        pass,
        role: "patient",   // ← ALWAYS patient — Admin promotes to doctor
        name: fullName.trim(),
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face",
      };
      REGISTERED_USERS[e] = newUser;
      onLogin({ ...newUser, email: e });
    }, 800);
  };

  // Step 2c: Doctor application submit
  const submitDoctorApp = () => {
    if (!docForm.name || !docForm.qualification || !docForm.experience || !docForm.location || !docForm.phone) {
      setErr("Please fill all required fields."); return;
    }
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newApp = {
        id: "app_" + Date.now(),
        email: email.trim().toLowerCase(),
        ...docForm,
        appliedAt: new Date().toISOString().split("T")[0],
        status: "pending",
      };
      DOCTOR_APPLICATIONS.push(newApp);
      setStep("app_sent");
    }, 800);
  };

  const Spinner = () => (
    <span style={{ display:"inline-block", width:18, height:18, borderRadius:"50%",
      border:"3px solid rgba(255,255,255,0.35)", borderTopColor:"#fff",
      animation:"spin .7s linear infinite" }} />
  );

  return (
    <Modal title="" onClose={onClose} w="440px">
      {/* Logo + Brand */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg,var(--teal),var(--navy))",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 12px" }}>💙</div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:"var(--navy)" }}>PhysioCare Pro</h2>
        <p style={{ color:"var(--muted)", fontSize:13, marginTop:4 }}>
          {step==="email"  && "Enter your email — we'll handle the rest"}
          {step==="login"  && "Welcome back! Enter your password"}
          {step==="signup" && "Create your free account"}
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:24 }}>
        {["email","login","signup"].slice(0,2).map((s,i) => (
          <div key={i} style={{ width: step===s||((step==="login"||step==="signup")&&i===1) ? 24:8, height:8,
            borderRadius:4, transition:"all .3s",
            background: i===0&&step!=="email" ? "var(--teal)" : step===s||((step==="login"||step==="signup")&&i===1) ? "var(--teal)" : "var(--border)" }} />
        ))}
      </div>

      {/* ── STEP 1: EMAIL ── */}
      {step==="email" && (
        <>
          <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Email Address</label>
          <input className="input" type="email" placeholder="you@example.com"
            value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
            onKeyDown={e => e.key==="Enter" && checkEmail()}
            style={{ marginBottom:14 }} autoFocus />
          {err && <p style={{ color:"#DC2626", fontSize:13, marginBottom:12 }}>⚠️ {err}</p>}
          <button className="btn btn-primary" onClick={checkEmail} disabled={loading}
            style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}>
            {loading ? <Spinner /> : "Continue →"}
          </button>
        </>
      )}

      {/* ── STEP 2a: LOGIN ── */}
      {step==="login" && (
        <>
          {/* Email chip */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            background:"var(--teal-light)", borderRadius:10, padding:"10px 14px", marginBottom:18,
            border:"1px solid #B2DFDB" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--teal)" }}>✉️ {email}</span>
            <button onClick={() => { setStep("email"); setPass(""); setErr(""); }}
              style={{ fontSize:12, color:"var(--muted)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
              Change
            </button>
          </div>

          <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Password</label>
          <div style={{ position:"relative", marginBottom:14 }}>
            <input className="input" type={showPass?"text":"password"} placeholder="••••••••"
              value={pass} onChange={e => { setPass(e.target.value); setErr(""); }}
              onKeyDown={e => e.key==="Enter" && doLogin()}
              style={{ paddingRight:44 }} autoFocus />
            <button onClick={() => setShowPass(s=>!s)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--muted)" }}>
              {showPass?"🙈":"👁️"}
            </button>
          </div>

          {err && <p style={{ color:"#DC2626", fontSize:13, marginBottom:12 }}>⚠️ {err}</p>}

          <button className="btn btn-primary" onClick={doLogin} disabled={loading}
            style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}>
            {loading ? <Spinner /> : "Login Karein →"}
          </button>

          <p style={{ textAlign:"center", fontSize:12, color:"var(--muted)", marginTop:12, cursor:"pointer" }}
            onClick={() => { setErr(""); alert("A password reset link has been sent to your email."); }}>
            Forgot your password?
          </p>
        </>
      )}

      {/* ── STEP 2b: SIGNUP — always creates Patient account ── */}
      {step==="signup" && (
        <>
          {/* Email chip */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--teal-l)", borderRadius:10, padding:"10px 14px", marginBottom:18, border:"1px solid #B2DFDB" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--teal)" }}>✉️ {email}</span>
            <button onClick={() => { setStep("email"); setPass(""); setPass2(""); setErr(""); }}
              style={{ fontSize:12, color:"var(--muted)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Change</button>
          </div>

          {/* Patient info banner */}
          <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:12, padding:"12px 16px", marginBottom:18, display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:20 }}>🏥</span>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#166534" }}>You're signing up as a Patient</div>
              <div style={{ fontSize:12, color:"#16A34A", marginTop:3 }}>Book appointments, find doctors, track recovery. Free forever.</div>
            </div>
          </div>

          <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Full Name</label>
          <input className="input" placeholder="e.g. Sarah Mitchell" value={fullName}
            onChange={e => { setFullName(e.target.value); setErr(""); }}
            style={{ marginBottom:14 }} autoFocus />

          <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Create Password</label>
          <div style={{ position:"relative", marginBottom:12 }}>
            <input className="input" type={showPass?"text":"password"} placeholder="At least 6 characters"
              value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} style={{ paddingRight:44 }} />
            <button onClick={() => setShowPass(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>
              {showPass?"🙈":"👁️"}
            </button>
          </div>

          <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Confirm Password</label>
          <input className="input" type="password" placeholder="Re-enter your password"
            value={pass2} onChange={e => { setPass2(e.target.value); setErr(""); }}
            onKeyDown={e => e.key==="Enter" && doSignup()} style={{ marginBottom:14 }} />

          {err && <p style={{ color:"#DC2626", fontSize:13, marginBottom:12 }}>⚠️ {err}</p>}

          <button className="btn btn-primary" onClick={doSignup} disabled={loading}
            style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}>
            {loading ? <Spinner /> : "Create Patient Account →"}
          </button>

          {/* Doctor apply link */}
          <div style={{ marginTop:16, padding:"12px 14px", background:"var(--bg)", borderRadius:10, border:"1px solid var(--border)", textAlign:"center" }}>
            <p style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>Are you a physiotherapist?</p>
            <button onClick={() => { setErr(""); setStep("apply"); }} style={{ fontSize:13, fontWeight:700, color:"var(--teal)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
              Apply to join as a Doctor →
            </button>
          </div>

          <p style={{ textAlign:"center", fontSize:11, color:"var(--muted)", marginTop:10 }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </>
      )}

      {/* ── STEP 2c: DOCTOR APPLICATION ── */}
      {step==="apply" && (
        <>
          <button onClick={() => setStep("signup")} style={{ background:"none", border:"none", color:"var(--muted)", fontSize:13, cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", gap:4 }}>
            ← Back to signup
          </button>
          <div style={{ background:"linear-gradient(135deg,var(--teal-l),#EAF2FF)", borderRadius:14, padding:"16px", marginBottom:20, display:"flex", gap:12 }}>
            <span style={{ fontSize:26 }}>👨‍⚕️</span>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>Doctor Application</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:3, lineHeight:1.5 }}>Submit your details. Our admin team will review and activate your doctor account within 24–48 hours.</div>
            </div>
          </div>

          {[
            { key:"name",          label:"Full Name (with Dr.)",    placeholder:"e.g. Dr. Priya Sharma" },
            { key:"qualification", label:"Qualification",           placeholder:"e.g. MPT - Orthopaedics, BPT" },
            { key:"experience",    label:"Years of Experience",     placeholder:"e.g. 8 years" },
            { key:"location",      label:"City / Location",         placeholder:"e.g. Delhi NCR" },
            { key:"phone",         label:"Phone Number",            placeholder:"e.g. +91 98765 43210" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:5 }}>{f.label} *</label>
              <input className="input" placeholder={f.placeholder}
                value={docForm[f.key]} onChange={e => setDocForm(d => ({...d, [f.key]:e.target.value}))} />
            </div>
          ))}

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:5 }}>Brief Message (optional)</label>
            <textarea className="input" rows={3} placeholder="Tell us about your specialisation and why you want to join PhysioCare Pro..."
              value={docForm.message} onChange={e => setDocForm(d => ({...d, message:e.target.value}))}
              style={{ resize:"none" }} />
          </div>

          {err && <p style={{ color:"#DC2626", fontSize:13, marginBottom:12 }}>⚠️ {err}</p>}

          <button className="btn btn-primary" onClick={submitDoctorApp} disabled={loading}
            style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}>
            {loading ? <Spinner /> : "Submit Application →"}
          </button>
        </>
      )}

      {/* ── STEP 2d: APPLICATION SENT ── */}
      {step==="app_sent" && (
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <div style={{ fontSize:64, marginBottom:16 }}>📋</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"var(--navy)", marginBottom:10 }}>
            Application Received!
          </h3>
          <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.7, marginBottom:24 }}>
            Thank you for applying to join PhysioCare Pro as a doctor.<br/>
            Our admin team will review your application and get back to you at<br/>
            <strong style={{ color:"var(--teal)" }}>{email}</strong><br/>
            within <strong>24–48 hours</strong>.
          </p>
          <div style={{ background:"var(--teal-l)", borderRadius:12, padding:"14px 18px", marginBottom:24, textAlign:"left" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"var(--teal)", marginBottom:8 }}>What happens next?</p>
            {["Admin reviews your credentials","Your doctor account gets activated","You receive a confirmation email","Login and set up your profile & charges"].map((s,i) => (
              <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"var(--teal)", color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:13, color:"var(--text)" }}>{s}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={onClose} style={{ width:"100%", justifyContent:"center", padding:"12px" }}>
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}


// ══════════════════════════════════════════════════
// HOW IT WORKS — Full Page
// ══════════════════════════════════════════════════
const HOW_IT_WORKS_DATA = [
  {
    step:"01", icon:"🔍", title:"Find Your Specialist",
    short:"Browse verified physiotherapists filtered by condition, location, and availability.",
    detail:"Use our intelligent search to filter by medical condition (knee pain, stroke, sports injury), your city, preferred language, and open time slots. Every doctor profile displays NABH credentials, verified patient reviews, and consultation fees upfront — complete transparency, zero surprises.",
    img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=540&h=360&fit=crop",
  },
  {
    step:"02", icon:"📅", title:"Book an Appointment",
    short:"Choose clinic visit or home visit, pick your slot — instant confirmation, no waiting.",
    detail:"Select between a clinic session or a home visit. Pick your preferred date and time slot from real-time availability. Our system sends an instant confirmation and a reminder 24 hours before. Your therapist's direct contact details are shared the moment you book.",
    img:"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=540&h=360&fit=crop",
  },
  {
    step:"03", icon:"💊", title:"Receive Expert Treatment",
    short:"A personalised treatment plan is built around your specific condition and recovery goals.",
    detail:"At your first session your physiotherapist conducts a full assessment and creates a measurable treatment plan. Progress is tracked after every visit. You can message your therapist directly through the platform between sessions — no need to call a clinic.",
    img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=540&h=360&fit=crop",
  },
  {
    step:"04", icon:"✅", title:"Track Your Recovery",
    short:"Monitor progress, manage appointments, and stay connected with your therapist in one place.",
    detail:"Your patient dashboard shows every session, treatment notes, and your full recovery timeline. Rate your sessions, rebook your favourite therapist instantly, and export progress reports to share with other healthcare providers. Your health journey — completely in your hands.",
    img:"https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?w=540&h=360&fit=crop",
  },
];

function HowItWorksPage({ onBack, onBook }) {
  const [active, setActive] = useState(0);
  const step = HOW_IT_WORKS_DATA[active];
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", fontFamily:"'Inter',sans-serif" }}>
      <style>{G}</style>
      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid var(--border)", padding:"0 5vw", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ background:"var(--teal-l)", border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", fontWeight:600, fontSize:13, color:"var(--teal)", display:"flex", alignItems:"center", gap:6 }}>
            ← Back
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,var(--teal),var(--navy))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💙</div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:"var(--navy)" }}>PhysioCare Pro</span>
          </div>
        </div>
        <button className="btn btn-p" onClick={onBook} style={{ padding:"9px 20px" }}>Book Now</button>
      </div>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,var(--navy),var(--navy-s))", padding:"72px 5vw 60px", textAlign:"center" }}>
        <p style={{ fontSize:11, fontWeight:700, color:"var(--teal-m)", letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>Simple Process</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:46, fontWeight:800, color:"#fff", marginBottom:16, lineHeight:1.15 }}>
          How PhysioCare Pro Works
        </h1>
        <p style={{ color:"rgba(255,255,255,.65)", fontSize:17, maxWidth:520, margin:"0 auto", lineHeight:1.75 }}>
          From finding the right specialist to tracking your full recovery — four simple steps to better health.
        </p>
      </div>

      {/* Steps tab row */}
      <div style={{ background:"#fff", borderBottom:"1px solid var(--border)", padding:"0 5vw", display:"flex", overflowX:"auto", gap:0 }}>
        {HOW_IT_WORKS_DATA.map((h, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ padding:"18px 24px", border:"none", background:"transparent", cursor:"pointer", fontFamily:"'Inter',sans-serif",
              fontWeight:600, fontSize:14, color: active===i ? "var(--teal)" : "var(--muted)",
              borderBottom: active===i ? "3px solid var(--teal)" : "3px solid transparent",
              transition:"all .2s", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8 }}>
            <span>{h.icon}</span> {h.title}
          </button>
        ))}
      </div>

      {/* Step detail */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 5vw" }}>
        <div style={{ display:"flex", gap:56, alignItems:"center", flexWrap:"wrap" }}>
          {/* Text */}
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"var(--teal-l)", padding:"8px 18px", borderRadius:50, marginBottom:20, border:"1px solid #B2DFDB" }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:14, color:"var(--teal)" }}>Step {step.step}</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color:"var(--navy)", marginBottom:16, lineHeight:1.2 }}>
              {step.icon} {step.title}
            </h2>
            <p style={{ fontSize:17, color:"var(--muted)", lineHeight:1.8, marginBottom:20 }}>{step.detail}</p>

            {/* Mini checklist */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
              {[
                active===0 && ["NABH-certified doctors only","Verified reviews from real patients","Upfront pricing — no hidden fees","Filter by language & location"],
                active===1 && ["Clinic & home visit options","Real-time slot availability","Instant booking confirmation","24-hour reminder notification"],
                active===2 && ["Full initial assessment","Personalised treatment plan","Session-by-session progress notes","Direct messaging with therapist"],
                active===3 && ["Visual recovery timeline","Session history & notes","Export health reports","Easy rebooking"],
              ].flat().filter(Boolean).map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"var(--teal-l)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"var(--teal)", fontWeight:700, flexShrink:0 }}>✓</div>
                  <span style={{ fontSize:14, color:"var(--text)", fontWeight:500 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button className="btn btn-p" onClick={onBook} style={{ padding:"12px 28px" }}>Get Started →</button>
              {active < HOW_IT_WORKS_DATA.length - 1 && (
                <button className="btn btn-o" onClick={() => setActive(a => a+1)} style={{ padding:"12px 24px" }}>
                  Next Step →
                </button>
              )}
            </div>
          </div>

          {/* Image */}
          <div style={{ flex:1, minWidth:280, maxWidth:520 }}>
            <img src={step.img} alt={step.title}
              style={{ width:"100%", borderRadius:20, boxShadow:"0 16px 56px rgba(11,123,107,.18)" }} />
            {/* Step indicator dots */}
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
              {HOW_IT_WORKS_DATA.map((_, i) => (
                <div key={i} onClick={() => setActive(i)}
                  style={{ width:i===active?24:8, height:8, borderRadius:4, cursor:"pointer", transition:"all .3s",
                    background: i===active ? "var(--teal)" : "var(--border)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* All 4 steps overview grid */}
        <div style={{ marginTop:80 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"var(--navy)", marginBottom:28, textAlign:"center" }}>All Steps at a Glance</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
            {HOW_IT_WORKS_DATA.map((h, i) => (
              <div key={i} className="card" onClick={() => setActive(i)}
                style={{ padding:"24px", cursor:"pointer", border: active===i ? "2px solid var(--teal)" : "1px solid var(--border)", background: active===i ? "var(--teal-l)" : "#fff" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:active===i?"var(--teal)":"var(--teal-l)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{h.icon}</div>
                  <span style={{ fontSize:11, fontWeight:700, color:active===i?"var(--teal)":"var(--muted)", letterSpacing:1 }}>STEP {h.step}</span>
                </div>
                <h4 style={{ fontWeight:700, fontSize:15, color:"var(--navy)", marginBottom:6 }}>{h.title}</h4>
                <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.55 }}>{h.short}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop:72, background:"linear-gradient(135deg,var(--teal),var(--navy-s))", borderRadius:20, padding:"48px 40px", textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:12 }}>Ready to Begin Your Recovery?</h3>
          <p style={{ color:"rgba(255,255,255,.7)", fontSize:16, marginBottom:28 }}>Join 50,000+ patients who trust PhysioCare Pro for expert physiotherapy care.</p>
          <button className="btn btn-p" onClick={onBook} style={{ background:"#fff", color:"var(--teal)", padding:"14px 36px", fontSize:16 }}>
            Book Your First Session →
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════
function Landing({ onShowLogin, onHowItWorks, doctors }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const HERO_IMGS = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
  ];
  const [heroImg, setHeroImg] = useState(0);
  useEffect(() => { const t = setInterval(() => setHeroImg(i => (i+1)%HERO_IMGS.length), 4000); return () => clearInterval(t); }, []);

  const SERVICE_CARDS = [
    { img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=260&fit=crop", title:"Orthopaedic Rehab", desc:"Joint pain, fracture recovery, post-surgery rehabilitation with expert care.", tag:"Most Popular" },
    { img:"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=260&fit=crop", title:"Neuro Physiotherapy", desc:"Stroke, paralysis, and Parkinson's rehabilitation by certified neurophysios.", tag:"Specialised" },
    { img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=260&fit=crop", title:"Sports Injury Rehab", desc:"Get back to peak performance faster with sports-specific treatment protocols.", tag:"High Demand" },
    { img:"https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400&h=260&fit=crop", title:"Home Visit Service", desc:"Professional physiotherapy delivered to your doorstep. Full equipment, same quality.", tag:"🏠 Home Visit" },
    { img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=260&fit=crop", title:"Women's Health", desc:"Prenatal, postnatal & pelvic floor therapy by certified female physiotherapists.", tag:"For Women" },
    { img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=260&fit=crop", title:"Geriatric Care", desc:"Mobility, balance & strength therapy designed specifically for senior citizens.", tag:"Senior Care" },
  ];

  const TESTIMONIALS = [
    { name:"Meera Joshi", city:"Mumbai", rating:5, text:"After my knee surgery, I was struggling to walk. PhysioCare Pro's home visit service was a blessing. I recovered in record time!", img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face" },
    { name:"Arjun Kapoor", city:"Delhi", rating:5, text:"The online booking is seamless. Dr. Priya is exceptional — she explained everything clearly and my shoulder is completely healed.", img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=60&h=60&fit=crop&crop=face" },
    { name:"Kavya Reddy", city:"Hyderabad", rating:5, text:"Best physiotherapy experience ever. Professional, punctual, and genuinely caring therapists. Highly recommended!", img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60&h=60&fit=crop&crop=face" },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{G}</style>

      {/* ─── NAVBAR ─── */}
      <nav className="navbar" style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100, height:68,
        padding:"0 5vw", display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(247,250,250,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition:"all .4s"
      }}>
        {/* Logo */}
        <div className="navbar-logo" style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,var(--teal),var(--navy))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>💙</div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:20, color:"var(--navy)" }}>
            PhysioCare <span style={{ color:"var(--teal)" }}>Pro</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="desktop-nav-links" style={{ display:"flex", gap:32 }}>
          {[["#services","Services"],["#doctors","Doctors"],["#about","About"],["#contact","Contact"]].map(([h,l]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Desktop Login Button */}
          <button className="btn btn-primary desktop-nav-links" onClick={onShowLogin} style={{ padding:"10px 22px", display:"flex" }}>
            Login / Sign Up
          </button>
          {/* Mobile: Login icon + Hamburger */}
          <button onClick={onShowLogin} style={{ display:"none", padding:"9px 16px", background:"var(--teal)", color:"#fff", border:"none", borderRadius:10, fontWeight:600, fontSize:13, cursor:"pointer" }}
            className="mobile-login-btn">
            Login
          </button>
          <button onClick={() => setMobileMenu(m => !m)}
            style={{ width:40, height:40, borderRadius:10, border:"1px solid var(--border)", background:mobileMenu?"var(--teal-light)":"#fff", display:"none", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}
            className="hamburger-btn">
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:20, height:2, background:"var(--navy)", borderRadius:2, transition:"all .3s",
                  transform: mobileMenu && i===0 ? "rotate(45deg) translate(5px,5px)" : mobileMenu && i===1 ? "scaleX(0)" : mobileMenu && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none"
                }} />
              ))}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div style={{
          position:"fixed", top:68, left:0, right:0, zIndex:99,
          background:"#fff", borderBottom:"1px solid var(--border)",
          padding:"16px 20px", display:"flex", flexDirection:"column", gap:4,
          boxShadow:"0 8px 24px rgba(0,0,0,0.1)", animation:"fadeUp .25s ease"
        }}>
          {[["#services","🩺 Services"],["#doctors","👨‍⚕️ Doctors"],["#about","ℹ️ About"],["#contact","📞 Contact"]].map(([h,l]) => (
            <a key={l} href={h} onClick={() => setMobileMenu(false)}
              style={{ padding:"12px 14px", borderRadius:10, fontWeight:600, fontSize:15, color:"var(--navy)", textDecoration:"none", display:"block", transition:"background .15s" }}
              onMouseEnter={e=>e.target.style.background="var(--teal-light)"}
              onMouseLeave={e=>e.target.style.background="transparent"}>
              {l}
            </a>
          ))}
          <button className="btn btn-primary" onClick={() => { setMobileMenu(false); onShowLogin(); }}
            style={{ margin:"8px 0 4px", width:"100%", padding:"13px", fontSize:15, justifyContent:"center" }}>
            Login / Sign Up
          </button>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="hero-section" style={{
        minHeight:"100vh", display:"flex", alignItems:"center",
        padding:"80px 5vw 0", position:"relative", overflow:"hidden",
        background:"linear-gradient(145deg, #E8F4F1 0%, #F7FAFA 50%, #EAF2F9 100%)"
      }}>
        {/* decorative blobs */}
        <div style={{ position:"absolute", top:-120, right:-80, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(11,123,107,0.08),transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:"5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(15,37,64,0.06),transparent 70%)", pointerEvents:"none" }} />

        <div className="hero-flex" style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", gap:60, flexWrap:"wrap" }}>
          {/* TEXT */}
          <div style={{ flex:1, minWidth:280 }}>
            <div className="fadeUp" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"#E6F4F1", padding:"7px 16px", borderRadius:50, marginBottom:24,
              border:"1px solid #B2DFDB"
            }}>
              <span style={{ fontSize:14 }}>🏆</span>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--teal)" }}>India's #1 Physiotherapy Platform</span>
            </div>
            <h1 className="fadeUp2" style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(38px,5.5vw,68px)",
              fontWeight:700, lineHeight:1.1, marginBottom:20, color:"var(--navy)"
            }}>
              Heal Faster,<br />
              <span style={{ color:"var(--teal)" }}>Live Better.</span>
            </h1>
            <p className="fadeUp3" style={{ fontSize:16, color:"var(--muted)", lineHeight:1.75, marginBottom:36, maxWidth:480 }}>
              Expert physiotherapy — at our clinic or your home.
              200+ certified therapists. 50,000+ happy patients.
              Book your session in under 2 minutes.
            </p>
            <div className="fadeUp3" style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:36 }}>
              <button className="btn btn-primary" onClick={onShowLogin} style={{ padding:"14px 32px", fontSize:15 }}>
                Book Appointment →
              </button>
              <button className="btn btn-ghost" onClick={onHowItWorks} style={{ padding:"14px 28px", fontSize:15, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:32, height:32, borderRadius:"50%", background:"var(--teal)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12 }}>▶</span>
                How It Works
              </button>
            </div>
            <div className="fadeUp3" style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
              {[["🏠","Home Visit Available"],["⚡","Same Day Booking"],["✅","NABH Certified"]].map(([i,t]) => (
                <div key={t} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:500, color:"var(--muted)" }}>
                  <span>{i}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE */}
          <div style={{ flex:1, minWidth:280, display:"flex", justifyContent:"center", position:"relative" }}>
            <div style={{
              width:"clamp(260px,35vw,440px)", height:"clamp(260px,35vw,440px)",
              borderRadius:"30% 70% 70% 30% / 30% 30% 70% 70%",
              overflow:"hidden", position:"relative",
              boxShadow:"0 24px 64px rgba(11,123,107,0.22)",
              animation:"float 5s ease-in-out infinite"
            }}>
              <img src={HERO_IMGS[heroImg]} alt="Physiotherapy" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"opacity .8s" }} />
            </div>
            {/* Floating cards */}
            <div style={{
              position:"absolute", top:"8%", right:"0%",
              background:"#fff", borderRadius:16, padding:"12px 16px",
              boxShadow:"0 8px 32px rgba(0,0,0,0.10)",
              display:"flex", alignItems:"center", gap:10,
              animation:"float 3.5s ease-in-out infinite"
            }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"#E6F4F1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✅</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"var(--navy)" }}>Booking Confirmed!</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>Today 3:00 PM</div>
              </div>
            </div>
            <div style={{
              position:"absolute", bottom:"12%", left:"-4%",
              background:"var(--gold-light)", borderRadius:16, padding:"12px 16px",
              boxShadow:"0 8px 32px rgba(0,0,0,0.10)",
              display:"flex", alignItems:"center", gap:10,
              animation:"float 4s ease-in-out infinite", animationDelay:".8s",
              border:"1px solid #F0D9A8"
            }}>
              <div style={{ fontSize:24 }}>⭐</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"var(--navy)" }}>4.9 / 5 Rating</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>50,000+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div style={{ background:"var(--navy)", padding:"44px 5vw" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:20 }}>
          {[["50,000+","Patients Treated"],["200+","Expert Therapists"],["98%","Satisfaction Rate"],["15+","Cities Covered"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center", color:"#fff" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:700 }}>{n}</div>
              <div style={{ fontSize:13, opacity:.7, fontWeight:500, marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SERVICES ─── */}
      <section id="services" style={{ padding:"88px 5vw", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"var(--teal)", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>What We Offer</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:700, color:"var(--navy)" }}>
              Comprehensive Physiotherapy Services
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:24 }}>
            {SERVICE_CARDS.map(s => (
              <div key={s.title} className="card" style={{ overflow:"hidden", cursor:"pointer" }}>
                <div style={{ height:200, overflow:"hidden" }}>
                  <img src={s.img} alt={s.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
                    onMouseEnter={e => e.target.style.transform="scale(1.07)"}
                    onMouseLeave={e => e.target.style.transform="scale(1)"} />
                </div>
                <div style={{ padding:"22px 24px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)" }}>{s.title}</h3>
                    <Tag>{s.tag}</Tag>
                  </div>
                  <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.65 }}>{s.desc}</p>
                  <button className="btn btn-outline" onClick={onShowLogin} style={{ marginTop:16, padding:"8px 18px", fontSize:13 }}>
                    Book Session →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOME VISIT BANNER ─── */}
      <section style={{
        padding:"80px 5vw", position:"relative", overflow:"hidden",
        background:"linear-gradient(135deg, var(--navy) 0%, #162d4a 100%)"
      }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:64, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ flex:1, minWidth:280 }}>
            <Tag color="#7EC8E3" bg="rgba(126,200,227,0.15)">🏠 Home Visit Service</Tag>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:700, color:"#fff", lineHeight:1.2, margin:"18px 0 16px" }}>
              Professional Care<br />At Your Doorstep
            </h2>
            <p style={{ color:"rgba(255,255,255,0.7)", lineHeight:1.75, fontSize:15, marginBottom:28 }}>
              Can't visit the clinic? Our certified physiotherapists bring their expertise — and equipment — straight to your home.
            </p>
            {["Verified & background-checked therapists","Full equipment carried to your location","Flexible slots: 7 AM – 9 PM daily","Only ₹200 extra per session"].map(t => (
              <div key={t} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                <span style={{ width:20, height:20, borderRadius:"50%", background:"var(--teal)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0, marginTop:1 }}>✓</span>
                <span style={{ color:"rgba(255,255,255,0.8)", fontSize:14 }}>{t}</span>
              </div>
            ))}
            <button className="btn btn-gold" onClick={onShowLogin} style={{ marginTop:24, padding:"13px 28px", fontSize:15 }}>
              Book Home Visit →
            </button>
          </div>
          <div style={{ flex:1, minWidth:260 }}>
            <div style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
              <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=580&h=420&fit=crop" alt="Home Visit" style={{ width:"100%", display:"block" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── DOCTORS ─── */}
      <section id="doctors" style={{ padding:"88px 5vw", background:"var(--bg)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"var(--teal)", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Our Experts</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:700, color:"var(--navy)" }}>Meet Our Top Therapists</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
            {doctors.map(doc => (
              <div key={doc.id} className="card" style={{ textAlign:"center", overflow:"hidden", padding:0 }}>
                <div style={{ height:220, overflow:"hidden", position:"relative" }}>
                  <img src={doc.img} alt={doc.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
                    onMouseEnter={e => e.target.style.transform="scale(1.07)"}
                    onMouseLeave={e => e.target.style.transform="scale(1)"} />
                  <div style={{ position:"absolute", bottom:12, right:12 }}>
                    {doc.homeVisitEnabled
                      ? <Tag color="#16A34A" bg="rgba(22,163,74,0.9)">🏠 Home Visit</Tag>
                      : <Tag color="#6B7280" bg="rgba(107,114,128,0.85)">Clinic Only</Tag>}
                  </div>
                </div>
                <div style={{ padding:"20px 24px 24px" }}>
                  <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)" }}>{doc.name}</h3>
                  <p style={{ color:"var(--teal)", fontWeight:600, fontSize:13, margin:"6px 0 12px" }}>{doc.spec}</p>
                  <div style={{ display:"flex", justifyContent:"center", gap:18, marginBottom:16 }}>
                    <div><div style={{ fontWeight:700, color:"var(--navy)" }}>{doc.exp}</div><div style={{ fontSize:11, color:"var(--muted)" }}>Experience</div></div>
                    <div style={{ width:1, background:"var(--border)" }} />
                    <div><div style={{ fontWeight:700, color:"var(--gold)" }}>⭐ {doc.rating}</div><div style={{ fontSize:11, color:"var(--muted)" }}>{doc.reviews} reviews</div></div>
                    <div style={{ width:1, background:"var(--border)" }} />
                    <div><div style={{ fontWeight:700, color:"var(--teal)" }}>₹{doc.clinicCharge}</div><div style={{ fontSize:11, color:"var(--muted)" }}>per session</div></div>
                  </div>
                  <button className="btn btn-primary" onClick={onShowLogin} style={{ width:"100%", padding:"11px" }}>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding:"80px 5vw", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:700, color:"var(--navy)" }}>
              What Our Patients Say
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:22 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding:"28px 28px 24px" }}>
                <div style={{ display:"flex", gap:2, marginBottom:14 }}>
                  {"★★★★★".split("").map((s,i) => <span key={i} style={{ color:"var(--gold)", fontSize:16 }}>{s}</span>)}
                </div>
                <p style={{ color:"var(--muted)", lineHeight:1.7, fontSize:14, marginBottom:20, fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <img src={t.img} alt={t.name} style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover" }} />
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ padding:"88px 5vw", background:"var(--bg)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"var(--teal)", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>About Us</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:700, color:"var(--navy)", marginBottom:16 }}>
              Why Choose PhysioCare Pro?
            </h2>
            <p style={{ color:"var(--muted)", fontSize:16, maxWidth:580, margin:"0 auto", lineHeight:1.75 }}>
              Since 2018, we have been making world-class physiotherapy accessible and affordable across India — at our clinics and in your home.
            </p>
          </div>

          {/* Story section */}
          <div style={{ display:"flex", gap:56, alignItems:"center", flexWrap:"wrap", marginBottom:72 }}>
            <div style={{ flex:1, minWidth:280 }}>
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=560&h=380&fit=crop"
                alt="Our Clinic" style={{ width:"100%", borderRadius:20, boxShadow:"0 16px 48px rgba(11,123,107,0.15)" }} />
            </div>
            <div style={{ flex:1, minWidth:280 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:"var(--navy)", marginBottom:16 }}>
                Our Story
              </h3>
              <p style={{ color:"var(--muted)", lineHeight:1.8, fontSize:15, marginBottom:16 }}>
                PhysioCare Pro began with a simple idea — that everyone, regardless of their city or circumstances, deserves access to expert physiotherapy. Today we have helped over 50,000 patients live healthier, more active lives.
              </p>
              <p style={{ color:"var(--muted)", lineHeight:1.8, fontSize:15, marginBottom:24 }}>
                Our 200+ certified therapists follow NABH-approved protocols and provide personalised care — whether at our clinics or in your home.
              </p>
              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                {[["2018","Founded"],["200+","Therapists"],["15+","Cities"],["98%","Success Rate"]].map(([n,l]) => (
                  <div key={l} style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"var(--teal)" }}>{n}</div>
                    <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
            {[
              { icon:"🎯", title:"Mission", desc:"Har patient ko world-class physiotherapy — clinic ya ghar, koi farq nahi." },
              { icon:"👁️", title:"Vision", desc:"2030 tak India ke har district mein certified physiotherapist pahunchana." },
              { icon:"💎", title:"Quality", desc:"Sirf NABH-certified therapists, background-checked aur continuously trained." },
              { icon:"❤️", title:"Care", desc:"Har patient ek family member ki tarah — personalized, patient, aur compassionate care." },
            ].map(v => (
              <div key={v.title} className="card" style={{ padding:"24px", textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{v.icon}</div>
                <h4 style={{ fontWeight:700, fontSize:16, color:"var(--navy)", marginBottom:8 }}>{v.title}</h4>
                <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div style={{ marginTop:64, textAlign:"center" }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:"var(--navy)", marginBottom:8 }}>
              Our Leadership Team
            </h3>
            <p style={{ color:"var(--muted)", marginBottom:36, fontSize:15 }}>The people behind PhysioCare Pro</p>
            <div style={{ display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
              {[
                { name:"Dr. Arjun Kapoor", role:"Co-Founder & CEO", img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&h=120&fit=crop&crop=face" },
                { name:"Dr. Meera Nair",   role:"Chief Medical Officer", img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face" },
                { name:"Rohit Sharma",     role:"Head of Technology", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face" },
              ].map(t => (
                <div key={t.name} style={{ textAlign:"center" }}>
                  <img src={t.img} alt={t.name} style={{ width:96, height:96, borderRadius:"50%", objectFit:"cover",
                    border:"3px solid var(--teal-light)", marginBottom:12, boxShadow:"0 4px 16px rgba(11,123,107,0.15)" }} />
                  <div style={{ fontWeight:700, fontSize:15, color:"var(--navy)" }}>{t.name}</div>
                  <div style={{ fontSize:13, color:"var(--teal)", fontWeight:600, marginTop:3 }}>{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding:"80px 5vw", background:"var(--teal-light)", textAlign:"center" }}>
        <div style={{ maxWidth:620, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:700, color:"var(--navy)", marginBottom:14 }}>
            Ready to Start Healing?
          </h2>
          <p style={{ color:"var(--muted)", fontSize:16, marginBottom:32, lineHeight:1.7 }}>
            Join 50,000+ patients who trust PhysioCare Pro for expert physiotherapy care.
          </p>
          <button className="btn btn-primary" onClick={onShowLogin} style={{ padding:"16px 44px", fontSize:16 }}>
            Book Your Session Today →
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="contact" style={{ background:"var(--navy)", padding:"56px 5vw 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:36, marginBottom:44 }}>
          <div style={{ maxWidth:260 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--teal)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💙</div>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:20, color:"#fff" }}>PhysioCare Pro</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.7, fontSize:13 }}>India's leading physiotherapy platform. Expert care at clinic and home.</p>
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              {["📘","🐦","📸","▶️"].map(i => (
                <div key={i} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16 }}>{i}</div>
              ))}
            </div>
          </div>
          {[
            { t:"Services", l:["Orthopaedic Rehab","Neuro Physio","Sports Injury","Home Visit","Women's Health"] },
            { t:"Company",  l:[["About Us","#about"],["Our Doctors","#doctors"],["Careers","#"],["Blog","#"],["Press","#"]] },
            { t:"Support",  l:[["Book Appointment","book"],["Contact Us","#contact"],["FAQ","#"],["Privacy Policy","#"],["Terms","#"]] },
          ].map(({ t, l }) => (
            <div key={t}>
              <div style={{ color:"#fff", fontWeight:700, marginBottom:16, fontSize:14 }}>{t}</div>
              {l.map(([label, href]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <a href={href==="book"||href==="#"?undefined:href}
                    onClick={href==="book" ? onShowLogin : undefined}
                    style={{ color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, transition:"color .2s", cursor:"pointer" }}
                    onMouseEnter={e => e.target.style.color="#fff"}
                    onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.5)"}>{label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>© 2025 PhysioCare Pro. All rights reserved.</p>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>Built with ❤️ in India</p>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════
// PATIENT DASHBOARD
// ══════════════════════════════════════════════════
function PatientDash({ user, appointments, doctors, onBook, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ doctorId:"", service:"", date:"", time:"", type:"clinic", notes:"", address:"" });
  const [booked, setBooked] = useState(false);

  const mine = appointments.filter(a => a.patientEmail === user.email);
  const upcoming = mine.filter(a => !["completed","cancelled"].includes(a.status));
  const past = mine.filter(a => ["completed","cancelled"].includes(a.status));
  const selDoc = doctors.find(d => d.id === parseInt(form.doctorId));
  const amt = selDoc ? (form.type==="home" ? selDoc.homeVisitCharge : selDoc.clinicCharge) : 0;

  const handleBook = () => {
    if (!form.doctorId||!form.service||!form.date||!form.time) return;
    onBook({ id:Date.now(), patientName:user.name, patientEmail:user.email, doctorId:parseInt(form.doctorId), doctorName:selDoc.name, service:form.service, date:form.date, time:form.time, type:form.type, amount:amt, status:"pending", notes:form.notes });
    setBooked(true);
    setTimeout(() => { setBooked(false); setShowBook(false); setForm({ doctorId:"", service:"", date:"", time:"", type:"clinic", notes:"", address:"" }); }, 2500);
  };

  const NAV = [
    { id:"overview",     icon:"📊", label:"Overview" },
    { id:"appointments", icon:"📅", label:"My Appointments" },
    { id:"doctors",      icon:"🔍", label:"Find Doctors" },
    { id:"profile",      icon:"👤", label:"My Profile" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{G}</style>

      {/* SIDEBAR */}
      <aside className="dash-sidebar" style={{ width:240, background:"linear-gradient(180deg,var(--navy),var(--navy-soft))", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, bottom:0, left:0, zIndex:50, boxShadow:"4px 0 20px rgba(15,37,64,0.15)" }}>
        <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"var(--teal)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💙</div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:17, color:"#fff" }}>PhysioCare</span>
        </div>
        <div style={{ padding:"0 12px", flex:1 }}>
          {NAV.map(n => (
            <div key={n.id} className={`sidebar-link ${tab===n.id?"active":""}`} onClick={() => setTab(n.id)}>
              <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
            </div>
          ))}
          <div className="sidebar-link" onClick={() => setShowBook(true)} style={{ background:"rgba(11,123,107,0.25)", color:"var(--teal-mid)", marginTop:12 }}>
            <span style={{ fontSize:18 }}>➕</span>Book New
          </div>
        </div>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <Avatar src={user.avatar} name={user.name} size={38} />
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"#fff" }}>{user.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>Patient</div>
            </div>
          </div>
          <button onClick={onLogout} className="btn btn-danger" style={{ width:"100%", fontSize:13, padding:"9px", justifyContent:"center" }}>🚪 Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main" style={{ marginLeft:240, flex:1, padding:"36px 40px" }}>
        {/* Topbar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"var(--navy)" }}>
              {tab==="overview" ? `Good day, ${user.name.split(" ")[0]}! 👋` : NAV.find(n=>n.id===tab)?.label}
            </h1>
            <p style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>
              {tab==="overview" ? "Welcome back to your health dashboard." : ""}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowBook(true)} style={{ gap:6 }}>
            + Book Appointment
          </button>
        </div>

        {/* OVERVIEW */}
        {tab==="overview" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:18, marginBottom:32 }}>
              <StatCard icon="📅" label="Total Sessions" value={mine.length} />
              <StatCard icon="⏳" label="Upcoming" value={upcoming.length} color="var(--gold)" />
              <StatCard icon="✅" label="Completed" value={past.filter(a=>a.status==="completed").length} color="#16A34A" />
              <StatCard icon="💰" label="Total Spent" value={`₹${mine.filter(a=>a.status==="completed").reduce((s,a)=>s+a.amount,0).toLocaleString()}`} color="var(--navy)" />
            </div>

            {upcoming.length > 0 ? (
              <>
                <h2 style={{ fontWeight:700, fontSize:18, color:"var(--navy)", marginBottom:16 }}>Upcoming Appointments</h2>
                {upcoming.map(a => <PatientApptCard key={a.id} a={a} />)}
              </>
            ) : (
              <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:20, border:"1px solid var(--border)" }}>
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=180&h=120&fit=crop" alt="" style={{ borderRadius:12, marginBottom:20, opacity:.7 }} />
                <h3 style={{ fontWeight:700, fontSize:18, color:"var(--navy)", marginBottom:8 }}>No upcoming appointments</h3>
                <p style={{ color:"var(--muted)", marginBottom:20 }}>Book your first physiotherapy session today!</p>
                <button className="btn btn-primary" onClick={() => setShowBook(true)}>Book Now →</button>
              </div>
            )}
          </>
        )}

        {/* APPOINTMENTS */}
        {tab==="appointments" && (
          <>
            {upcoming.length > 0 && (
              <>
                <h3 style={{ fontWeight:700, fontSize:16, color:"var(--teal)", marginBottom:14 }}>Upcoming ({upcoming.length})</h3>
                {upcoming.map(a => <PatientApptCard key={a.id} a={a} />)}
              </>
            )}
            {past.length > 0 && (
              <>
                <h3 style={{ fontWeight:700, fontSize:16, color:"var(--muted)", margin:"24px 0 14px" }}>Past Appointments ({past.length})</h3>
                {past.map(a => <PatientApptCard key={a.id} a={a} />)}
              </>
            )}
            {mine.length === 0 && <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>No appointments yet.</div>}
          </>
        )}

        {/* FIND DOCTORS */}
        {tab==="doctors" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:22 }}>
            {doctors.map(doc => (
              <div key={doc.id} className="card" style={{ padding:0, overflow:"hidden" }}>
                <div style={{ height:180, overflow:"hidden" }}>
                  <img src={doc.img} alt={doc.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
                    onMouseEnter={e=>e.target.style.transform="scale(1.08)"}
                    onMouseLeave={e=>e.target.style.transform="scale(1)"} />
                </div>
                <div style={{ padding:"18px 20px 22px" }}>
                  <h3 style={{ fontWeight:700, fontSize:16, color:"var(--navy)" }}>{doc.name}</h3>
                  <p style={{ color:"var(--teal)", fontWeight:600, fontSize:13, margin:"4px 0 10px" }}>{doc.spec}</p>
                  <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.55, marginBottom:12 }}>{doc.bio}</p>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                    <Tag>⭐ {doc.rating}</Tag>
                    <Tag>Clinic: ₹{doc.clinicCharge}</Tag>
                    {doc.homeVisitEnabled && <Tag color="#16A34A">Home: ₹{doc.homeVisitCharge}</Tag>}
                  </div>
                  <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}
                    onClick={() => { setForm(f=>({...f, doctorId:String(doc.id)})); setShowBook(true); }}>
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {tab==="profile" && (
          <div style={{ maxWidth:520 }}>
            <div style={{ background:"#fff", borderRadius:20, padding:32, border:"1px solid var(--border)" }}>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <Avatar src={user.avatar} name={user.name} size={80} />
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:"var(--navy)", marginTop:12 }}>{user.name}</h2>
                <p style={{ color:"var(--muted)", fontSize:13 }}>{user.email}</p>
                <Tag style={{ marginTop:8 }}>Patient</Tag>
              </div>
              {[["Full Name","text",user.name],["Email","email",user.email],["Phone","tel",""],["City","text",""]].map(([l,t,v]) => (
                <div key={l} style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>{l}</label>
                  <input className="input" type={t} defaultValue={v} />
                </div>
              ))}
              <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:13, marginTop:8 }}>Save Changes</button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav items={[
        { id:"overview",     icon:"📊", label:"Overview",  short:"Home" },
        { id:"appointments", icon:"📅", label:"Bookings",  short:"Bookings" },
        { id:"doctors",      icon:"🔍", label:"Doctors",   short:"Doctors" },
        { id:"profile",      icon:"👤", label:"Profile",   short:"Profile" },
        { id:"__book__",     icon:"➕", label:"Book",      short:"Book" },
      ]} active={tab} onChange={id => id==="__book__" ? setShowBook(true) : setTab(id)} />

      {/* BOOKING MODAL */}
      {showBook && (
        <Modal title="📅 Book New Appointment" onClose={() => setShowBook(false)} w="520px">
          {booked ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:64, animation:"pulse .6s ease", marginBottom:16 }}>🎉</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:"#16A34A", marginBottom:8 }}>Appointment Booked!</h3>
              <p style={{ color:"var(--muted)" }}>Confirmation SMS bheja jayega.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Select Doctor</label>
                <select className="input" value={form.doctorId} onChange={e => setForm({...form, doctorId:e.target.value})}>
                  <option value="">— Therapist chunein —</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.spec}</option>)}
                </select>
              </div>
              {selDoc && (
                <div style={{ background:"var(--teal-light)", borderRadius:12, padding:"12px 16px", marginBottom:16, border:"1px solid #B2DFDB", display:"flex", gap:14, alignItems:"center" }}>
                  <img src={selDoc.img} alt="" style={{ width:44, height:44, borderRadius:10, objectFit:"cover" }} />
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>{selDoc.name}</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>Clinic: ₹{selDoc.clinicCharge} {selDoc.homeVisitEnabled && `· Home: ₹${selDoc.homeVisitCharge}`}</div>
                  </div>
                </div>
              )}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Service</label>
                <select className="input" value={form.service} onChange={e => setForm({...form, service:e.target.value})}>
                  <option value="">— Service chunein —</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display:"flex", gap:12, marginBottom:16 }}>
                {[["clinic","🏥","Clinic Visit"],["home","🏠","Home Visit"]].map(([v,ic,lb]) => {
                  const dis = v==="home" && selDoc && !selDoc.homeVisitEnabled;
                  return (
                    <div key={v} onClick={() => !dis && setForm({...form, type:v})}
                      style={{ flex:1, padding:"14px 10px", borderRadius:12, textAlign:"center", cursor:dis?"not-allowed":"pointer", opacity:dis?.5:1,
                        border:`2px solid ${form.type===v?"var(--teal)":"var(--border)"}`,
                        background:form.type===v?"var(--teal-light)":"#fff", transition:"all .2s" }}>
                      <div style={{ fontSize:22, marginBottom:4 }}>{ic}</div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{lb}</div>
                      {v==="home"&&selDoc?.homeVisitEnabled&&<div style={{ fontSize:10, color:"#16A34A", fontWeight:600, marginTop:2 }}>+₹200 extra</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", gap:12, marginBottom:16 }}>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Date</label>
                  <input className="input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} min={new Date().toISOString().split("T")[0]} />
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:8 }}>Time Slot</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {TIME_SLOTS.map(t => (
                    <div key={t} onClick={() => setForm({...form,time:t})}
                      style={{ padding:"10px 6px", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:500, cursor:"pointer",
                        border:`2px solid ${form.time===t?"var(--teal)":"var(--border)"}`,
                        background:form.time===t?"var(--teal-light)":"#fff", transition:"all .15s" }}>{t}</div>
                  ))}
                </div>
              </div>
              {form.type==="home" && (
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Home Address</label>
                  <textarea className="input" rows={2} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Complete address for home visit..." style={{ resize:"none" }} />
                </div>
              )}
              {selDoc && form.date && form.time && (
                <div style={{ background:"var(--teal-light)", borderRadius:12, padding:"14px 16px", marginBottom:16, border:"1px solid #B2DFDB" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontWeight:600, fontSize:14, color:"var(--navy)" }}>Total Amount:</span>
                    <span style={{ fontWeight:700, fontSize:20, color:"var(--teal)" }}>₹{amt}</span>
                  </div>
                </div>
              )}
              <button className="btn btn-primary" onClick={handleBook}
                disabled={!form.doctorId||!form.service||!form.date||!form.time}
                style={{ width:"100%", justifyContent:"center", padding:13, fontSize:15 }}>
                ✓ Confirm Appointment
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

function PatientApptCard({ a }) {
  return (
    <div className="card" style={{ padding:"18px 22px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"var(--teal-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
          {a.type==="home"?"🏠":"🏥"}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:"var(--navy)" }}>{a.service}</div>
          <div style={{ fontSize:13, color:"var(--muted)", marginTop:2 }}>👨‍⚕️ {a.doctorName} · 📅 {a.date} · {a.time}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <span style={{ fontWeight:700, fontSize:16, color:"var(--teal)" }}>₹{a.amount}</span>
        <StatusTag s={a.status} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// DOCTOR DASHBOARD
// ══════════════════════════════════════════════════
function DoctorDash({ user, appointments, doctors, onUpdateDoctor, onUpdateAppt, onLogout }) {
  const [tab, setTab] = useState("overview");
  const myDoc = doctors.find(d => d.email === user.email) || doctors[0];
  const [charges, setCharges] = useState({
    clinicCharge: myDoc?.clinicCharge||800,
    homeVisitCharge: myDoc?.homeVisitCharge||1000,
    homeVisitExtra: myDoc?.homeVisitExtra||200,
    homeVisitEnabled: myDoc?.homeVisitEnabled??true,
  });
  const [saved, setSaved] = useState(false);

  const myAppts = appointments.filter(a => a.doctorId === myDoc?.id);
  const pending = myAppts.filter(a => a.status==="pending");
  const revenue = myAppts.filter(a => a.status==="completed").reduce((s,a)=>s+a.amount,0);

  const saveCharges = () => {
    onUpdateDoctor(myDoc.id, charges);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const NAV = [
    { id:"overview",  icon:"📊", label:"Overview" },
    { id:"schedule",  icon:"📅", label:"Schedule" },
    { id:"patients",  icon:"👥", label:"Patients" },
    { id:"charges",   icon:"💰", label:"Manage Charges" },
    { id:"profile",   icon:"👨‍⚕️", label:"Profile" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{G}</style>
      <aside className="dash-sidebar" style={{ width:240, background:"linear-gradient(180deg,#0d3b2e,#0B7B6B)", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, bottom:0, left:0, zIndex:50, boxShadow:"4px 0 20px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.12)", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💙</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:16, color:"#fff" }}>PhysioCare</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:1, textTransform:"uppercase" }}>Doctor Portal</div>
          </div>
        </div>
        <div style={{ padding:"0 12px", flex:1 }}>
          {NAV.map(n => (
            <div key={n.id} className={`sidebar-link ${tab===n.id?"active":""}`} onClick={() => setTab(n.id)}>
              <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <Avatar src={user.avatar} name={user.name} size={38} />
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140 }}>{user.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{myDoc?.spec}</div>
            </div>
          </div>
          <button onClick={onLogout} className="btn btn-danger" style={{ width:"100%", fontSize:13, padding:9, justifyContent:"center" }}>🚪 Logout</button>
        </div>
      </aside>

      <main className="dash-main" style={{ marginLeft:240, flex:1, padding:"36px 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"var(--navy)" }}>
              {tab==="overview" ? `Welcome back, ${user.name}! 👨‍⚕️` : NAV.find(n=>n.id===tab)?.label}
            </h1>
          </div>
          {pending.length>0 && (
            <div style={{ background:"#FEF3C7", color:"#92400E", padding:"10px 18px", borderRadius:10, fontWeight:600, fontSize:13, border:"1px solid #FDE68A" }}>
              🔔 {pending.length} pending {pending.length===1?"request":"requests"}
            </div>
          )}
        </div>

        {tab==="overview" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:18, marginBottom:32 }}>
              <StatCard icon="📅" label="Total Appointments" value={myAppts.length} />
              <StatCard icon="⏳" label="Pending" value={pending.length} color="var(--gold)" />
              <StatCard icon="✅" label="Completed" value={myAppts.filter(a=>a.status==="completed").length} color="#16A34A" />
              <StatCard icon="💰" label="Revenue" value={`₹${revenue.toLocaleString()}`} color="var(--navy)" sub="All time" />
            </div>

            {/* Charge summary card */}
            <div className="card" style={{ padding:"22px 26px", marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)" }}>💰 My Current Charges</h3>
                <button className="btn btn-outline" onClick={() => setTab("charges")} style={{ padding:"8px 16px", fontSize:12 }}>Edit Charges</button>
              </div>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <div style={{ background:"var(--teal-light)", borderRadius:12, padding:"16px 24px", border:"1px solid #B2DFDB", textAlign:"center" }}>
                  <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600, marginBottom:6 }}>🏥 Clinic Session</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"var(--teal)" }}>₹{myDoc?.clinicCharge}</div>
                </div>
                {myDoc?.homeVisitEnabled ? (
                  <div style={{ background:"#F0FDF4", borderRadius:12, padding:"16px 24px", border:"1px solid #BBF7D0", textAlign:"center" }}>
                    <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600, marginBottom:6 }}>🏠 Home Visit</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"#16A34A" }}>₹{myDoc?.homeVisitCharge}</div>
                    <div style={{ fontSize:11, color:"#16A34A", marginTop:3 }}>+₹{myDoc?.homeVisitExtra} extra included</div>
                  </div>
                ) : (
                  <div style={{ background:"#F9FAFB", borderRadius:12, padding:"16px 24px", border:"1px solid var(--border)", textAlign:"center" }}>
                    <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600, marginBottom:6 }}>🏠 Home Visit</div>
                    <div style={{ fontWeight:700, color:"#9CA3AF" }}>Disabled</div>
                  </div>
                )}
              </div>
            </div>

            {pending.length > 0 && (
              <>
                <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)", marginBottom:14 }}>Pending Approvals</h3>
                {pending.map(a => <DoctorApptCard key={a.id} a={a} onUpdate={onUpdateAppt} />)}
              </>
            )}
            {myAppts.filter(a=>a.status==="confirmed").length > 0 && (
              <>
                <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)", margin:"24px 0 14px" }}>Confirmed Sessions</h3>
                {myAppts.filter(a=>a.status==="confirmed").map(a => <DoctorApptCard key={a.id} a={a} onUpdate={onUpdateAppt} />)}
              </>
            )}
          </>
        )}

        {tab==="schedule" && (
          <>
            {myAppts.length===0 && <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>No appointments yet.</div>}
            {myAppts.map(a => <DoctorApptCard key={a.id} a={a} onUpdate={onUpdateAppt} />)}
          </>
        )}

        {tab==="patients" && (
          [...new Set(myAppts.map(a=>a.patientEmail))].map(email => {
            const ps = myAppts.filter(a=>a.patientEmail===email);
            return (
              <div key={email} className="card" style={{ padding:"18px 24px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:"var(--teal-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:"var(--navy)" }}>{ps[0].patientName}</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>{email}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:700, color:"var(--navy)" }}>{ps.length} session{ps.length>1?"s":""}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>Last: {ps[0].date}</div>
                </div>
              </div>
            );
          })
        )}

        {/* ─── MANAGE CHARGES ─── */}
        {tab==="charges" && (
          <div style={{ maxWidth:560 }}>
            <div style={{ background:"#fff", borderRadius:20, padding:32, border:"1px solid var(--border)" }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"var(--navy)", marginBottom:8 }}>Manage Your Charges</h2>
              <p style={{ color:"var(--muted)", fontSize:14, marginBottom:28 }}>Set your consultation fees. Patients will see these charges when booking.</p>

              {/* Home Visit Toggle */}
              <div onClick={() => setCharges(c => ({...c, homeVisitEnabled:!c.homeVisitEnabled}))}
                style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  background: charges.homeVisitEnabled ? "#F0FDF4" : "#F9FAFB",
                  borderRadius:14, padding:"16px 20px", marginBottom:24, cursor:"pointer",
                  border:`2px solid ${charges.homeVisitEnabled?"#BBF7D0":"var(--border)"}`, transition:"all .3s"
                }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"var(--navy)" }}>🏠 Home Visit Service</div>
                  <div style={{ fontSize:13, color:"var(--muted)", marginTop:3 }}>
                    {charges.homeVisitEnabled ? "Currently accepting home visit requests" : "Home visits are disabled for your profile"}
                  </div>
                </div>
                <div style={{
                  width:52, height:28, borderRadius:14, position:"relative", flexShrink:0,
                  background: charges.homeVisitEnabled ? "#16A34A" : "#D1D5DB", transition:"background .3s"
                }}>
                  <div style={{
                    position:"absolute", top:4, width:20, height:20, borderRadius:"50%", background:"#fff",
                    left: charges.homeVisitEnabled ? 28 : 4, transition:"left .3s",
                    boxShadow:"0 2px 4px rgba(0,0,0,0.2)"
                  }} />
                </div>
              </div>

              {/* Clinic Charge */}
              <div style={{ marginBottom:22 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:8 }}>🏥 Clinic Session Charge (₹)</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"var(--teal)" }}>₹</span>
                  <input type="number" value={charges.clinicCharge} onChange={e=>setCharges(c=>({...c,clinicCharge:parseInt(e.target.value)||0}))}
                    style={{ width:"100%", padding:"14px 16px 14px 36px", borderRadius:12, border:"2px solid var(--border)", fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:"var(--teal)", background:"var(--teal-light)" }} />
                </div>
              </div>

              {charges.homeVisitEnabled && (
                <>
                  <div style={{ marginBottom:22 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:8 }}>🏠 Home Visit Charge (₹) <span style={{ fontWeight:400 }}>(total — base + extra)</span></label>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"#16A34A" }}>₹</span>
                      <input type="number" value={charges.homeVisitCharge} onChange={e=>setCharges(c=>({...c,homeVisitCharge:parseInt(e.target.value)||0}))}
                        style={{ width:"100%", padding:"14px 16px 14px 36px", borderRadius:12, border:"2px solid #BBF7D0", fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:"#16A34A", background:"#F0FDF4" }} />
                    </div>
                  </div>
                  <div style={{ marginBottom:24 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:8 }}>Home Visit Extra Fee (₹) <span style={{ fontWeight:400 }}>(shown separately to patients)</span></label>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"var(--gold)" }}>₹</span>
                      <input type="number" value={charges.homeVisitExtra} onChange={e=>setCharges(c=>({...c,homeVisitExtra:parseInt(e.target.value)||0}))}
                        style={{ width:"100%", padding:"14px 16px 14px 36px", borderRadius:12, border:"2px solid #F0D9A8", fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:"var(--gold)", background:"var(--gold-light)" }} />
                    </div>
                  </div>
                </>
              )}

              {/* Preview */}
              <div style={{ background:"var(--bg)", borderRadius:14, padding:16, marginBottom:22, border:"1px solid var(--border)" }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--muted)", marginBottom:10 }}>👀 Preview (as patients will see):</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <Tag>🏥 Clinic: ₹{charges.clinicCharge}</Tag>
                  {charges.homeVisitEnabled
                    ? <Tag color="#16A34A">🏠 Home: ₹{charges.homeVisitCharge} (+₹{charges.homeVisitExtra} extra)</Tag>
                    : <Tag color="#9CA3AF">Home Visit: Not Available</Tag>}
                </div>
              </div>

              <button className="btn btn-primary" onClick={saveCharges} style={{ width:"100%", justifyContent:"center", padding:14, fontSize:15 }}>
                {saved ? "✅ Saved Successfully!" : "💾 Save Charges"}
              </button>
            </div>
          </div>
        )}

        {tab==="profile" && myDoc && (
          <div style={{ maxWidth:520 }}>
            <div style={{ background:"#fff", borderRadius:20, padding:32, border:"1px solid var(--border)" }}>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <Avatar src={user.avatar} name={user.name} size={80} />
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:"var(--navy)", marginTop:12 }}>{user.name}</h2>
                <p style={{ color:"var(--teal)", fontWeight:600, fontSize:14 }}>{myDoc.spec}</p>
                <Tag color="#7C3AED" style={{ marginTop:8 }}>Doctor · {myDoc.exp}</Tag>
              </div>
              {[["Full Name","text",user.name],["Specialization","text",myDoc.spec],["Experience","text",myDoc.exp],["Email","email",user.email]].map(([l,t,v]) => (
                <div key={l} style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>{l}</label>
                  <input className="input" type={t} defaultValue={v} />
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:6 }}>Bio</label>
                <textarea className="input" rows={3} defaultValue={myDoc.bio} style={{ resize:"none" }} />
              </div>
              <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}>Save Profile</button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav items={[
        { id:"overview",  icon:"📊", label:"Overview",  short:"Home" },
        { id:"schedule",  icon:"📅", label:"Schedule",  short:"Schedule" },
        { id:"patients",  icon:"👥", label:"Patients",  short:"Patients" },
        { id:"charges",   icon:"💰", label:"Charges",   short:"Charges" },
        { id:"profile",   icon:"👨‍⚕️", label:"Profile", short:"Profile" },
      ]} active={tab} onChange={setTab} />
    </div>
  );
}

function DoctorApptCard({ a, onUpdate }) {
  return (
    <div className="card" style={{ padding:"18px 22px", marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:44, height:44, borderRadius:12, background:a.type==="home"?"#F0FDF4":"var(--teal-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
            {a.type==="home"?"🏠":"🏥"}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"var(--navy)" }}>{a.patientName}</div>
            <div style={{ fontSize:13, color:"var(--muted)", marginTop:2 }}>{a.service} · {a.date} at {a.time}</div>
            {a.notes && <div style={{ fontSize:12, color:"var(--muted)", fontStyle:"italic", marginTop:2 }}>"{a.notes}"</div>}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontWeight:700, color:"var(--teal)", fontSize:16 }}>₹{a.amount}</span>
          <StatusTag s={a.status} />
          {a.status==="pending" && (
            <>
              <button className="btn btn-success" onClick={() => onUpdate(a.id,{status:"confirmed"})} style={{ padding:"7px 14px", fontSize:12 }}>✓ Accept</button>
              <button className="btn btn-danger"  onClick={() => onUpdate(a.id,{status:"cancelled"})} style={{ padding:"7px 14px", fontSize:12 }}>✗ Decline</button>
            </>
          )}
          {a.status==="confirmed" && (
            <button className="btn btn-success" onClick={() => onUpdate(a.id,{status:"completed"})} style={{ padding:"7px 14px", fontSize:12 }}>Mark Done ✓</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════════
function AdminDash({ appointments, doctors, onUpdateDoctor, onUpdateAppt, onLogout }) {
  const [tab, setTab]       = useState("overview");
  const [editDoc, setEditDoc] = useState(null);
  const [apps, setApps]     = useState(DOCTOR_APPLICATIONS);

  const revenue     = appointments.filter(a=>a.status==="completed").reduce((s,a)=>s+a.amount,0);
  const pendingApps = apps.filter(a=>a.status==="pending").length;

  const NAV = [
    { id:"overview",     icon:"📊", label:"Dashboard" },
    { id:"appointments", icon:"📅", label:"All Bookings" },
    { id:"doctors",      icon:"👨‍⚕️", label:"Doctors" },
    { id:"requests",     icon:"📋", label:"Doctor Requests", badge: pendingApps },
    { id:"patients",     icon:"👥", label:"Patients" },
    { id:"revenue",      icon:"💰", label:"Revenue" },
  ];

  const approveApp = (app) => {
    const u = REGISTERED_USERS[app.email];
    if (u) { u.role="doctor"; u.name=app.name; u.spec=app.qualification; }
    else { REGISTERED_USERS[app.email] = { pass:"changeme123", role:"doctor", name:app.name, spec:app.qualification, avatar:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face" }; }
    setApps(prev => prev.map(a => a.id===app.id ? {...a, status:"approved"} : a));
    alert("✅ Approved! " + app.name + " is now a doctor.");
  };

  const rejectApp = (app) => {
    setApps(prev => prev.map(a => a.id===app.id ? {...a, status:"rejected"} : a));
    alert("❌ Application from " + app.name + " has been rejected.");
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{G}</style>

      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar" style={{ width:240, background:"linear-gradient(180deg,#1e0a3c,#2d0f5e)", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, bottom:0, left:0, zIndex:50, boxShadow:"4px 0 20px rgba(0,0,0,0.2)" }}>
        <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.1)", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💙</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:16, color:"#fff" }}>PhysioCare</div>
            <div style={{ fontSize:10, color:"rgba(192,132,252,0.8)", letterSpacing:1, textTransform:"uppercase" }}>Admin Panel</div>
          </div>
        </div>
        <div style={{ padding:"0 12px", flex:1 }}>
          {NAV.map(n => (
            <div key={n.id} className={`sidebar-link ${tab===n.id?"active":""}`} onClick={() => setTab(n.id)} style={{ position:"relative" }}>
              <span style={{ fontSize:18 }}>{n.icon}</span>
              {n.label}
              {n.badge > 0 && (
                <span style={{ marginLeft:"auto", background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:50 }}>
                  {n.badge}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👑</div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"#fff" }}>Admin</div>
              <div style={{ fontSize:11, color:"rgba(192,132,252,0.7)" }}>Super Administrator</div>
            </div>
          </div>
          <button onClick={onLogout} className="btn btn-danger" style={{ width:"100%", fontSize:13, padding:9, justifyContent:"center" }}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="dash-main" style={{ marginLeft:240, flex:1, padding:"36px 40px" }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"var(--navy)" }}>
            {tab==="overview" ? "👑 Admin Dashboard" : NAV.find(n=>n.id===tab)?.label}
          </h1>
          <p style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>Complete control over PhysioCare Pro platform</p>
        </div>

        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:18, marginBottom:32 }}>
              <StatCard icon="👥" label="Total Patients" value={Object.values(REGISTERED_USERS).filter(u=>u.role==="patient").length} />
              <StatCard icon="👨‍⚕️" label="Active Doctors" value={doctors.length} color="#7C3AED" />
              <StatCard icon="📋" label="Pending Requests" value={pendingApps} color="#D97706" sub={pendingApps>0?"Action needed":""} />
              <StatCard icon="📅" label="Total Bookings" value={appointments.length} color="var(--gold)" />
              <StatCard icon="💰" label="Revenue" value={`₹${revenue.toLocaleString()}`} color="#16A34A" sub="All time" />
            </div>
            <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)", marginBottom:14 }}>Recent Appointments</h3>
            {appointments.slice(0,5).map(a => (
              <div key={a.id} className="card" style={{ padding:"16px 20px", marginBottom:10, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>{a.patientName} → {a.doctorName}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:3 }}>{a.service} · {a.date} · {a.time} · {a.type==="home"?"🏠 Home":"🏥 Clinic"}</div>
                </div>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <span style={{ fontWeight:700, color:"var(--teal)" }}>₹{a.amount}</span>
                  <StatusTag s={a.status} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── ALL BOOKINGS ── */}
        {tab==="appointments" && (
          <div>
            {appointments.map(a => (
              <div key={a.id} className="card admin-appt-row" style={{ padding:"16px 20px", marginBottom:10, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>{a.patientName} → {a.doctorName}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:3 }}>{a.service} · {a.date} · {a.time} · {a.type==="home"?"🏠 Home":"🏥 Clinic"}</div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, color:"var(--teal)" }}>₹{a.amount}</span>
                  <select value={a.status} onChange={e => onUpdateAppt(a.id, {status:e.target.value})}
                    className="input" style={{ width:140, padding:"6px 10px", fontSize:12 }}>
                    {["pending","confirmed","completed","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DOCTORS ── */}
        {tab==="doctors" && (
          <div>
            {doctors.map(d => (
              <div key={d.id} className="card" style={{ padding:"18px 22px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                  <img src={d.img} alt={d.name} style={{ width:48, height:48, borderRadius:12, objectFit:"cover" }} />
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:"var(--navy)" }}>{d.name}</div>
                    <div style={{ fontSize:13, color:"var(--muted)" }}>{d.spec} · {d.exp}</div>
                    <div style={{ fontSize:12, color:"var(--teal)", fontWeight:600, marginTop:2 }}>Clinic: ₹{d.clinicCharge} · Home: {d.homeVisitEnabled?`₹${d.homeVisitCharge}`:"Disabled"}</div>
                  </div>
                </div>
                <button className="btn btn-ghost" onClick={() => setEditDoc({...d})} style={{ fontSize:13, padding:"8px 16px" }}>✏️ Edit</button>
              </div>
            ))}
          </div>
        )}

        {/* ── DOCTOR REQUESTS ── */}
        {tab==="requests" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"var(--navy)" }}>📋 Doctor Applications</h2>
              {pendingApps > 0 && (
                <span style={{ background:"#EF4444", color:"#fff", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:50 }}>
                  {pendingApps} pending
                </span>
              )}
            </div>
            {apps.length === 0 ? (
              <div className="card" style={{ padding:"48px", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                <p style={{ color:"var(--muted)", fontSize:15 }}>No doctor applications yet.</p>
              </div>
            ) : (
              apps.map(app => (
                <div key={app.id} className="card" style={{ padding:"22px 26px", marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:"var(--teal-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👨‍⚕️</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:16, color:"var(--navy)" }}>{app.name}</div>
                          <div style={{ fontSize:13, color:"var(--teal)", fontWeight:600 }}>{app.qualification}</div>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:8, marginBottom:10 }}>
                        {[["✉️","Email",app.email],["📍","Location",app.location],["⏱️","Experience",app.experience],["📱","Phone",app.phone]].map(([ic,lbl,val]) => (
                          <div key={lbl} style={{ background:"var(--bg)", borderRadius:8, padding:"7px 10px" }}>
                            <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>{ic} {lbl}</div>
                            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginTop:2 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      {app.message && (
                        <div style={{ background:"#f8fafc", borderRadius:8, padding:"10px 12px", fontSize:13, color:"var(--muted)", fontStyle:"italic", marginBottom:10 }}>
                          "{app.message}"
                        </div>
                      )}
                      <div style={{ fontSize:12, color:"var(--muted)" }}>Applied: {app.appliedAt}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:140 }}>
                      {app.status === "pending" ? (
                        <>
                          <button className="btn btn-success" style={{ justifyContent:"center", padding:"10px 20px", fontSize:13 }} onClick={() => approveApp(app)}>
                            ✅ Approve
                          </button>
                          <button className="btn btn-danger" style={{ justifyContent:"center", padding:"10px 20px", fontSize:13 }} onClick={() => rejectApp(app)}>
                            ❌ Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ padding:"8px 14px", borderRadius:10, fontSize:13, fontWeight:700, textAlign:"center",
                          background: app.status==="approved" ? "#F0FDF4" : "#FEF2F2",
                          color: app.status==="approved" ? "#16A34A" : "#DC2626" }}>
                          {app.status==="approved" ? "✅ Approved" : "❌ Rejected"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PATIENTS ── */}
        {tab==="patients" && (
          <div>
            {Object.entries(REGISTERED_USERS).filter(([,u])=>u.role==="patient").map(([email, u]) => {
              const spent = appointments.filter(a=>a.patientEmail===email && a.status==="completed").reduce((s,a)=>s+a.amount,0);
              const count = appointments.filter(a=>a.patientEmail===email).length;
              return (
                <div key={email} className="card" style={{ padding:"16px 20px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <Avatar src={u.avatar} name={u.name} size={42} />
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>{u.name}</div>
                      <div style={{ fontSize:12, color:"var(--muted)" }}>{email}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:20 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:700, fontSize:16, color:"var(--teal)" }}>{count}</div>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>Bookings</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:700, fontSize:16, color:"#16A34A" }}>₹{spent}</div>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>Spent</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab==="revenue" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:18, marginBottom:32 }}>
              <StatCard icon="💰" label="Total Revenue" value={`₹${revenue.toLocaleString()}`} color="#16A34A" />
              <StatCard icon="📅" label="Completed Sessions" value={appointments.filter(a=>a.status==="completed").length} color="var(--teal)" />
              <StatCard icon="🏠" label="Home Visits" value={appointments.filter(a=>a.type==="home").length} color="#7C3AED" />
              <StatCard icon="🏥" label="Clinic Visits" value={appointments.filter(a=>a.type==="clinic").length} color="var(--gold)" />
            </div>
            <h3 style={{ fontWeight:700, fontSize:17, color:"var(--navy)", marginBottom:14 }}>Revenue by Doctor</h3>
            {doctors.map(d => {
              const dRev = appointments.filter(a=>a.doctorId===d.id && a.status==="completed").reduce((s,a)=>s+a.amount,0);
              const dCount = appointments.filter(a=>a.doctorId===d.id).length;
              return (
                <div key={d.id} className="card" style={{ padding:"16px 20px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <img src={d.img} alt={d.name} style={{ width:40, height:40, borderRadius:10, objectFit:"cover" }} />
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"var(--navy)" }}>{d.name}</div>
                      <div style={{ fontSize:12, color:"var(--muted)" }}>{d.spec}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:20 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:700, fontSize:16, color:"var(--teal)" }}>{dCount}</div>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>Bookings</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:700, fontSize:16, color:"#16A34A" }}>₹{dRev.toLocaleString()}</div>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>Revenue</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── EDIT DOCTOR MODAL ── */}
      {editDoc && (
        <Modal title={`Edit — ${editDoc.name}`} onClose={() => setEditDoc(null)} w="460px">
          {[["spec","Specialisation"],["exp","Experience"]].map(([k,l]) => (
            <div key={k} style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:5 }}>{l}</label>
              <input className="input" value={editDoc[k]||""} onChange={e => setEditDoc(d=>({...d,[k]:e.target.value}))} />
            </div>
          ))}
          {[["clinicCharge","Clinic Charge (₹)"],["homeVisitCharge","Home Visit Charge (₹)"]].map(([k,l]) => (
            <div key={k} style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--muted)", display:"block", marginBottom:5 }}>{l}</label>
              <input className="input" type="number" value={editDoc[k]||0} onChange={e => setEditDoc(d=>({...d,[k]:+e.target.value}))} />
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <input type="checkbox" id="hve" checked={!!editDoc.homeVisitEnabled} onChange={e => setEditDoc(d=>({...d,homeVisitEnabled:e.target.checked}))} style={{ width:18,height:18 }} />
            <label htmlFor="hve" style={{ fontSize:14, fontWeight:600, cursor:"pointer" }}>Home Visit Enabled</label>
          </div>
          <StatCard icon="💰" label="Clinic" value={`₹${editDoc.clinicCharge||0}`} size={24} />
          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:14, fontSize:15, marginTop:14 }}
            onClick={() => { onUpdateDoctor(editDoc.id, editDoc); setEditDoc(null); }}>
            💾 Save Changes
          </button>
        </Modal>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      <MobileBottomNav items={[
        { id:"overview",     icon:"📊", label:"Dashboard", short:"Home" },
        { id:"appointments", icon:"📅", label:"Bookings",  short:"Book" },
        { id:"requests",     icon:"📋", label:"Requests",  short:"Req" },
        { id:"patients",     icon:"👥", label:"Patients",  short:"Pts" },
        { id:"revenue",      icon:"💰", label:"Revenue",   short:"Rev" },
      ]} active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  const [user, setUser]           = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage]           = useState("landing"); // "landing" | "how-it-works"
  const [doctors, setDoctors]         = useState(DOCTORS_DATA);
  const [appointments, setAppointments] = useState(APPOINTMENTS_DATA);

  const login         = (u)          => { setUser(u); setShowLogin(false); setPage("landing"); };
  const logout        = ()           => { setUser(null); setPage("landing"); };
  const book          = (appt)       => setAppointments(prev => [appt, ...prev]);
  const updateDoctor  = (id, changes)=> setDoctors(prev => prev.map(d => d.id===id ? {...d,...changes} : d));
  const updateAppt    = (id, changes)=> setAppointments(prev => prev.map(a => a.id===id ? {...a,...changes} : a));

  const showBooking = () => setShowLogin(true);

  if (user?.role === "patient") return <PatientDash user={user} appointments={appointments} doctors={doctors} onBook={book} onLogout={logout} />;
  if (user?.role === "doctor")  return <DoctorDash  user={user} appointments={appointments} doctors={doctors} onUpdateDoctor={updateDoctor} onUpdateAppt={updateAppt} onLogout={logout} />;
  if (user?.role === "admin")   return <AdminDash   appointments={appointments} doctors={doctors} onUpdateDoctor={updateDoctor} onUpdateAppt={updateAppt} onLogout={logout} />;

  if (page === "how-it-works") return (
    <>
      <HowItWorksPage onBack={() => setPage("landing")} onBook={() => { setPage("landing"); setShowLogin(true); }} />
    </>
  );

  return (
    <>
      <Landing
        onShowLogin={() => setShowLogin(true)}
        onHowItWorks={() => setPage("how-it-works")}
        doctors={doctors}
      />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={login} />}
    </>
  );
}
