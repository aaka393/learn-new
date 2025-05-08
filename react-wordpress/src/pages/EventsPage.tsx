import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import { WordPressEvent, PaginationInfo } from '../types/wordpress';
import EventCard from '../components/events/EventCard';
import Pagination from '../components/posts/Pagination';
import Loader from '../components/common/Loader';
import { Calendar } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<WordPressEvent[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await fetchEvents(page, 6);
      setEvents(result.events);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    loadEvents(1);
  }, []);

  const handlePageChange = (page: number) => {
    loadEvents(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-10 pb-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            Check out our upcoming events and gatherings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <Loader message="Loading events..." />
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => loadEvents(pagination.currentPage)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No events found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;