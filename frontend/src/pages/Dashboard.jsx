import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCheckCircle, FiClock, FiCompass, FiTrendingUp } from "react-icons/fi";
import { internshipsApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import OpportunityCard from "../components/OpportunityCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = user?.profile?.first_name || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    internshipsApi.list({ is_active: true })
      .then((data) => setOpportunities(
        user?.role === "employer"
          ? data.filter((item) => item.employer_id === user?.profile?.id)
          : data.slice(0, 3),
      ))
      .catch(() => setOpportunities([]))
      .finally(() => setLoading(false));
  }, [user?.role, user?.profile?.id]);

  if (user?.role === "employer") return <EmployerDashboard user={user} opportunities={opportunities} setOpportunities={setOpportunities} />;

  return (
    <div className="dashboard-stack">
      <section className="welcome-row">
        <div><span className="eyebrow">{new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span><h2>Good to see you, {name}.</h2><p>Here’s what’s happening with your SkillConnect journey.</p></div>
        <Link className="button small" to="/opportunities">Explore opportunities <FiArrowRight /></Link>
      </section>

      <section className="stat-grid">
        <article><span className="stat-icon blue"><FiBriefcase /></span><div><small>Active projects</small><strong>0</strong><p>Ready for your first one</p></div></article>
        <article><span className="stat-icon green"><FiCheckCircle /></span><div><small>Tasks completed</small><strong>0</strong><p>Keep your momentum</p></div></article>
        <article><span className="stat-icon amber"><FiAward /></span><div><small>Certificates</small><strong>0</strong><p>Earned through real work</p></div></article>
        <article><span className="stat-icon plum"><FiTrendingUp /></span><div><small>Profile strength</small><strong>{user?.profile?.bio ? "70%" : "35%"}</strong><p><Link to="/profile">Complete profile</Link></p></div></article>
      </section>

      <section className="dashboard-grid">
        <div className="panel getting-started">
          <div className="panel-heading"><div><span className="eyebrow">Your next move</span><h2>Start building your track record</h2></div><span className="completion-ring">1/3</span></div>
          <div className="checklist">
            <Link to="/profile" className="done"><span><FiCheckCircle /></span><div><strong>Create your account</strong><p>Your workspace is ready.</p></div></Link>
            <Link to="/profile"><span>02</span><div><strong>Complete your profile</strong><p>Add your skills, education, and a short introduction.</p></div><FiArrowRight /></Link>
            <Link to="/opportunities"><span>03</span><div><strong>Apply to your first project</strong><p>Choose work that matches where you want to grow.</p></div><FiArrowRight /></Link>
          </div>
        </div>
        <aside className="panel profile-card">
          <span className="eyebrow">Profile strength</span>
          <div className="profile-score"><strong>{user?.profile?.bio ? "70" : "35"}<small>%</small></strong><span><i style={{ "--score": user?.profile?.bio ? "70%" : "35%" }} /></span></div>
          <h3>A few details will make you stand out.</h3>
          <p>Profiles with skills and a short introduction are more likely to be shortlisted.</p>
          <Link className="secondary-button" to="/profile">Improve my profile <FiArrowRight /></Link>
        </aside>
      </section>

      <section className="recommended">
        <div className="section-row"><div><span className="eyebrow">Picked for a strong start</span><h2>Open opportunities</h2></div><Link to="/opportunities">View all <FiArrowRight /></Link></div>
        {loading ? <div className="card-skeletons"><i /><i /><i /></div> : opportunities.length ? (
          <div className="opportunity-grid">{opportunities.map((item) => <OpportunityCard key={item.id} internship={item} compact />)}</div>
        ) : <EmptyOpportunities />}
      </section>
    </div>
  );
}

function EmployerDashboard({ user, opportunities, setOpportunities }) {
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", location: "Remote" });

  const createOpportunity = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await internshipsApi.create(form);
      setOpportunities((current) => [data.internship, ...current]);
      setCreating(false);
      setForm({ title: "", description: "", location: "Remote" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-stack">
      <section className="welcome-row"><div><span className="eyebrow">Employer workspace</span><h2>Welcome, {user?.profile?.company_name || user.email.split("@")[0]}.</h2><p>Create structured opportunities and discover capable emerging talent.</p></div><button className="button small" onClick={() => setCreating(true)}>Create opportunity <FiArrowRight /></button></section>
      <section className="stat-grid">
        <article><span className="stat-icon blue"><FiBriefcase /></span><div><small>Live opportunities</small><strong>{opportunities.length}</strong><p>Visible to candidates</p></div></article>
        <article><span className="stat-icon green"><FiCompass /></span><div><small>Applications</small><strong>0</strong><p>Across your projects</p></div></article>
        <article><span className="stat-icon amber"><FiBookOpen /></span><div><small>Active learners</small><strong>0</strong><p>Currently in projects</p></div></article>
        <article><span className="stat-icon plum"><FiClock /></span><div><small>Awaiting review</small><strong>0</strong><p>Submissions to assess</p></div></article>
      </section>
      {opportunities.length ? (
        <section className="recommended"><div className="section-row"><div><span className="eyebrow">Your live work</span><h2>Published opportunities</h2></div></div><div className="opportunity-grid">{opportunities.map((item) => <OpportunityCard key={item.id} internship={item} compact />)}</div></section>
      ) : (
        <section className="panel empty-workspace"><FiBriefcase /><h2>Build your first opportunity</h2><p>Define a focused project with clear outcomes. SkillConnect will help early-career talent do meaningful work with your team.</p><button className="button small" onClick={() => setCreating(true)}>Create an opportunity <FiArrowRight /></button></section>
      )}
      {creating && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setCreating(false)}>
          <form className="create-modal" onSubmit={createOpportunity} onMouseDown={(event) => event.stopPropagation()}>
            <span className="eyebrow">New opportunity</span>
            <h2>Give candidates meaningful work.</h2>
            <p>Start with a clear title, outcome, and working location. You can add tasks after publishing.</p>
            {error && <div className="form-alert">{error}</div>}
            <label>Opportunity title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Customer research intern" /></label>
            <label>Project brief<textarea required rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the challenge and expected outcome." /></label>
            <label>Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Remote or city" /></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setCreating(false)}>Cancel</button><button className="button small" disabled={saving}>{saving ? "Publishing…" : "Publish opportunity"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function EmptyOpportunities() {
  return <div className="empty-inline"><FiCompass /><div><strong>New opportunities are on the way.</strong><p>Check back soon or complete your profile in the meantime.</p></div></div>;
}
