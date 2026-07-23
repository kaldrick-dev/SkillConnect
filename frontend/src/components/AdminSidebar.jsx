import React from "react";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBuilding,
  FaBriefcase,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaTachometerAlt />, name: "Dashboard" },
  { icon: <FaUserGraduate />, name: "Students" },
  { icon: <FaBuilding />, name: "Employers" },
  { icon: <FaBriefcase />, name: "Internships" },
  { icon: <FaClipboardList />, name: "Applications" },
  { icon: <FaChartBar />, name: "Reports" },
  { icon: <FaCog />, name: "Settings" },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        SkillConnect
      </div>

      <div className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-600 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <button className="flex items-center gap-4 px-6 py-5 bg-red-500 hover:bg-red-600">
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}