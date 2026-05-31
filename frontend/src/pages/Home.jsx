import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { format } from 'date-fns';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSearch, 
  FaArrowRight, FaStar, FaHeart, FaShieldAlt, 
  FaHeadset, FaRocket, FaChartLine, FaGlobe,
  FaPlay, FaCheckCircle, FaClock, FaTicketAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      const allEvents = response.data.events || [];
      setEvents(allEvents.slice(0, 6));
      setFeaturedEvents(allEvents.filter(event => event.available_spots < 20).slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="absolute top-0 animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Modern Gradient & Glass Effect */}
      <div className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMC00YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMCA4YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
                <FaRocket className="text-purple-400 mr-2" />
                <span className="text-purple-200 text-sm font-medium">The #1 Event Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Discover
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Amazing Events
                </span>
                Near You
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                From electrifying concerts to inspiring conferences, find and book the perfect event that matches your passion. Your next unforgettable experience is just a click away.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 max-w-lg">
                  <div className="flex-1 flex items-center px-4">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search for events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none py-3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/events"
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center"
                >
                  Explore Events
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center"
                  >
                    Get Started Free
                    <FaArrowRight className="ml-2" />
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                {[
                  { number: '10K+', label: 'Events' },
                  { number: '50K+', label: 'Attendees' },
                  { number: '4.9', label: 'Rating' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className="relative hidden lg:block">
              {/* Main Card */}
              <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-purple-200 text-sm mb-1">Featured Event</p>
                      <h3 className="text-2xl font-bold">Summer Music Festival</h3>
                    </div>
                    <FaStar className="text-yellow-300 text-xl" />
                  </div>
                  <div className="flex items-center space-x-4 text-purple-100">
                    <FaCalendarAlt />
                    <span>June 15, 2026</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-white">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                      <FaMapMarkerAlt className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">Central Park, NYC</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white">
                    <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center mr-3">
                      <FaUsers className="text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Attending</p>
                      <p className="font-medium">2,500+ people</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Small Cards */}
              <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl z-20 transform rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Easy Booking</p>
                    <p className="text-gray-400 text-xs">2 min process</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl z-20 transform -rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaTicketAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Instant Tickets</p>
                    <p className="text-gray-400 text-xs">Digital delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
<path
  fill="#f9fafb"
  fill-opacity="1"
  d="M0,208L48,216C96,224,192,240,288,253.3C384,266,480,277.5,576,266.7C672,256,768,224,864,224C960,224,1056,256,1152,264C1248,272,1344,256,1392,248L1440,240L1440,320L0,320Z"
/>          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">EventHub</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We make event discovery and booking seamless with our powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaRocket,
                title: 'Fast Booking',
                description: 'Book your tickets in under 2 minutes with our streamlined process',
                gradient: 'from-purple-500 to-indigo-500',
                bgGradient: 'from-purple-50 to-indigo-50',
              },
              {
                icon: FaShieldAlt,
                title: 'Secure Payments',
                description: 'Your transactions are protected with enterprise-grade security',
                gradient: 'from-pink-500 to-red-500',
                bgGradient: 'from-pink-50 to-red-50',
              },
              {
                icon: FaGlobe,
                title: 'Global Events',
                description: 'Access events from around the world, right at your fingertips',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50',
              },
              {
                icon: FaHeadset,
                title: '24/7 Support',
                description: 'Our dedicated team is always ready to help you anytime',
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-50 to-emerald-50',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      {events.length > 0 && (
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Upcoming <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Events</span>
                </h2>
                <p className="text-gray-600 text-lg">Don't miss out on these amazing experiences</p>
              </div>
              <Link
                to="/events"
                className="hidden md:flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
              >
                View All Events
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className="relative h-56 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={`http://localhost:5000${event.image_url}`}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
                        <FaCalendarAlt className="text-white text-6xl opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30">
                        <FaHeart className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FaCalendarAlt className="mr-2 text-purple-500" />
                      <span>{event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'Date TBA'}</span>
                      <span className="mx-2">•</span>
                      <FaClock className="mr-2 text-purple-500" />
                      <span>{event.date ? format(new Date(event.date), 'HH:mm') : 'Time TBA'}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mr-2 text-pink-500" />
                      <span>{event.location || 'Location TBA'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          ${event.price != null ? event.price : '0'}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">/ ticket</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUsers className="mr-1" />
                        <span>{event.available_spots != null ? event.available_spots : 0} left</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link
                to="/events"
                className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                View All Events
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: FaSearch,
                title: 'Discover',
                description: 'Browse through thousands of events and find the perfect one for you',
                gradient: 'from-purple-500 to-indigo-500',
              },
              {
                step: '02',
                icon: FaTicketAlt,
                title: 'Book',
                description: 'Secure your spot with our fast and easy booking process',
                gradient: 'from-pink-500 to-red-500',
              },
              {
                step: '03',
                icon: FaRocket,
                title: 'Enjoy',
                description: 'Attend the event and create unforgettable memories',
                gradient: 'from-blue-500 to-cyan-500',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2">
                  <div className="text-6xl font-bold text-gray-100 mb-4">{step.step}</div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300`}>
                    <step.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <FaArrowRight className="text-3xl text-purple-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMThjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0wLTRjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0wIDhjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yek0yNCAxOGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6bTAtNGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6bTAgOGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Your Event?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust EventHub to manage their events and reach new audiences.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Link
                to="/create-event"
                className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
              >
                Create Event
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                >
                  Get Started Free
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/events"
                  className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center"
                >
                  Browse Events
                  <FaPlay className="ml-2 group-hover:scale-110 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;