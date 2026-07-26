import { useEffect, useState } from "react";
import { FiCheck, FiFileText, FiGlobe, FiPlus, FiSave, FiUser } from "react-icons/fi";
import { employersApi, profileApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.profile?.first_name || "",
    last_name: user?.profile?.last_name || "",
    bio: user?.profile?.bio || "",
    university: user?.profile?.university || "",
    graduation_year: user?.profile?.graduation_year || "",
    skills: user?.profile?.skills || "",
    resume_url: user?.profile?.resume_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.role !== "student") return;
    profileApi.get(user.id).then((data) => {
      const profile = data.profile || {};
      setForm((current) => ({ ...current, ...Object.fromEntries(Object.entries(profile).filter(([, value]) => value != null)) }));
      updateUser({ profile });
    }).catch(() => {});
  }, [user.id, user.role]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const data = await profileApi.update(user.id, { ...form, graduation_year: form.graduation_year ? Number(form.graduation_year) : null });
      updateUser({ email: data.user.email, profile: data.profile });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (user.role === "employer") return <EmployerProfile user={user} updateUser={updateUser} />;
  if (user.role !== "student") return <RoleProfile user={user} />;

  const skills = form.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
  const initials = `${form.first_name?.[0] || ""}${form.last_name?.[0] || ""}` || user.email.slice(0, 2);

  return (
    <form className="profile-layout" onSubmit={submit}>
      <aside className="profile-sidebar panel">
        <span className="large-avatar">{initials.toUpperCase()}</span>
        <h2>{[form.first_name, form.last_name].filter(Boolean).join(" ") || "Your name"}</h2>
        <p>{user.email}</p>
        <div className="profile-divider" />
        <span className="eyebrow">Profile checklist</span>
        <ul className="profile-checklist">
          <li className={form.first_name && form.last_name ? "complete" : ""}><span>{form.first_name && form.last_name ? <FiCheck /> : "1"}</span>Basic information</li>
          <li className={form.bio ? "complete" : ""}><span>{form.bio ? <FiCheck /> : "2"}</span>Short introduction</li>
          <li className={skills.length ? "complete" : ""}><span>{skills.length ? <FiCheck /> : "3"}</span>Skills & strengths</li>
          <li className={form.resume_url ? "complete" : ""}><span>{form.resume_url ? <FiCheck /> : "4"}</span>Portfolio or résumé</li>
        </ul>
      </aside>
      <div className="profile-sections">
        {error && <div className="form-alert">{error}</div>}
        <section className="panel profile-section">
          <div className="profile-section-head"><span className="section-icon"><FiUser /></span><div><h2>Basic information</h2><p>Help teams and mentors know who they’ll be working with.</p></div></div>
          <div className="field-row"><label>First name<input name="first_name" value={form.first_name} onChange={change} /></label><label>Last name<input name="last_name" value={form.last_name} onChange={change} /></label></div>
          <label>Short introduction<textarea name="bio" rows="4" maxLength="400" value={form.bio} onChange={change} placeholder="What are you curious about, and what kind of problems do you enjoy solving?" /><small className="char-count">{form.bio.length}/400</small></label>
          <div className="field-row"><label>University or school<input name="university" value={form.university} onChange={change} placeholder="e.g. African Leadership University" /></label><label>Graduation year<input name="graduation_year" type="number" min="2000" max="2040" value={form.graduation_year} onChange={change} placeholder="2027" /></label></div>
        </section>
        <section className="panel profile-section">
          <div className="profile-section-head"><span className="section-icon"><FiPlus /></span><div><h2>Skills & strengths</h2><p>Add a comma-separated mix of tools and ways of working.</p></div></div>
          <label>Skills<input name="skills" value={form.skills} onChange={change} placeholder="Research, Figma, data analysis, project planning" /></label>
          {!!skills.length && <div className="skill-preview">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>}
        </section>
        <section className="panel profile-section">
          <div className="profile-section-head"><span className="section-icon"><FiFileText /></span><div><h2>Work sample or résumé</h2><p>Link to a document or portfolio that gives more context.</p></div></div>
          <label>Public URL<span className="input-with-icon"><FiGlobe /><input name="resume_url" type="url" value={form.resume_url} onChange={change} placeholder="https://your-portfolio.com" /></span></label>
        </section>
        <div className="profile-actions"><span>{saved && <><FiCheck /> Changes saved</>}</span><button className="button small" disabled={saving}>{saving ? "Saving…" : <><FiSave /> Save profile</>}</button></div>
      </div>
    </form>
  );
}

function EmployerProfile({ user, updateUser }) {
  const [form, setForm] = useState({
    company_name: user.profile?.company_name || "",
    contact_name: user.profile?.contact_name || "",
    contact_email: user.profile?.contact_email || user.email,
    website: user.profile?.website || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const data = await employersApi.update(user.id, form);
      updateUser({ profile: data.profile });
      setMessage("Company profile saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="profile-layout" onSubmit={submit}>
      <aside className="profile-sidebar panel">
        <span className="large-avatar">{form.company_name.slice(0, 2).toUpperCase() || "CO"}</span>
        <h2>{form.company_name || "Company profile"}</h2>
        <p>{user.email}</p>
        <div className="profile-divider" />
        <span className="eyebrow">Employer account</span>
        <p className="profile-helper">This information appears alongside your opportunities.</p>
      </aside>
      <div className="profile-sections">
        {message && <div className={message.includes("saved") ? "success-alert" : "form-alert"}>{message}</div>}
        <section className="panel profile-section">
          <div className="profile-section-head"><span className="section-icon"><FiUser /></span><div><h2>Organisation details</h2><p>Help candidates understand who is behind the project.</p></div></div>
          <label>Company name<input required value={form.company_name} onChange={(event) => setForm({ ...form, company_name: event.target.value })} /></label>
          <div className="field-row">
            <label>Contact name<input value={form.contact_name} onChange={(event) => setForm({ ...form, contact_name: event.target.value })} /></label>
            <label>Contact email<input type="email" value={form.contact_email} onChange={(event) => setForm({ ...form, contact_email: event.target.value })} /></label>
          </div>
          <label>Website<span className="input-with-icon"><FiGlobe /><input type="url" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="https://company.com" /></span></label>
        </section>
        <div className="profile-actions"><button className="button small" disabled={saving}>{saving ? "Saving…" : <><FiSave /> Save company profile</>}</button></div>
      </div>
    </form>
  );
}

function RoleProfile({ user }) {
  return (
    <section className="panel empty-workspace">
      <span className="large-avatar">{user.email.slice(0, 2).toUpperCase()}</span>
      <h2>{user.role === "mentor" ? "Mentor profile" : "Administrator profile"}</h2>
      <p>{user.email}</p>
      {user.profile?.expertise && <div className="role-chip">{user.profile.expertise}</div>}
    </section>
  );
}
