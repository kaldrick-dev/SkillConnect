import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiGlobe, FiMail, FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { employersApi, internshipsApi } from "../api/client";
import OpportunityCard from "../components/OpportunityCard";
import PageLoader from "../components/PageLoader";
import { useAuth } from "../context/AuthContext";

export default function Explore() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("relevant");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState(new Set());
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(null);

  useEffect(() => {
    Promise.all([
      internshipsApi.list({ is_active: true }),
      user.role === "student" ? internshipsApi.myApplications() : Promise.resolve([]),
    ])
      .then(([data, applications]) => {
        setItems(data);
        setApplied(new Set(applications.map((application) => application.internship_id)));
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, [user.role]);

  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.company_name || ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (item.location || "Remote").toLowerCase().includes(location.toLowerCase());
  }).sort((a, b) => sort === "newest"
    ? new Date(b.created_at || 0) - new Date(a.created_at || 0)
    : 0), [items, query, location, sort]);

  const apply = async (item) => {
    setApplying(item.id);
    setMessage("");
    try {
      await internshipsApi.apply(item.id);
      const next = new Set(applied).add(item.id);
      setApplied(next);
      setMessage(`Application sent for ${item.title}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setApplying(null);
    }
  };

  const viewCompany = async (item) => {
    setCompany({ loading: true, employer: null, internships: [] });
    try {
      const [employer, internships] = await Promise.all([
        employersApi.get(item.employer_user_id),
        employersApi.internships(item.employer_user_id),
      ]);
      setCompany({ loading: false, employer, internships });
    } catch (error) {
      setCompany(null);
      setMessage(error.message);
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
      <div className="results-row"><p><strong>{filtered.length}</strong> opportunities</p><select aria-label="Sort opportunities" value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevant">Most relevant</option><option value="newest">Newest first</option></select></div>
      {message && <div className="toast-message" role="status">{message}<button onClick={() => setMessage("")}><FiX /></button></div>}
      {loading ? <div className="card-skeletons"><i /><i /><i /></div> : filtered.length ? (
        <div className="opportunity-grid explore-grid">{filtered.map((item) => <OpportunityCard key={item.id} internship={item} onApply={user.role === "student" ? apply : undefined} onCompanyClick={viewCompany} applying={applying === item.id} applied={applied.has(item.id)} />)}</div>
      ) : (
        <div className="no-results"><FiBriefcase /><h3>No exact matches</h3><p>Try a broader role, skill, or location.</p><button className="secondary-button" onClick={() => { setQuery(""); setLocation(""); }}>Clear search</button></div>
      )}
      {company && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setCompany(null)}>
          <div className="create-modal" onMouseDown={(event) => event.stopPropagation()}>
            {company.loading ? <PageLoader compact label="Loading company profile…" /> : (
              <>
                <span className="eyebrow">Company profile</span>
                <h2>{company.employer?.profile?.company_name || "Company"}</h2>
                <p><FiMail /> {company.employer?.profile?.contact_email || company.employer?.email}</p>
                {company.employer?.profile?.website && <p><FiGlobe /> {company.employer.profile.website}</p>}
                <div className="tag-row">
                  {company.internships.filter((item) => item.is_active).map((item) => <span key={item.id}>{item.title}</span>)}
                  {!company.internships.some((item) => item.is_active) && <span>No other open opportunities right now</span>}
                </div>
                <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setCompany(null)}>Close</button></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
