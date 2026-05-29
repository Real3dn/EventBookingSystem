import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaCalendarAlt, FaTicketAlt, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-indigo-100">Manage your events and bookings from your dashboard.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'My Events',
              value: '0',
              icon: FaCalendarAlt,
              link: '/create-event',
              linkText: 'Create Event',
            },
            {
              title: 'My Bookings',
              value: '0',
              icon: FaTicketAlt,
              link: '/my-bookings',
              linkText: 'View Bookings',
            },
            {
              title: 'Account Type',
              value: user.is_admin ? 'Admin' : 'User',
              icon: FaUser,
              link: '/dashboard',
              linkText: 'View Profile',
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                <stat.icon className="text-indigo-600 text-2xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</p>
              <Link
                to={stat.link}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                {stat.linkText} →
              </Link>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/create-event"
                className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <FaPlus className="text-indigo-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Create New Event</p>
                  <p className="text-sm text-gray-600">Start organizing your event</p>
                </div>
              </Link>
              <Link
                to="/events"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaCalendarAlt className="text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Browse Events</p>
                  <p className="text-sm text-gray-600">Discover upcoming events</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
              <p className="text-sm text-gray-500 mt-1">
                Your recent events and bookings will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;