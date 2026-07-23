import React from "react";

const applications = [
  {
    id: 1,
    student: "Alice Johnson",
    internship: "UI/UX Designer",
    employer: "MTN Rwanda",
    status: "Pending",
  },
  {
    id: 2,
    student: "John Doe",
    internship: "Backend Developer",
    employer: "BK Group",
    status: "Approved",
  },
  {
    id: 3,
    student: "Eric Mwangi",
    internship: "Marketing Intern",
    employer: "Irembo",
    status: "Rejected",
  },
  {
    id: 4,
    student: "Grace Uwase",
    internship: "Frontend Developer",
    employer: "Andela",
    status: "Pending",
  },
];

const badgeColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

export default function RecentApplications() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          Recent Applications
        </h2>

        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3 text-gray-600">Student</th>

              <th className="text-left py-3 text-gray-600">Internship</th>

              <th className="text-left py-3 text-gray-600">Employer</th>

              <th className="text-left py-3 text-gray-600">Status</th>

            </tr>

          </thead>

          <tbody>

            {applications.map((app) => (

              <tr
                key={app.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4">{app.student}</td>

                <td>{app.internship}</td>

                <td>{app.employer}</td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}