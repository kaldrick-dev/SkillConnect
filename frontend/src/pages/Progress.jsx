import React from "react";

export default function Progress() {
  const completedTasks = 15;
  const pendingTasks = 5;
  const totalTasks = completedTasks + pendingTasks;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Internship Progress
      </h1>

      <p className="text-gray-500 mb-8">
        Monitor your internship completion and upcoming milestones.
      </p>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Overall Progress</h2>

          <span className="text-4xl font-bold text-blue-600">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-5">
          <div
            className="bg-blue-600 h-5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-green-600 text-4xl font-bold">
            {completedTasks}
          </h3>
          <p className="text-gray-500 mt-2">Completed Tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-yellow-500 text-4xl font-bold">
            {pendingTasks}
          </h3>
          <p className="text-gray-500 mt-2">Pending Tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-red-500 text-4xl font-bold">
            21
          </h3>
          <p className="text-gray-500 mt-2">Days Remaining</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-blue-600 text-4xl font-bold">
            Week 7
          </h3>
          <p className="text-gray-500 mt-2">Current Week</p>
        </div>

      </div>

      {/* Task Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          Internship Milestones
        </h2>

        <div className="space-y-5">

          <div>
            <div className="flex justify-between mb-2">
              <span>Orientation</span>
              <span className="text-green-600 font-semibold">
                Completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full w-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Profile Completion</span>
              <span className="text-green-600 font-semibold">
                80%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full w-4/5"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Tasks Submitted</span>
              <span className="text-blue-600 font-semibold">
                15 / 20
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Final Evaluation</span>
              <span className="text-gray-500 font-semibold">
                Not Started
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gray-400 h-3 rounded-full w-0"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-5">
          Recent Activity
        </h2>

        <ul className="space-y-4">

          <li className="flex justify-between border-b pb-3">
            <span>Submitted Weekly Report</span>
            <span className="text-green-600 font-semibold">
              Completed
            </span>
          </li>

          <li className="flex justify-between border-b pb-3">
            <span>Attend Mentor Meeting</span>
            <span className="text-yellow-500 font-semibold">
              Tomorrow
            </span>
          </li>

          <li className="flex justify-between border-b pb-3">
            <span>Complete UI Dashboard</span>
            <span className="text-blue-600 font-semibold">
              In Progress
            </span>
          </li>

          <li className="flex justify-between">
            <span>Final Internship Report</span>
            <span className="text-gray-500 font-semibold">
              Upcoming
            </span>
          </li>

        </ul>
      </div>
    </div>
  );
}