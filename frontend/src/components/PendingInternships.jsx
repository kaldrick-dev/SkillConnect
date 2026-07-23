import React from "react";

const internships = [
  {
    id: 1,
    company: "BK Group",
    position: "Software Engineer Intern",
    posted: "Today",
  },
  {
    id: 2,
    company: "MTN Rwanda",
    position: "Network Engineer",
    posted: "Yesterday",
  },
  {
    id: 3,
    company: "Andela",
    position: "Frontend Developer",
    posted: "2 Days Ago",
  },
  {
    id: 4,
    company: "Zipline",
    position: "Data Analyst",
    posted: "3 Days Ago",
  },
];

export default function PendingInternships() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold text-gray-800">
          Pending Internship Approval
        </h2>

        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {internships.map((job) => (

          <div
            key={job.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-bold text-lg text-gray-800">
                  {job.position}
                </h3>

                <p className="text-gray-500 mt-1">
                  {job.company}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Posted {job.posted}
                </p>

              </div>

              <div className="flex gap-2">

                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  Approve
                </button>

                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                  Reject
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}