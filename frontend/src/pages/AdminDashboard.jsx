import React from "react";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import StatCard from "../components/StatCard";
import RecentApplications from "../components/RecentApplications";
import PendingInternships from "../components/PendingInternships";
import PlatformActivity from "../components/PlatformActivity";
import RecentUsers from "../components/RecentUsers";

export default function AdminDashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">

        <AdminNavbar />

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard
              title="Students"
              value="1,245"
              subtitle="+18 this week"
              color="bg-blue-500"
            />

            <StatCard
              title="Employers"
              value="102"
              subtitle="+3 today"
              color="bg-green-500"
            />

            <StatCard
              title="Internships"
              value="58"
              subtitle="Active Listings"
              color="bg-purple-500"
            />

            <StatCard
              title="Applications"
              value="942"
              subtitle="34 Pending"
              color="bg-orange-500"
            />

          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            <RecentApplications />

            <PendingInternships />

          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            <PlatformActivity />

            <RecentUsers />

          </div>

        </div>
      </div>
    </div>
  );
}