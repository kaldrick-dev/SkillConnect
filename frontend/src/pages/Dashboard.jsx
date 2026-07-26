import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCheckCircle, FiClock, FiCompass, FiTrendingUp } from "react-icons/fi";
import { adminApi, certificatesApi, internshipsApi, submissionsApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import OpportunityCard from "../components/OpportunityCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [metrics, setMetrics] = useState({ applications: 0, tasks: 0, submissions: 0, certificates: 0 });
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

  useEffect(() => {
    if (user?.role !== "student") return;
    Promise.all([
      internshipsApi.myApplications(),
      submissionsApi.mine(),
      user?.profile?.id ? certificatesApi.forStudent(user.profile.id) : Promise.resolve([]),
    ]).then(([applications, submissions, certificates]) => {
      setMetrics({
        applications: applications.length,
        tasks: applications.reduce((total, application) => total + (application.tasks?.length || 0), 0),
        submissions: submissions.length,
        certificates: certificates.length,
      });
    }).catch(() => {});
  }, [user?.role, user?.profile?.id]);

  if (user?.role === "employer") return <EmployerDashboard user={user} opportunities={opportunities} setOpportunities={setOpportunities} />;
  if (user?.role === "mentor") return <MentorDashboard user={user} opportunities={opportunities} />;
  if (user?.role === "admin") return <AdminDashboard user={user} />;

  return (
    <div className="dashboard-stack">
      <section className="welcome-row">
        <div><span className="eyebrow">{new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span><h2>Good to see you, {name}.</h2><p>Here’s what’s happening with your SkillConnect journey.</p></div>
        <Link className="button small" to="/opportunities">Explore opportunities <FiArrowRight /></Link>
      </section>

      <section className="stat-grid">
        <article><span className="stat-icon blue"><FiBriefcase /></span><div><small>Assigned tasks</small><strong>{metrics.tasks}</strong><p><Link to="/work">View tasks · {metrics.applications} applications</Link></p></div></article>
        <article><span className="stat-icon green"><FiCheckCircle /></span><div><small>Submissions</small><strong>{metrics.submissions}</strong><p>Work shared for review</p></div></article>
        <article><span className="stat-icon amber"><FiAward /></span><div><small>Certificates</small><strong>{metrics.certificates}</strong><p>Earned through real work</p></div></article>
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

function MentorDashboard({ user, opportunities }) {
  return (
    <div className="dashboard-stack">
      <section className="welcome-row">
        <div><span className="eyebrow">Mentor workspace</span><h2>Welcome back, {user.email.split("@")[0]}.</h2><p>Help learners turn practical work into clear growth.</p></div>
        <Link className="button small" to="/work">Open review workspace <FiArrowRight /></Link>
      </section>
      <section className="stat-grid">
        <article><span className="stat-icon blue"><FiBriefcase /></span><div><small>Opportunities</small><strong>{opportunities.length}</strong><p>Available for review</p></div></article>
        <article><span className="stat-icon green"><FiCheckCircle /></span><div><small>Assessments</small><strong>—</strong><p>Record outcomes in Reviews</p></div></article>
        <article><span className="stat-icon amber"><FiAward /></span><div><small>Expertise</small><strong className="text-stat">{user.profile?.expertise || "General"}</strong><p>Your mentoring focus</p></div></article>
        <article><span className="stat-icon plum"><FiClock /></span><div><small>Review queue</small><strong>Open</strong><p>Applicant work is ready</p></div></article>
      </section>
      <section className="panel empty-workspace"><FiBookOpen /><h2>Give feedback learners can use</h2><p>Open the review workspace, choose an opportunity, and record a final score with specific feedback.</p><Link className="button small" to="/work">Start reviewing <FiArrowRight /></Link></section>
    </div>
  );
}

function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="dashboard-stack">
      <section className="welcome-row">
        <div><span className="eyebrow">Administrator overview</span><h2>Welcome, {user.email.split("@")[0]}.</h2><p>A live view of people, opportunities, and delivered work.</p></div>
        <Link className="button small" to="/admin">Manage platform <FiArrowRight /></Link>
      </section>
      <section className="stat-grid">
        <article><span className="stat-icon blue"><FiBriefcase /></span><div><small>Users</small><strong>{stats?.total_users ?? "—"}</strong><p>Registered accounts</p></div></article>
        <article><span className="stat-icon green"><FiCompass /></span><div><small>Students</small><strong>{stats?.total_students ?? "—"}</strong><p>Building experience</p></div></article>
        <article><span className="stat-icon amber"><FiBookOpen /></span><div><small>Internships</small><strong>{stats?.total_internships ?? "—"}</strong><p>Platform opportunities</p></div></article>
        <article><span className="stat-icon plum"><FiClock /></span><div><small>Submissions</small><strong>{stats?.total_submissions ?? "—"}</strong><p>Delivered work</p></div></article>
      </section>
      <section className="panel empty-workspace"><FiTrendingUp /><h2>Platform operations</h2><p>Review account access and monitor adoption from the administration workspace.</p><Link className="button small" to="/admin">Open administration <FiArrowRight /></Link></section>
    </div>
  );
}

function EmployerDashboard({ user, opportunities, setOpportunities }) {
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", location: "Remote" });
  const [metrics, setMetrics] = useState({ applications: 0, learners: 0, awaitingReview: 0 });

  useEffect(() => {
    if (!opportunities.length) {
      setMetrics({ applications: 0, learners: 0, awaitingReview: 0 });
      return;
    }
    Promise.all(opportunities.map(async (internship) => {
      const workspace = await internshipsApi.workspace(internship.id);
      return {
        applications: workspace.applications,
        submissions: workspace.tasks.flatMap((task) => task.submissions || []),
      };
    })).then((projects) => {
      const applications = projects.flatMap((project) => project.applications);
      const submissions = projects.flatMap((project) => project.submissions);
      setMetrics({
        applications: applications.length,
        learners: new Set(
          applications
            .filter((application) => ["accepted", "completed"].includes(application.status))
            .map((application) => application.student_id),
        ).size,
        awaitingReview: submissions.filter((submission) => submission.score == null).length,
      });
    }).catch(() => {});
  }, [opportunities]);

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
        <article><span className="stat-icon green"><FiCompass /></span><div><small>Applications</small><strong>{metrics.applications}</strong><p>Across your projects</p></div></article>
        <article><span className="stat-icon amber"><FiBookOpen /></span><div><small>Active learners</small><strong>{metrics.learners}</strong><p>Currently in projects</p></div></article>
        <article><span className="stat-icon plum"><FiClock /></span><div><small>Awaiting review</small><strong>{metrics.awaitingReview}</strong><p>Submissions to assess</p></div></article>
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
