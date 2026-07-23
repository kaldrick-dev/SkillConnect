import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-gray-500 text-sm font-medium uppercase">
            {title}
          </h3>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {value}
          </h2>

          <p className="text-gray-500 mt-4">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-16 h-16 rounded-full ${color} flex items-center justify-center`}
        >
          <div className="w-8 h-8 bg-white rounded-full opacity-30"></div>
        </div>

      </div>

    </div>
  );
}