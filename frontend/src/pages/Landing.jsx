import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiLayers, FiTarget, FiTrendingUp } from "react-icons/fi";
import Brand from "../components/Brand";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="#outcomes">For employers</a>
        </nav>
        <div className="nav-actions">
          <Link className="text-link" to="/login">Log in</Link>
          <Link className="button small" to="/register">Get started</Link>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Experience that counts</span>
            <h1>Turn your potential into <em>proof.</em></h1>
            <p>Work on real company projects, learn alongside experienced mentors, and build a track record that opens doors.</p>
            <div className="hero-actions">
              <Link className="button" to="/register">Find your opportunity <FiArrowRight /></Link>
              <a className="text-link with-arrow" href="#how-it-works">See how it works <FiArrowRight /></a>
            </div>
            <div className="trust-line">
              <div className="avatar-stack"><span>AK</span><span>IM</span><span>NR</span><span>+</span></div>
              <p><strong>Join ambitious early-career talent</strong><br />building job-ready experience.</p>
            </div>
          </div>
          <div className="hero-visual" aria-label="SkillConnect student progress preview">
            <div className="visual-grid" />
            <div className="project-preview">
              <div className="preview-head"><span className="company-mark blue">AL</span><span><small>Active project</small><strong>Product research sprint</strong></span><i>68%</i></div>
              <div className="progress-track"><span /></div>
              <div className="preview-list">
                <p><FiCheckCircle /><span><strong>Market landscape</strong><small>Completed · Reviewed by mentor</small></span><b>18/20</b></p>
                <p><FiCheckCircle /><span><strong>User interview synthesis</strong><small>Completed · Excellent insight</small></span><b>27/30</b></p>
                <p className="current"><span className="step-number">03</span><span><strong>Opportunity mapping</strong><small>Due Friday · In progress</small></span><b>•••</b></p>
              </div>
            </div>
            <div className="mentor-card">
              <span className="avatar">MN</span>
              <span><small>Your mentor</small><strong>Marie N.</strong><p>“Strong thinking—now sharpen the recommendation.”</p></span>
            </div>
            <span className="floating-label"><i /> Verified experience</span>
          </div>
        </section>

        <section id="how-it-works" className="how-section">
          <div className="section-heading">
            <span className="eyebrow">A better way to start</span>
            <h2>Experience should be earned,<br />not gatekept.</h2>
          </div>
          <div className="steps-grid">
            <article><span>01</span><FiTarget /><h3>Find your fit</h3><p>Discover curated virtual internships aligned with your interests and goals.</p></article>
            <article><span>02</span><FiLayers /><h3>Do meaningful work</h3><p>Complete structured projects based on real challenges from growing teams.</p></article>
            <article><span>03</span><FiTrendingUp /><h3>Show what you can do</h3><p>Leave with feedback, verified skills, and work you can confidently share.</p></article>
          </div>
        </section>

        <section id="outcomes" className="outcome-strip">
          <p>Designed for talent. Useful to teams.</p>
          <div><strong>Real projects</strong><strong>Structured mentorship</strong><strong>Verified outcomes</strong><strong>Remote by design</strong></div>
        </section>
      </main>
      <footer><Brand /><p>Practical experience for ambitious people.</p><span>© {new Date().getFullYear()} SkillConnect</span></footer>
    </div>
  );
}
