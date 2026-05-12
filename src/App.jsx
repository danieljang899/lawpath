import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const COLORS = {
  teal: "#0d9488",
  tealLight: "#14b8a6",
  tealDark: "#0f766e",
  tealBg: "#f0fdfa",
  tealMid: "#ccfbf1",
  white: "#ffffff",
  offWhite: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  light: "#94a3b8",
};

const NAV_ITEMS = ["Statement Review", "School Research", "Application Tracker", "AI Assistant"];

const SCHOOLS = [
  { name: "Yale Law School", location: "New Haven, CT", medianLSAT: 174, medianGPA: 3.93, acceptRate: "6%", strengths: "Constitutional law, human rights, small class sizes", vibe: "Elite, public interest focused, collaborative" },
  { name: "Harvard Law School", location: "Cambridge, MA", medianLSAT: 174, medianGPA: 3.92, acceptRate: "7%", strengths: "Corporate law, international law, unmatched network", vibe: "Prestigious, competitive, vast opportunities" },
  { name: "Columbia Law School", location: "New York, NY", medianLSAT: 174, medianGPA: 3.92, acceptRate: "12%", strengths: "Corporate, finance law, NYC connections", vibe: "Urban, career-driven, finance-oriented" },
  { name: "Stanford Law School", location: "Palo Alto, CA", medianLSAT: 174, medianGPA: 3.9, acceptRate: "8%", strengths: "Tech law, entrepreneurship, interdisciplinary", vibe: "Innovative, Silicon Valley adjacent, collaborative" },
  { name: "University of Chicago Law", location: "Chicago, IL", medianLSAT: 173, medianGPA: 3.9, acceptRate: "13%", strengths: "Law & economics, academia, judicial clerkships", vibe: "Intellectual, rigorous, debate-driven" },
  { name: "NYU School of Law", location: "New York, NY", medianLSAT: 173, medianGPA: 3.86, acceptRate: "16%", strengths: "International law, public interest, tax law", vibe: "Diverse, progressive, NYC-connected" },
  { name: "University of Texas School of Law", location: "Austin, TX", medianLSAT: 170, medianGPA: 3.76, acceptRate: "18%", strengths: "Energy law, Texas market dominance, strong alumni", vibe: "Texas-focused, practical, strong regional network" },
  { name: "Georgetown Law", location: "Washington, DC", medianLSAT: 171, medianGPA: 3.85, acceptRate: "17%", strengths: "Government, policy, DC connections", vibe: "Policy-oriented, politically connected, large cohort" },
];

async function callClaude(systemPrompt, userMessage) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await response.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

