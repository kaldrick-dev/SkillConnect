import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { internshipsApi } from "../api/client";
import OpportunityCard from "../components/OpportunityCard";
import { useAuth } from "../context/AuthContext";

const fallback = [
  { id: 101, title: "Product Research Intern", employer_id: 1, company_name: "Alinea Labs", location: "Remote", description: "Turn customer interviews and market signals into a practical opportunity map for a growing digital product.", is_active: true, duration: "6 weeks", skills: ["Research", "Strategy", "Writing"] },
  { id: 102, title: "Data & Insights Associate", employer_id: 2, company_name: "Kora Health", location: "Kigali · Hybrid", description: "Clean operational data, build a simple reporting view, and surface decisions the team can act on.", is_active: true, duration: "8 weeks", skills: ["Excel", "Data analysis", "Reporting"] },
  { id: 103, title: "Junior Brand Designer", employer_id: 3, company_name: "Good Ground", location: "Remote", description: "Develop a small campaign system and translate a creative direction into polished digital assets.", is_active: true, duration: "5 weeks", skills: ["Figma", "Brand design", "Content"] },
];

export default function Explore() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState(() => new Set(JSON.parse(localStorage.getItem("skillconnect_applied") || "[]")));
  const [message, setMessage] = useState("");

  useEffect(() => {
    internshipsApi.list({ is_active: true })
      .then((data) => setItems(data.length ? data : fallback))
      .catch(() => setItems(fallback))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.company_name || ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (item.location || "Remote").toLowerCase().includes(location.toLowerCase());
  }), [items, query, location]);

  const apply = async (item) => {
    if (item.id >= 100) {
      setMessage("This preview opportunity is not accepting applications yet.");
      return;
    }
    setApplying(item.id);
    setMessage("");
    try {
      await internshipsApi.apply(item.id);
      const next = new Set(applied).add(item.id);
      setApplied(next);
      localStorage.setItem("skillconnect_applied", JSON.stringify([...next]));
      setMessage(`Application sent for ${item.title}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="explore-page">
      <section className="explore-intro">
        <span className="eyebrow">Curated, practical, remote-friendly</span>
        <h2>Find work worth showing.</h2>
        <p>Every opportunity is built around a real deliverable, clear expectations, and feedback you can use.</p>
      </section>
      <section className="search-bar">
        <label><FiSearch /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search roles, skills, or companies" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><FiX /></button>}</label>
        <label><FiMapPin /><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location or remote" /></label>
      </section>
      <div className="results-row"><p><strong>{filtered.length}</strong> opportunities</p><select aria-label="Sort opportunities"><option>Most relevant</option><option>Newest first</option></select></div>
      {message && <div className="toast-message" role="status">{message}<button onClick={() => setMessage("")}><FiX /></button></div>}
      {loading ? <div className="card-skeletons"><i /><i /><i /></div> : filtered.length ? (
        <div className="opportunity-grid explore-grid">{filtered.map((item) => <OpportunityCard key={item.id} internship={item} onApply={user.role === "student" ? apply : undefined} applying={applying === item.id} applied={applied.has(item.id)} />)}</div>
      ) : (
        <div className="no-results"><FiBriefcase /><h3>No exact matches</h3><p>Try a broader role, skill, or location.</p><button className="secondary-button" onClick={() => { setQuery(""); setLocation(""); }}>Clear search</button></div>
      )}
    </div>
  );
}
