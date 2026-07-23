import React from "react";

const activities = [
  {
    title: "Students Registered Today",
    value: 18,
    progress: "72%",
  },
  {
    title: "Applications Submitted",
    value: 65,
    progress: "90%",
  },
  {
    title: "Internships Posted",
    value: 7,
    progress: "45%",
  },
  {
    title: "Companies Verified",
    value: 12,
    progress: "60%",
  },
];

export default function PlatformActivity() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Platform Activity
      </h2>

      <div className="space-y-6">

        {activities.map((activity, index) => (

          <div key={index}>

            <div className="flex justify-between mb-2">

              <span className="font-medium text-gray-700">
                {activity.title}
              </span>

              <span className="font-bold text-blue-600">
                {activity.value}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: activity.progress }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}