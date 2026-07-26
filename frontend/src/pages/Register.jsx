import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck, FiEye, FiEyeOff, FiUser, FiUsers } from "react-icons/fi";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "student", university: "", company_name: "", expertise: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordScore = useMemo(() => [form.password.length >= 8, /[A-Z]/.test(form.password), /\d/.test(form.password)].filter(Boolean).length, [form.password]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-top"><Brand /><Link to="/" className="back-link"><FiArrowLeft /> Back to home</Link></div>
        <div className="auth-form-wrap register-wrap">
          <div className="auth-heading">
            <span className="eyebrow">Start with SkillConnect</span>
            <h1>Build experience that speaks for itself.</h1>
            <p>Create your account and take the first step toward meaningful work.</p>
          </div>
          <form className="auth-form" onSubmit={submit}>
            {error && <div className="form-alert" role="alert">{error}</div>}
            <fieldset className="role-picker">
              <legend>I want to</legend>
              <button type="button" className={form.role === "student" ? "selected" : ""} onClick={() => setForm({ ...form, role: "student" })}><FiUser /><span><strong>Build experience</strong><small>Join as talent</small></span>{form.role === "student" && <FiCheck />}</button>
              <button type="button" className={form.role === "employer" ? "selected" : ""} onClick={() => setForm({ ...form, role: "employer" })}><FiBriefcase /><span><strong>Host projects</strong><small>Join as an employer</small></span>{form.role === "employer" && <FiCheck />}</button>
              <button type="button" className={form.role === "mentor" ? "selected" : ""} onClick={() => setForm({ ...form, role: "mentor" })}><FiUsers /><span><strong>Guide talent</strong><small>Join as a mentor</small></span>{form.role === "mentor" && <FiCheck />}</button>
            </fieldset>
            {form.role === "student" ? (
              <div className="field-row">
                <label>First name<input required name="first_name" placeholder="Aline" value={form.first_name} onChange={change} /></label>
                <label>Last name<input required name="last_name" placeholder="Mutesi" value={form.last_name} onChange={change} /></label>
              </div>
            ) : form.role === "employer" ? (
              <label>Company name<input required name="company_name" placeholder="Your organisation" value={form.company_name} onChange={change} /></label>
            ) : (
              <label>Area of expertise<input required name="expertise" placeholder="e.g. Software engineering" value={form.expertise} onChange={change} /></label>
            )}
            <label>Email address<input required name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={change} /></label>
            <label>Password
              <span className="password-field">
                <input required name="password" minLength="8" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={change} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </span>
            </label>
            <div className="password-meter"><span>{[0, 1, 2].map((n) => <i key={n} className={passwordScore > n ? "filled" : ""} />)}</span><small>{passwordScore === 3 ? "Strong password" : "Use 8+ characters, a number, and uppercase letter"}</small></div>
            <label className="check-label terms"><input required type="checkbox" /> I agree to SkillConnect’s terms and privacy policy.</label>
            <button className="button form-button" disabled={loading}>{loading ? "Creating account…" : <>Create account <FiArrowRight /></>}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </section>
      <aside className="auth-aside register-aside">
        <div className="auth-aside-grid" />
        <span className="eyebrow">What you’ll get</span>
        <h2>A clearer path from learning to doing.</h2>
        <ul>
          <li><FiCheck /><span><strong>Real company work</strong><small>Portfolio-ready projects with clear outcomes.</small></span></li>
          <li><FiCheck /><span><strong>Useful feedback</strong><small>Guidance from mentors who know the work.</small></span></li>
          <li><FiCheck /><span><strong>Verified progress</strong><small>Skills and certificates backed by evidence.</small></span></li>
        </ul>
      </aside>
    </div>
  );
}
