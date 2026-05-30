import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { format } from 'date-fns';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [search, category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await api.get('/events', { params });
      
      // Ensure we're working with an array
      const eventsData = response.data?.events || [];
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      
      // Extract unique categories
      if (Array.isArray(eventsData)) {
        const uniqueCategories = [...new Set(eventsData.map(event => event.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
      setEvents([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and book the best events happening near you
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Events</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 relative">
                  {event.image_url ? (
                    <img
                      src={`http://localhost:5000${event.image_url}`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                  ) : null}
                  <div className="absolute top-4 right-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category || 'General'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description || 'No description available'}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-indigo-500" />
                      <span>{event.date ? format(new Date(event.date), 'MMM dd, yyyy HH:mm') : 'Date TBA'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                      <span>{event.location || 'Location TBA'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 text-indigo-500" />
                      <span>{event.available_spots != null ? `${event.available_spots} spots left` : 'Capacity TBA'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${event.price != null ? event.price : '0'}
                    </span>
                    <span className={`text-sm font-medium ${
                      event.available_spots != null && event.available_spots < 10 
                        ? 'text-red-500' 
                        : 'text-green-500'
                    }`}>
                      {event.available_spots != null 
                        ? (event.available_spots < 10 ? 'Almost full!' : 'Available')
                        : 'Check availability'
                      }
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;