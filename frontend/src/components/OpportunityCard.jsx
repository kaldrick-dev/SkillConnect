import { FiArrowUpRight, FiBriefcase, FiCheck, FiClock, FiMapPin } from "react-icons/fi";

const palettes = ["blue", "amber", "green", "plum"];

export default function OpportunityCard({ internship, onApply, onCompanyClick, applying, applied, compact = false }) {
  const company = internship.company_name || `Partner company ${internship.employer_id || ""}`.trim();
  const initials = company.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const palette = palettes[(internship.id || 0) % palettes.length];
  const timeline = internship.start_date && internship.end_date
    ? `${new Date(internship.start_date).toLocaleDateString()} – ${new Date(internship.end_date).toLocaleDateString()}`
    : "Flexible schedule";
  const tags = internship.skills?.length
    ? internship.skills
    : [internship.code, "Project-based"].filter(Boolean);

  return (
    <article className={`opportunity-card ${compact ? "compact" : ""}`}>
      <div className="opportunity-top">
        <span className={`company-mark ${palette}`}>{initials || <FiBriefcase />}</span>
        <span className={`status-pill ${internship.is_active ? "open" : ""}`}>
          <i /> {internship.is_active ? "Open" : "Closed"}
        </span>
      </div>
      <div>
        {onCompanyClick && internship.employer_user_id ? (
          <button type="button" className="company-name link-button" onClick={() => onCompanyClick(internship)}>{company}</button>
        ) : (
          <p className="company-name">{company}</p>
        )}
        <h3>{internship.title}</h3>
      </div>
      {!compact && <p className="card-description">{internship.description || "Join a hands-on team project and build practical experience with mentor feedback."}</p>}
      <div className="meta-row">
        <span><FiMapPin />{internship.location || "Remote"}</span>
        <span><FiClock />{internship.duration || timeline}</span>
      </div>
      <div className="tag-row">
        {tags.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      {onApply && (
        <button className={`card-action ${applied ? "applied" : ""}`} onClick={() => onApply(internship)} disabled={applying || applied || !internship.is_active}>
          {applied ? <><FiCheck /> Applied</> : applying ? "Submitting…" : <>View & apply <FiArrowUpRight /></>}
        </button>
      )}
    </article>
  );
}
