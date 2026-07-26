import { useEffect, useState } from "react";
import { FiActivity, FiBriefcase, FiSearch, FiShield, FiUserCheck, FiUsers, FiUserX } from "react-icons/fi";
import { adminApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const data = await adminApi.overview();
      setStats(data.stats);
      setUsers(data.users);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (user.role === "admin") load();
  }, [user.role]);

  if (user.role !== "admin") {
    return <section className="panel empty-workspace"><FiShield /><h2>Administrator access only</h2><p>This workspace is restricted to platform administrators.</p></section>;
  }

  const deactivate = async (target) => {
    if (target.id === user.id) {
      setMessage("You cannot deactivate the account you are currently using.");
      return;
    }
    try {
      await adminApi.deactivate(target.id);
      setUsers((current) => current.map((item) => item.id === target.id ? { ...item, is_active: false } : item));
      setMessage(`${target.email} was deactivated.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const filtered = users.filter((item) => (
    (role === "all" || item.role === role)
    && `${item.email} ${item.role}`.toLowerCase().includes(query.toLowerCase())
  ));
  const initials = (email) => email.slice(0, 2).toUpperCase();

  return (
    <div className="workspace-stack">
      <section className="workspace-hero"><div><span className="eyebrow">Platform administration</span><h2>Keep SkillConnect healthy.</h2><p>Monitor adoption and control access from one operational view.</p></div></section>
      {message && <div className="workspace-notice"><FiActivity /><span>{message}</span><button onClick={() => setMessage("")}>Dismiss</button></div>}
      <section className="stat-grid">
        <article><span className="stat-icon blue"><FiUsers /></span><div><small>Total users</small><strong>{stats?.total_users ?? "—"}</strong><p>All registered accounts</p></div></article>
        <article><span className="stat-icon green"><FiUserCheck /></span><div><small>Students</small><strong>{stats?.total_students ?? "—"}</strong><p>Building experience</p></div></article>
        <article><span className="stat-icon amber"><FiBriefcase /></span><div><small>Internships</small><strong>{stats?.total_internships ?? "—"}</strong><p>Published projects</p></div></article>
        <article><span className="stat-icon plum"><FiActivity /></span><div><small>Submissions</small><strong>{stats?.total_submissions ?? "—"}</strong><p>Work delivered</p></div></article>
      </section>
      <section className="panel admin-table-card">
        <header className="table-heading">
          <div><span className="eyebrow">Access control</span><h2>User directory</h2><p>{filtered.length} of {users.length} accounts</p></div>
          <label className="table-search"><FiSearch /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" /></label>
        </header>
        <div className="table-filters" aria-label="Filter users by role">
          {["all", "student", "employer", "mentor", "admin"].map((itemRole) => (
            <button key={itemRole} className={role === itemRole ? "active" : ""} onClick={() => setRole(itemRole)}>
              {itemRole === "all" ? "All users" : `${itemRole}s`}
              <span>{itemRole === "all" ? users.length : users.filter((item) => item.role === itemRole).length}</span>
            </button>
          ))}
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead><tr><th>Account</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>{filtered.map((item) => (
              <tr key={item.id}>
                <td data-label="Account"><div className="table-user"><span className="avatar">{initials(item.email)}</span><span><strong>{item.email}</strong><small>User ID · {item.id}</small></span></div></td>
                <td data-label="Role"><span className={`role-chip ${item.role}`}>{item.role}</span></td>
                <td data-label="Status"><span className={`account-status ${item.is_active ? "active" : ""}`}><i />{item.is_active ? "Active" : "Inactive"}</span></td>
                <td data-label="Joined"><span className="date-cell">{item.created_at ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.created_at)) : "—"}</span></td>
                <td data-label="Action"><button className="table-action" disabled={!item.is_active || item.id === user.id} onClick={() => deactivate(item)}><FiUserX />{item.id === user.id ? "Current account" : item.is_active ? "Deactivate" : "Deactivated"}</button></td>
              </tr>
            ))}{!filtered.length && <tr className="empty-table-row"><td colSpan="5"><FiSearch /><strong>No users found</strong><span>Try a different search or role filter.</span></td></tr>}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
