import React from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function AdminNavbar() {
  return (
    <div className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="relative hidden md:block">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="pl-11 pr-4 py-2 w-72 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notification */}

        <button className="relative">

          <FaBell className="text-2xl text-gray-600 hover:text-blue-600" />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            5
          </span>

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-4xl text-blue-600" />

          <div>
            <h3 className="font-semibold text-gray-800">
              Admin
            </h3>

            <p className="text-sm text-gray-500">
              System Administrator
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}