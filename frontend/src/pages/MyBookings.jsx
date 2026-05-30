import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {api} from '../context/AuthContext.jsx'
import { format } from 'date-fns';
import { FaCalendarAlt, FaTicketAlt, FaMapMarkerAlt } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  console.log(bookings)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your event bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't booked any events yet. Start exploring and book your first event!
            </p>
            <Link to="/events" className="btn-primary inline-block">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FaCalendarAlt className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.event_title || 'Event'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Booking ID: #{booking.id}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium text-gray-900">{booking.quantity} ticket(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-gray-900">${booking.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booked On</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/events/${booking.event_id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      View Event →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;