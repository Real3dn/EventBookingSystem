import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import { format } from 'date-fns';
import { 
  FaPlus, FaCalendarAlt, FaTicketAlt, FaUser, 
  FaEdit, FaTrash, FaMapMarkerAlt, FaUsers, FaClock 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'bookings'

  useEffect(() => {
    if (user) {
      fetchMyEvents();
      fetchMyBookings();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/my-events');
      setMyEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching my events:', error);
      toast.error('Failed to load your events');
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setMyBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchMyEvents(); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete event';
      toast.error(message);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-indigo-100">
                {user.is_admin 
                  ? 'You have admin privileges. You can create and manage events.'
                  : 'Manage your events and bookings from your dashboard.'
                }
              </p>
            </div>
            <Link
              to="/create-event"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">My Events</h3>
              <FaCalendarAlt className="text-indigo-600 text-2xl" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{myEvents.length}</p>
            <p className="text-gray-500 text-sm mt-2">Events you've created</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">My Bookings</h3>
              <FaTicketAlt className="text-green-600 text-2xl" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{myBookings.length}</p>
            <p className="text-gray-500 text-sm mt-2">Events you've booked</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Account Type</h3>
              <FaUser className="text-purple-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.is_admin ? 'Admin' : 'User'}</p>
            <p className="text-gray-500 text-sm mt-2">
              {user.is_admin ? 'Full access to manage events' : 'Standard user account'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'events'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCalendarAlt className="inline-block mr-2" />
                My Events ({myEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaTicketAlt className="inline-block mr-2" />
                My Bookings ({myBookings.length})
              </button>
            </nav>
          </div>

          {/* Events Tab Content */}
          {activeTab === 'events' && (
            <div className="p-6">
              {myEvents.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No events created yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start by creating your first event and share it with the world!
                  </p>
                  <Link
                    to="/create-event"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Create Your First Event
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {event.title}
                            </h3>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                              {event.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              event.available_spots > 10 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {event.available_spots} spots left
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <FaCalendarAlt className="mr-2 text-indigo-500" />
                              <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaClock className="mr-2 text-indigo-500" />
                              <span>{format(new Date(event.date), 'HH:mm')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaUsers className="mr-1" />
                              <span>{event.capacity - event.available_spots} / {event.capacity} booked</span>
                            </div>
                            <div>
                              Price: <span className="font-semibold text-gray-900">${event.price}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            to={`/events/${event.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="View Event"
                          >
                            <FaCalendarAlt className="text-xl" />
                          </Link>
                          <Link
                            to={`/events/${event.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Event"
                          >
                            <FaEdit className="text-xl" />
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Event"
                          >
                            <FaTrash className="text-xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab Content */}
          {activeTab === 'bookings' && (
            <div className="p-6">
              {myBookings.length === 0 ? (
                <div className="text-center py-12">
                  <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't booked any events yet. Start exploring and book your first event!
                  </p>
                  <Link
                    to="/events"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
                  >
                    <FaCalendarAlt className="mr-2" />
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {booking.event_title || 'Event'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Booking ID</p>
                              <p className="font-medium text-gray-900">#{booking.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Quantity</p>
                              <p className="font-medium text-gray-900">
                                {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                              </p>
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
                            <div>
                              <p className="text-sm text-gray-500">Event Date</p>
                              <p className="font-medium text-gray-900">
                                {booking.event_date 
                                  ? format(new Date(booking.event_date), 'MMM dd, yyyy')
                                  : 'TBA'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          to={`/events/${booking.event_id}`}
                          className="ml-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                        >
                          View Event
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/create-event"
              className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-700 transition-colors">
                <FaPlus className="text-white text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create New Event</p>
                <p className="text-sm text-gray-600">Start organizing</p>
              </div>
            </Link>
            
            <Link
              to="/events"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-700 transition-colors">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Browse Events</p>
                <p className="text-sm text-gray-600">Discover new events</p>
              </div>
            </Link>
            
            <button
              onClick={() => {
                fetchMyEvents();
                fetchMyBookings();
                toast.success('Dashboard refreshed!');
              }}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Refresh Data</p>
                <p className="text-sm text-gray-600">Update your stats</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;