// ─── Statement Review ───────────────────────────────────────────────
function StatementReview() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  async function analyze() {
    if (words < 50) { setError("Please paste at least 50 words."); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const sys = `You are an elite law school admissions consultant. Review personal statements and return ONLY raw JSON (no markdown, no backticks):
{"overallScore":<1-100>,"verdict":"<one sentence>","strengths":["...","...","..."],"weaknesses":["...","...","..."],"sections":[{"title":"Narrative & Story","score":<1-10>,"feedback":"..."},{"title":"Why Law","score":<1-10>,"feedback":"..."},{"title":"Voice & Authenticity","score":<1-10>,"feedback":"..."},{"title":"Structure & Clarity","score":<1-10>,"feedback":"..."}],"topPriority":"..."}`;
      const raw = await callClaude(sys, `Review this personal statement:\n\n${essay}`);
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  const scoreColor = s => s >= 80 ? COLORS.teal : s >= 60 ? "#f59e0b" : "#ef4444";
  const secColor = s => s >= 8 ? COLORS.teal : s >= 6 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <h2 style={styles.sectionTitle}>Personal Statement Review</h2>
      <p style={styles.sectionSub}>Paste your draft and get expert-level feedback instantly.</p>
      <div style={styles.card}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={styles.label}>Your Statement</span>
          <span style={{ fontSize:12, color: words > 800 ? "#ef4444" : COLORS.light, fontFamily:"DM Sans" }}>{words} words</span>
        </div>
        <textarea value={essay} onChange={e => setEssay(e.target.value)}
          placeholder="Paste your personal statement here..."
          style={{ width:"100%", minHeight:200, border:"none", outline:"none", resize:"vertical",
            fontSize:15, lineHeight:1.75, color:COLORS.text, fontFamily:"DM Sans", background:"transparent", boxSizing:"border-box" }} />
      </div>
      {error && <p style={{ color:"#ef4444", fontSize:13, margin:"8px 0" }}>{error}</p>}
      <button onClick={analyze} disabled={loading} style={{ ...styles.btn, width:"100%", marginTop:4 }}>
        {loading ? "Analyzing..." : "Review My Statement →"}
      </button>

      {loading && <div style={{ textAlign:"center", padding:"40px 0" }}>
        <div style={styles.spinner} /><p style={{ color:COLORS.muted, fontFamily:"DM Sans", fontSize:14 }}>Reading between the lines...</p>
      </div>}

      {result && (
        <div style={{ marginTop:32, animation:"fadeUp 0.4s ease" }}>
          <div style={{ ...styles.card, display:"flex", gap:24, alignItems:"center", borderLeft:`4px solid ${scoreColor(result.overallScore)}` }}>
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <div style={{ fontSize:52, fontWeight:700, color:scoreColor(result.overallScore), fontFamily:"Libre Baskerville", lineHeight:1 }}>{result.overallScore}</div>
              <div style={{ fontSize:11, color:COLORS.light, fontFamily:"DM Sans" }}>/ 100</div>
            </div>
            <div>
              <div style={styles.label}>Overall Assessment</div>
              <p style={{ margin:"6px 0 0", fontSize:15, color:COLORS.text, fontFamily:"DM Sans", lineHeight:1.6 }}>{result.verdict}</p>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, margin:"16px 0" }}>
            {result.sections.map((s,i) => (
              <div key={i} style={styles.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontFamily:"Libre Baskerville", fontSize:14, fontWeight:700, color:COLORS.text }}>{s.title}</span>
                  <span style={{ fontSize:18, fontWeight:700, color:secColor(s.score), fontFamily:"Libre Baskerville" }}>{s.score}<span style={{ fontSize:12, color:COLORS.light }}>/10</span></span>
                </div>
                <p style={{ margin:0, fontSize:13, color:COLORS.muted, fontFamily:"DM Sans", lineHeight:1.65 }}>{s.feedback}</p>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {[["Strengths","#059669",result.strengths,"✓"],["Weaknesses","#ef4444",result.weaknesses,"✗"]].map(([label,color,items,icon]) => (
              <div key={label} style={styles.card}>
                <div style={{ fontSize:11, color, textTransform:"uppercase", letterSpacing:1, fontFamily:"DM Sans", marginBottom:10 }}>{label}</div>
                {items.map((item,i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:COLORS.muted, fontFamily:"DM Sans", lineHeight:1.5 }}>
                    <span style={{ color, flexShrink:0 }}>{icon}</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ ...styles.card, background:COLORS.tealBg, borderColor:COLORS.tealMid }}>
            <div style={{ fontSize:11, color:COLORS.teal, textTransform:"uppercase", letterSpacing:1, fontFamily:"DM Sans", marginBottom:8 }}>#1 Priority</div>
            <p style={{ margin:0, fontSize:15, color:COLORS.text, fontFamily:"DM Sans", lineHeight:1.7 }}>{result.topPriority}</p>
          </div>

          <button onClick={() => { setResult(null); setEssay(""); }}
            style={{ ...styles.btnOutline, width:"100%", marginTop:16 }}>Start Over</button>
        </div>
      )}
    </div>
  );
}

// ─── School Research ─────────────────────────────────────────────────
function SchoolResearch({ profile }) {
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze(school) {
    setSelected(school); setAnalysis(null); setLoading(true);
    const profileContext = profile.lsat || profile.gpa
      ? `The applicant has LSAT: ${profile.lsat || "unknown"}, GPA: ${profile.gpa || "unknown"}, Background: ${profile.background || "not specified"}.`
      : "No profile provided — give general advice.";
    try {
      const sys = `You are a law school admissions expert. Return ONLY raw JSON:
{"fitScore":<1-100>,"fitVerdict":"<one sentence on fit>","admissionChance":"<Reach/Match/Safety>","reasoning":"<2-3 sentences>","tips":["<tip1>","<tip2>","<tip3>"]}`;
      const raw = await callClaude(sys, `Evaluate fit for ${school.name}. ${profileContext}`);
      setAnalysis(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setAnalysis({ fitScore:50, fitVerdict:"Could not analyze. Try again.", admissionChance:"Unknown", reasoning:"", tips:[] }); }
    finally { setLoading(false); }
  }

  const chanceColor = c => c === "Safety" ? COLORS.teal : c === "Match" ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <h2 style={styles.sectionTitle}>School Research</h2>
      <p style={styles.sectionSub}>
        {profile.lsat ? `Using your profile (LSAT ${profile.lsat}, GPA ${profile.gpa}) for personalized fit analysis.` : "Add your profile in the AI Assistant tab for personalized fit analysis."}
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {SCHOOLS.map((school,i) => (
          <div key={i} onClick={() => analyze(school)}
            style={{ ...styles.card, cursor:"pointer", borderColor: selected?.name === school.name ? COLORS.teal : COLORS.border,
              background: selected?.name === school.name ? COLORS.tealBg : COLORS.white,
              transition:"all 0.2s" }}>
            <div style={{ fontFamily:"Libre Baskerville", fontWeight:700, fontSize:15, color:COLORS.text, marginBottom:4 }}>{school.name}</div>
            <div style={{ fontSize:12, color:COLORS.muted, fontFamily:"DM Sans", marginBottom:12 }}>{school.location}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
              {[["LSAT",school.medianLSAT],["GPA",school.medianGPA],["Accept",school.acceptRate]].map(([k,v]) => (
                <div key={k} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:700, color:COLORS.teal, fontFamily:"Libre Baskerville" }}>{v}</div>
                  <div style={{ fontSize:10, color:COLORS.light, fontFamily:"DM Sans", textTransform:"uppercase", letterSpacing:0.5 }}>{k}</div>
                </div>
              ))}
            </div>
            <p style={{ margin:0, fontSize:12, color:COLORS.muted, fontFamily:"DM Sans", lineHeight:1.5 }}>{school.vibe}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop:24, ...styles.card, borderLeft:`4px solid ${COLORS.teal}` }}>
          <h3 style={{ fontFamily:"Libre Baskerville", fontSize:18, margin:"0 0 16px", color:COLORS.text }}>{selected.name} — Fit Analysis</h3>
          {loading ? <div style={{ textAlign:"center", padding:"24px 0" }}><div style={styles.spinner} /></div> : analysis && (
            <>
              <div style={{ display:"flex", gap:20, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:40, fontWeight:700, color:COLORS.teal, fontFamily:"Libre Baskerville" }}>{analysis.fitScore}</div>
                  <div style={{ fontSize:11, color:COLORS.light, fontFamily:"DM Sans" }}>Fit Score</div>
                </div>
                <div style={{ flex:1 }}>
                  <span style={{ display:"inline-block", padding:"4px 12px", borderRadius:20, background: chanceColor(analysis.admissionChance)+"22",
                    color: chanceColor(analysis.admissionChance), fontSize:13, fontFamily:"DM Sans", fontWeight:600, marginBottom:8 }}>
                    {analysis.admissionChance}
                  </span>
                  <p style={{ margin:0, fontSize:14, color:COLORS.text, fontFamily:"DM Sans", lineHeight:1.6 }}>{analysis.fitVerdict}</p>
                </div>
              </div>
              <p style={{ fontSize:14, color:COLORS.muted, fontFamily:"DM Sans", lineHeight:1.65, marginBottom:16 }}>{analysis.reasoning}</p>
              {analysis.tips.length > 0 && (
                <div style={{ background:COLORS.tealBg, borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:11, color:COLORS.teal, textTransform:"uppercase", letterSpacing:1, fontFamily:"DM Sans", marginBottom:10 }}>Tips for This School</div>
                  {analysis.tips.map((t,i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:COLORS.text, fontFamily:"DM Sans", lineHeight:1.5 }}>
                      <span style={{ color:COLORS.teal, flexShrink:0 }}>→</span>{t}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Application Tracker ─────────────────────────────────────────────
function AppTracker() {
  const [apps, setApps] = useState([
    { id:1, school:"Yale Law School", deadline:"2024-02-15", status:"In Progress", notes:"Working on personal statement" },
    { id:2, school:"UT Law", deadline:"2024-03-01", status:"Not Started", notes:"" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newApp, setNewApp] = useState({ school:"", deadline:"", status:"Not Started", notes:"" });

  const statusColors = { "Not Started":"#94a3b8", "In Progress":"#f59e0b", "Submitted":COLORS.teal, "Accepted":"#059669", "Rejected":"#ef4444", "Waitlisted":"#8b5cf6" };
  const statuses = Object.keys(statusColors);

  function addApp() {
    if (!newApp.school) return;
    setApps(prev => [...prev, { ...newApp, id: Date.now() }]);
    setNewApp({ school:"", deadline:"", status:"Not Started", notes:"" });
    setAdding(false);
  }

  function updateStatus(id, status) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function remove(id) { setApps(prev => prev.filter(a => a.id !== id)); }

  const counts = statuses.reduce((acc,s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {});

  return (
    <div>
      <h2 style={styles.sectionTitle}>Application Tracker</h2>
      <p style={styles.sectionSub}>Track every school, deadline, and status in one place.</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12, marginBottom:24 }}>
        {[["Total",apps.length,COLORS.teal],["In Progress",counts["In Progress"]||0,"#f59e0b"],["Submitted",counts["Submitted"]||0,COLORS.teal],["Accepted",counts["Accepted"]||0,"#059669"]].map(([label,count,color]) => (
          <div key={label} style={{ ...styles.card, textAlign:"center", padding:"16px 12px" }}>
            <div style={{ fontSize:28, fontWeight:700, color, fontFamily:"Libre Baskerville" }}>{count}</div>
            <div style={{ fontSize:11, color:COLORS.muted, fontFamily:"DM Sans", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {apps.map(app => (
          <div key={app.id} style={{ ...styles.card, display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontFamily:"Libre Baskerville", fontWeight:700, fontSize:15, color:COLORS.text, marginBottom:4 }}>{app.school}</div>
              {app.deadline && <div style={{ fontSize:12, color:COLORS.muted, fontFamily:"DM Sans", marginBottom:6 }}>Deadline: {app.deadline}</div>}
              {app.notes && <div style={{ fontSize:13, color:COLORS.muted, fontFamily:"DM Sans", fontStyle:"italic" }}>{app.notes}</div>}
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                style={{ padding:"6px 10px", borderRadius:8, border:`1px solid ${statusColors[app.status]}`,
                  color:statusColors[app.status], fontFamily:"DM Sans", fontSize:13, background:statusColors[app.status]+"11",
                  cursor:"pointer", outline:"none" }}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => remove(app.id)}
                style={{ background:"none", border:"none", color:COLORS.light, cursor:"pointer", fontSize:18, padding:"0 4px" }}>×</button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <div style={{ ...styles.card, marginTop:16 }}>
          <div style={styles.label}>Add Application</div>
          <input placeholder="School name" value={newApp.school} onChange={e => setNewApp(p => ({...p,school:e.target.value}))}
            style={styles.input} />
          <input type="date" value={newApp.deadline} onChange={e => setNewApp(p => ({...p,deadline:e.target.value}))}
            style={styles.input} />
          <input placeholder="Notes (optional)" value={newApp.notes} onChange={e => setNewApp(p => ({...p,notes:e.target.value}))}
            style={styles.input} />
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button onClick={addApp} style={styles.btn}>Add School</button>
            <button onClick={() => setAdding(false)} style={styles.btnOutline}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ ...styles.btnOutline, width:"100%", marginTop:16 }}>+ Add School</button>
      )}
    </div>
  );
}

// ─── AI Assistant ────────────────────────────────────────────────────
function AIAssistant({ profile, setProfile }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hi! I'm your LawPath advisor. I can help with personal statements, school selection, resume tips, and anything else about the law school application process. What's on your mind?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role:"user", content:userMsg }]);
    setLoading(true);
    try {
      const profileCtx = profile.lsat
        ? `The user's profile: LSAT ${profile.lsat}, GPA ${profile.gpa}, Background: ${profile.background || "not specified"}, Target schools: ${profile.targetSchools || "not specified"}.`
        : "";
      const history = [...messages, { role:"user", content:userMsg }];
      const sys = `You are LawPath, an expert law school admissions advisor. You help with personal statements, school selection, resumes, timelines, and general law school application strategy. Be direct, specific, and encouraging. ${profileCtx}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000, system:sys,
          messages: history.map(m => ({ role:m.role, content:m.content }))
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text||"").join("") || "Sorry, something went wrong.";
      setMessages(prev => [...prev, { role:"assistant", content:text }]);
    } catch { setMessages(prev => [...prev, { role:"assistant", content:"Sorry, I ran into an error. Please try again." }]); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div>
          <h2 style={{ ...styles.sectionTitle, marginBottom:4 }}>AI Assistant</h2>
          <p style={styles.sectionSub}>Your personal law school admissions advisor.</p>
        </div>
        <button onClick={() => setShowProfile(p => !p)} style={styles.btnOutline}>
          {showProfile ? "Hide Profile" : "My Profile"}
        </button>
      </div>

      {showProfile && (
        <div style={{ ...styles.card, marginBottom:16, background:COLORS.tealBg, borderColor:COLORS.tealMid }}>
          <div style={styles.label}>Your Profile <span style={{ color:COLORS.muted, fontSize:11, fontWeight:400 }}>(used for personalized advice across all features)</span></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10 }}>
            {[["LSAT Score","lsat","173"],["GPA","gpa","3.85"],["Target Schools","targetSchools","Yale, Harvard, UT Law"],["Background","background","Economics student, pre-law"]].map(([label,key,ph]) => (
              <div key={key}>
                <div style={{ fontSize:11, color:COLORS.muted, fontFamily:"DM Sans", marginBottom:4 }}>{label}</div>
                <input placeholder={ph} value={profile[key]||""} onChange={e => setProfile(p => ({...p,[key]:e.target.value}))}
                  style={{ ...styles.input, marginBottom:0 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background:COLORS.offWhite, borderRadius:14, border:`1px solid ${COLORS.border}`, height:380, overflowY:"auto", padding:16, marginBottom:12 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start", marginBottom:12 }}>
            <div style={{
              maxWidth:"80%", padding:"10px 14px", borderRadius: m.role==="user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role==="user" ? COLORS.teal : COLORS.white,
              color: m.role==="user" ? COLORS.white : COLORS.text,
              fontSize:14, fontFamily:"DM Sans", lineHeight:1.6,
              border: m.role==="assistant" ? `1px solid ${COLORS.border}` : "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:12 }}>
            <div style={{ background:COLORS.white, border:`1px solid ${COLORS.border}`, borderRadius:"14px 14px 14px 4px", padding:"10px 16px" }}>
              <div style={{ display:"flex", gap:4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:COLORS.teal, animation:`bounce 1s ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Ask anything about law school applications..."
          style={{ ...styles.input, flex:1, marginBottom:0 }} />
        <button onClick={send} disabled={loading} style={{ ...styles.btn, padding:"10px 20px", flexShrink:0 }}>Send</button>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────
export default function LawPath() {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({});

  return (
    <div style={{ minHeight:"100vh", background:COLORS.white, fontFamily:"DM Sans, sans-serif" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-6px); } }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#f1f5f9; } ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
        input::placeholder, textarea::placeholder { color:#94a3b8; }
      `}</style>

      {/* Header */}
      <div style={{ background:COLORS.white, borderBottom:`1px solid ${COLORS.border}`, padding:"0 24px", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 0" }}>
            <div style={{ width:34, height:34, background:`linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚖️</div>
            <span style={{ fontFamily:"Libre Baskerville", fontSize:20, fontWeight:700, color:COLORS.text, letterSpacing:"-0.5px" }}>LawPath</span>
          </div>
          <nav style={{ display:"flex", gap:4 }}>
            {NAV_ITEMS.map((item,i) => (
              <button key={i} onClick={() => setTab(i)} style={{
                padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"DM Sans", fontSize:13, fontWeight:500,
                background: tab===i ? COLORS.tealBg : "transparent",
                color: tab===i ? COLORS.teal : COLORS.muted,
                transition:"all 0.15s"
              }}>{item}</button>
            ))}
          </nav>
        </div>
      </div>

      {/* Teal hero bar */}
      <div style={{ background:`linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`, padding:"32px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <h1 style={{ fontFamily:"Libre Baskerville", fontSize:"clamp(24px,4vw,36px)", color:COLORS.white, margin:"0 0 8px", fontWeight:700, letterSpacing:"-0.5px" }}>
            Your law school journey,<br />guided by AI.
          </h1>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:15, margin:0, fontFamily:"DM Sans" }}>
            Personal statement review · School research · Application tracking · AI advising
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px 80px" }}>
        <div style={{ animation:"fadeUp 0.35s ease" }} key={tab}>
          {tab===0 && <StatementReview />}
          {tab===1 && <SchoolResearch profile={profile} />}
          {tab===2 && <AppTracker />}
          {tab===3 && <AIAssistant profile={profile} setProfile={setProfile} />}
        </div>
      </div>
    </div>
  );
}

// ─── Shared Styles ───────────────────────────────────────────────────
const styles = {
  sectionTitle: { fontFamily:"Libre Baskerville", fontSize:24, fontWeight:700, color:"#0f172a", margin:"0 0 6px", letterSpacing:"-0.5px" },
  sectionSub: { fontFamily:"DM Sans", fontSize:14, color:"#64748b", margin:"0 0 24px" },
  card: { background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, padding:20, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  label: { fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:1, fontFamily:"DM Sans", fontWeight:600 },
  btn: { background:`linear-gradient(135deg, #0d9488, #0f766e)`, color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans", transition:"all 0.2s" },
  btnOutline: { background:"transparent", color:"#0d9488", border:"1px solid #0d9488", borderRadius:10, padding:"10px 20px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"DM Sans" },
  input: { width:"100%", padding:"10px 12px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:14, fontFamily:"DM Sans", color:"#0f172a", outline:"none", background:"#f8fafc", marginBottom:10 },
  spinner: { width:32, height:32, border:"3px solid #e2e8f0", borderTop:`3px solid #0d9488`, borderRadius:"50%", margin:"0 auto 12px", animation:"spin 0.8s linear infinite" },
};

