import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FiBell, FiBriefcase, FiCompass, FiGrid, FiLogOut, FiMenu, FiShield, FiUser, FiUsers, FiX } from "react-icons/fi";
import { useState } from "react";
import Brand from "./Brand";
import { useAuth } from "../context/AuthContext";

const labels = {
  "/dashboard": ["Overview", "Your workspace at a glance."],
  "/opportunities": ["Opportunities", "Find work that moves your skills forward."],
  "/work": ["Project workspace", "Manage applications, tasks, submissions, and outcomes."],
  "/directory": ["Community", "Mentors and companies on SkillConnect."],
  "/profile": ["Your profile", "Put your best work and experience forward."],
  "/admin": ["Administration", "Monitor platform activity and user access."],
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [title, subtitle] = labels[pathname] || labels["/dashboard"];
  const initials = user?.email?.slice(0, 2).toUpperCase() || "SC";

  const navByRole = {
    student: [
      ["/dashboard", FiGrid, "Overview"],
      ["/opportunities", FiCompass, "Explore"],
      ["/work", FiBriefcase, "My work"],
      ["/directory", FiUsers, "Community"],
      ["/profile", FiUser, "Profile"],
    ],
    employer: [
      ["/dashboard", FiGrid, "Overview"],
      ["/work", FiBriefcase, "Projects & talent"],
      ["/directory", FiUsers, "Community"],
      ["/profile", FiUser, "Company profile"],
    ],
    mentor: [
      ["/dashboard", FiGrid, "Overview"],
      ["/work", FiBriefcase, "Reviews"],
      ["/directory", FiUsers, "Community"],
      ["/profile", FiUser, "Profile"],
    ],
    admin: [
      ["/dashboard", FiGrid, "Overview"],
      ["/admin", FiShield, "Administration"],
      ["/profile", FiUser, "Profile"],
    ],
  };
  const nav = navByRole[user?.role] || navByRole.student;

  return (
    <div className="app-frame">
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <Brand to="/dashboard" />
          <button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close navigation"><FiX /></button>
        </div>
        <nav className="side-nav">
          <p className="nav-label">Workspace</p>
          {nav.map(([to, Icon, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <Icon /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <FiBriefcase />
          <strong>{user?.role === "student" ? "Build proof, not promises." : "Make practical work count."}</strong>
          <p>{user?.role === "student" ? "Complete real project work and grow a portfolio employers can trust." : "Create structure, give useful feedback, and recognise strong outcomes."}</p>
        </div>
        <button className="account-row" onClick={logout}>
          <span className="avatar">{initials}</span>
          <span><strong>{user?.email?.split("@")[0]}</strong><small>{user?.role}</small></span>
          <FiLogOut />
        </button>
      </aside>
      {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <main className="app-main">
        <header className="app-header">
          <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation"><FiMenu /></button>
          <div><h1>{title}</h1><p>{subtitle}</p></div>
          <button className="icon-button notification" aria-label="Notifications"><FiBell /><i /></button>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
