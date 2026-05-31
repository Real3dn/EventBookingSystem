import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaGithub, FaSchool, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaCalendarAlt className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold">EventHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop platform for discovering and booking amazing events. 
              From conferences to concerts, find your next experience with us.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.github.com/Real3dn/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="https://www.github.com/Real3dn/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaSchool className="h-6 w-6" />
              </a>
              <a href="https://www.github.com/Real3dn/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>support@eventhub.com</li>
              <li>+(964) 770 123 4567 </li>
              <li>Iraq</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Real3dn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;