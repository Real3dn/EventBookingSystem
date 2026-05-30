import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setBooking(true);
    try {
      await api.post('/bookings', {
        event_id: event.id,
        quantity: 1
      });
      toast.success('Event booked successfully!');
      fetchEvent(); // Refresh event data
    } catch (error) {
      const message = error.response?.data?.error || 'Booking failed';
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Hero Image */}
          <div className="h-64 md:h-96 bg-gradient-to-br from-indigo-400 to-purple-500 relative">
            {event.image_url ? (
              <img
                src={`http://localhost:5000${event.image_url}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaCalendarAlt className="text-white text-8xl" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
              {event.category}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-900 font-medium">
                        {format(new Date(event.date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-900 font-medium">
                        {format(new Date(event.date), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900 font-medium">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="text-gray-900 font-medium">
                        {event.available_spots} / {event.capacity} spots left
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizer</h3>
                  <p className="text-gray-600">{event.organizer_name}</p>
                </div>
              </div>

              {/* Sidebar - Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-indigo-600">${event.price}</span>
                    <span className="text-gray-600 ml-2">per ticket</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available spots</span>
                        <span className={`font-semibold ${event.available_spots < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {event.available_spots}
                        </span>
                      </div>
                      {event.available_spots < 20 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${((event.capacity - event.available_spots) / event.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {event.available_spots < 10 ? 'Almost sold out!' : 'Selling fast'}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={booking || event.available_spots === 0}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {booking ? 'Booking...' : event.available_spots === 0 ? 'Sold Out' : 'Book Now'}
                    </button>

                    {!user && (
                      <p className="text-sm text-gray-500 text-center">
                        <button
                          onClick={() => navigate('/login', { state: { from: { pathname: `/events/${id}` } } })}
                          className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          Sign in
                        </button>
                        {' '}to book this event
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;