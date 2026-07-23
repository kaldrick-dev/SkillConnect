import React from "react";
import { FaUserCircle } from "react-icons/fa";

const users = [
  {
    name: "Alice Johnson",
    role: "Student",
    time: "5 minutes ago",
  },
  {
    name: "James Mugisha",
    role: "Employer",
    time: "20 minutes ago",
  },
  {
    name: "Diane Uwase",
    role: "Student",
    time: "1 hour ago",
  },
  {
    name: "Eric Mwangi",
    role: "Employer",
    time: "2 hours ago",
  },
  {
    name: "Grace Niyonsenga",
    role: "Student",
    time: "Today",
  },
];

export default function RecentUsers() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recent Users
        </h2>

        <button className="text-blue-600 hover:underline font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-4">

        {users.map((user, index) => (

          <div
            key={index}
            className="flex items-center justify-between border-b pb-4 last:border-none"
          >

            <div className="flex items-center gap-4">

              <FaUserCircle className="text-5xl text-blue-500" />

              <div>

                <h3 className="font-semibold text-gray-800">
                  {user.name}
                </h3>

                <p className="text-gray-500">
                  {user.role}
                </p>

              </div>

            </div>

            <span className="text-sm text-gray-400">
              {user.time}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}