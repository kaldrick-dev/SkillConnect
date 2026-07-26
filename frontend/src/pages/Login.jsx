import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
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
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span className="eyebrow">Welcome back</span>
            <h1>Continue building your story.</h1>
            <p>Log in to see your projects, feedback, and next opportunities.</p>
          </div>
          <form className="auth-form" onSubmit={submit}>
            {error && <div className="form-alert" role="alert">{error}</div>}
            <label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Password
              <span className="password-field">
                <input required minLength="6" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </span>
            </label>
            <div className="form-options"><label className="check-label"><input type="checkbox" /> Keep me signed in</label></div>
            <button className="button form-button" disabled={loading}>{loading ? "Logging in…" : <>Log in <FiArrowRight /></>}</button>
          </form>
          <p className="auth-switch">New to SkillConnect? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
      <AuthAside />
    </div>
  );
}

function AuthAside() {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-grid" />
      <div className="quote-mark">“</div>
      <blockquote>SkillConnect gave me something interviews never could: real work to talk about.</blockquote>
      <div className="quote-person"><span className="avatar">AM</span><p><strong>Aline M.</strong><small>Junior data analyst</small></p></div>
      <div className="aside-stat"><strong>8 weeks</strong><span>from first project to first offer</span></div>
    </aside>
  );
}
