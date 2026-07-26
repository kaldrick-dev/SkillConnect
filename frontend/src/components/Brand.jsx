import { Link } from "react-router-dom";

export default function Brand({ to = "/" }) {
  return (
    <Link className="brand" to={to} aria-label="SkillConnect home">
      <span className="brand-mark"><i /><i /><i /></span>
      <span>SkillConnect</span>
    </Link>
  );
}
