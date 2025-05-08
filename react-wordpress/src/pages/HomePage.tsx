import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, fetchEvents } from '../services/api';
import { WordPressPost, WordPressEvent } from '../types/wordpress';
import PostCard from '../components/posts/PostCard';
import EventCard from '../components/events/EventCard';
import Loader from '../components/common/Loader';

const HomePage: React.FC = () => {
  const [featuredPost, setFeaturedPost] = useState<WordPressPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<WordPressPost[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<WordPressEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsLoading(true);
      try {
        // Fetch posts for featured and recent sections
        const { posts } = await fetchPosts(1, 5);
        
        if (posts.length > 0) {
          // Set the first post as featured
          setFeaturedPost(posts[0]);
          // Set the rest as recent posts
          setRecentPosts(posts.slice(1, 5));
        }
        
        // Fetch upcoming event
        const { events } = await fetchEvents(1, 1);
        if (events.length > 0) {
          setUpcomingEvent(events[0]);
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomePageData();
  }, []);

  if (isLoading) {
    return <Loader message="Loading content..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                WordPress + React Integration
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                A modern headless WordPress solution with a lightning-fast React frontend.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/posts"
                  className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Explore Blog
                </Link>
                <Link
                  to="/events"
                  className="inline-block px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Events
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-blue-700 p-6 rounded-lg shadow-xl">
                <div className="text-sm font-medium text-blue-200 mb-2">Features</div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>WordPress REST API integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>React for blazing-fast UX</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Responsive design with Tailwind CSS</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dynamic routing & content loading</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Post</h2>
              <Link 
                to="/posts" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View All Posts
              </Link>
            </div>
            
            <PostCard post={featuredPost} variant="featured" />
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link 
                to="/posts" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Event Section */}
      {upcomingEvent && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Event</h2>
              <Link 
                to="/events" 
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                View All Events
              </Link>
            </div>
            
            <EventCard event={upcomingEvent} variant="featured" />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us today and experience the power of headless WordPress with React.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;