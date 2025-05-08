import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventBySlug } from '../services/api';
import { WordPressEvent } from '../types/wordpress';
import Loader from '../components/common/Loader';
import { Calendar, MapPin, Clock, Share2 } from 'lucide-react';

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<WordPressEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const eventData = await fetchEventBySlug(slug);
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load the event. Please try again later.');
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };
    
    loadEvent();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <Loader message="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error || 'Event not found'}</p>
        <Link
          to="/events"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  // Extract featured image
  const featuredImage = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg'; // Default image

  // Use custom meta fields for event date and location, or fallback to defaults
  const eventDate = event.meta.event_date ? event.meta.event_date : event.date;
  const eventLocation = event.meta.event_location || 'Online';

  return (
    <div className="bg-white min-h-screen">
      {/* Featured image banner */}
      <div 
        className="w-full h-64 md:h-96 bg-center bg-cover" 
        style={{ backgroundImage: `url(${featuredImage})` }}
      >
        <div className="w-full h-full flex items-end bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
            <div className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full mb-3">
              Event
            </div>
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2"
              dangerouslySetInnerHTML={{ __html: event.title.rendered }}
            ></h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="md:w-8/12">
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium">{formatDate(eventDate)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium">{eventLocation}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-medium">10:00 AM - 4:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Share2 className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Share</div>
                    <div className="flex space-x-2 mt-1">
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-blue-400">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-green-500">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-5.5 5.5A1.5 1.5 0 0116 10h-2v6h-2v-6h-2v-2h2V6.5A2.5 2.5 0 0114.5 4h2v2h-2a.5.5 0 00-.5.5V8h2.5l-.5 1.5z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <article className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: event.content.rendered }}
                className="wp-content"
              ></div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-4/12 mt-8 md:mt-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Register for this event</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
                >
                  Register Now
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span>{formatDate(eventDate)}</span>
                  </li>
                  <li className="flex">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span>{eventLocation}</span>
                  </li>
                  <li className="flex">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
        <Link 
          to="/events"
          className="inline-flex items-center text-orange-500 hover:text-orange-600"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>
      </div>
    </div>
  );
};

export default EventDetailPage;