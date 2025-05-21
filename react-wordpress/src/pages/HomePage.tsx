import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, fetchEvents, fetchPageBySlug } from '../services/api';
import { WordPressPost, WordPressEvent, WordPressPage } from '../types/wordpress';
import PostCard from '../components/posts/PostCard';
import EventCard from '../components/events/EventCard';
import Loader from '../components/common/Loader';

type WPPageAcf = {
  cta_title: string;
  cta_content: string;
};

type WPPage = {
  title: { rendered: string };
  content: { rendered: string };
  acf?: WPPageAcf;
};

const HomePage: React.FC = () => {
  const [featuredPost, setFeaturedPost] = useState<WordPressPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<WordPressPost[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<WordPressEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ctaPage, setCtaPage] = useState<WPPage | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsLoading(true);
      try {
        const [{ posts }, { events }, page] = await Promise.all([
          fetchPosts(1, 5),
          fetchEvents(1, 1),
          fetchPageBySlug('homepage'),
        ]);

        if (posts.length > 0) {
          setFeaturedPost(posts[0]);
          setRecentPosts(posts.slice(1, 5));
        }

        if (events.length > 0) {
          setUpcomingEvent(events[0]);
        }

        if (page && (page as any).acf?.cta_title && (page as any).acf?.cta_content) {
          setCtaPage({
            title: page.title,
            content: page.content,
            acf: {
              cta_title: (page as any).acf.cta_title,
              cta_content: (page as any).acf.cta_content,
            },
          });
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

      {/* CTA Section from WordPress */}
      {ctaPage && ctaPage.acf && (
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-3xl font-bold mb-4"
              dangerouslySetInnerHTML={{ __html: ctaPage.acf.cta_title }}
            />
            <div
              className="text-xl text-gray-300 mb-8 prose prose-invert max-w-full"
              dangerouslySetInnerHTML={{ __html: ctaPage.acf.cta_content }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;