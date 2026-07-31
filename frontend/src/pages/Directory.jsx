import { useEffect, useState } from "react";
import { FiBriefcase, FiChevronDown, FiChevronUp, FiExternalLink, FiGlobe, FiMail, FiSearch, FiUsers } from "react-icons/fi";
import { employersApi, mentorsApi } from "../api/client";
import PageLoader from "../components/PageLoader";

export default function Directory() {
  const [tab, setTab] = useState("mentors");

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <div>
          <span className="eyebrow">Community</span>
          <h2>Mentors and companies on SkillConnect.</h2>
          <p>See who is guiding project work and which teams are publishing opportunities.</p>
        </div>
      </section>
      <div className="project-tabs" role="tablist">
        <button className={tab === "mentors" ? "active" : ""} onClick={() => setTab("mentors")}>Mentors</button>
        <button className={tab === "companies" ? "active" : ""} onClick={() => setTab("companies")}>Companies</button>
      </div>
      {tab === "mentors" ? <MentorDirectory /> : <CompanyDirectory />}
    </div>
  );
}

function MentorDirectory() {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    mentorsApi.list()
      .then(setMentors)
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader label="Loading mentors…" />;
  if (message) return <div className="project-note">{message}</div>;

  const filtered = mentors.filter((mentor) => `${mentor.email} ${mentor.expertise}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="panel community-table-card">
      <header className="table-heading">
        <div><span className="eyebrow">Mentor directory</span><h2>Meet the mentors</h2><p>{filtered.length} people available across the community</p></div>
        <label className="table-search"><FiSearch /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search email or expertise" /></label>
      </header>
      <div className="community-table-wrap">
        <table className="community-table">
          <thead><tr><th>Mentor</th><th>Expertise</th><th>Contact</th></tr></thead>
          <tbody>{filtered.map((mentor) => (
            <tr key={mentor.id}>
              <td data-label="Mentor"><div className="table-user"><span className="avatar">{mentor.email?.slice(0, 2).toUpperCase() || <FiUsers />}</span><span><strong>{mentor.email?.split("@")[0] || "Mentor"}</strong><small>Mentor ID · {mentor.id}</small></span></div></td>
              <td data-label="Expertise"><span className="expertise-badge">{mentor.expertise || "General"}</span></td>
              <td data-label="Contact"><a className="community-contact" href={`mailto:${mentor.email}`}><FiMail />{mentor.email}</a></td>
            </tr>
          ))}{!filtered.length && <DirectoryEmpty colSpan="3" label="No mentors match that search." />}</tbody>
        </table>
      </div>
    </section>
  );
}

function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openId, setOpenId] = useState(null);
  const [opportunities, setOpportunities] = useState({});

  useEffect(() => {
    employersApi.list()
      .then(setCompanies)
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (company) => {
    if (openId === company.id) {
      setOpenId(null);
      return;
    }
    setOpenId(company.id);
    if (!opportunities[company.id]) {
      try {
        const data = await employersApi.internships(company.id);
        setOpportunities((current) => ({ ...current, [company.id]: data }));
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  if (loading) return <PageLoader label="Loading companies…" />;
  if (message) return <div className="project-note">{message}</div>;

  const filtered = companies.filter((company) => `${company.profile?.company_name || ""} ${company.email}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="panel community-table-card">
      <header className="table-heading">
        <div><span className="eyebrow">Company directory</span><h2>Partner companies</h2><p>{filtered.length} teams publishing practical work</p></div>
        <label className="table-search"><FiSearch /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies" /></label>
      </header>
      <div className="community-table-wrap">
        <table className="community-table company-table">
          <thead><tr><th>Company</th><th>Contact</th><th>Website</th><th>Opportunities</th></tr></thead>
          <tbody>{filtered.map((company) => {
            const profile = company.profile || {};
            const active = (opportunities[company.id] || []).filter((item) => item.is_active);
            const expanded = openId === company.id;
            return [
              <tr key={company.id}>
                <td data-label="Company"><div className="table-user"><span className="avatar">{(profile.company_name || "CO").slice(0, 2).toUpperCase()}</span><span><strong>{profile.company_name || "Company"}</strong><small>Partner ID · {company.id}</small></span></div></td>
                <td data-label="Contact"><a className="community-contact" href={`mailto:${profile.contact_email || company.email}`}><FiMail />{profile.contact_email || company.email}</a></td>
                <td data-label="Website">{profile.website ? <a className="community-contact" href={profile.website} target="_blank" rel="noreferrer"><FiGlobe />Visit website <FiExternalLink /></a> : <span className="table-placeholder">Not provided</span>}</td>
                <td data-label="Opportunities"><button className={`directory-toggle ${expanded ? "active" : ""}`} onClick={() => toggle(company)}><FiBriefcase />View projects {expanded ? <FiChevronUp /> : <FiChevronDown />}</button></td>
              </tr>,
              expanded && (
                <tr className="opportunity-detail-row" key={`${company.id}-opportunities`}>
                  <td colSpan="4">
                    <div><strong>Open opportunities</strong>{active.length ? <div className="directory-opportunities">{active.map((item) => <span key={item.id}><FiBriefcase />{item.title}<small>{item.location || "Remote"}</small></span>)}</div> : <p>No open opportunities from this company right now.</p>}</div>
                  </td>
                </tr>
              ),
            ];
          })}{!filtered.length && <DirectoryEmpty colSpan="4" label="No companies match that search." />}</tbody>
        </table>
      </div>
    </section>
  );
}

function DirectoryEmpty({ colSpan, label }) {
  return <tr className="directory-empty"><td colSpan={colSpan}><FiSearch /><strong>{label}</strong><span>Try a broader search.</span></td></tr>;
}
