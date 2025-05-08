import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { WordPressEvent } from '../../types/wordpress';

interface EventCardProps {
  event: WordPressEvent;
  variant?: 'default' | 'featured';
}

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Extract image URL from _embedded
  const featuredImage = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg'; // Default image

  // Helper to limit excerpt length
  const truncateExcerpt = (excerpt: string, length = 120) => {
    // Remove HTML tags
    const strippedExcerpt = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    if (strippedExcerpt.length <= length) return strippedExcerpt;
    return strippedExcerpt.substring(0, length) + '...';
  };

  // Use custom meta fields for event date and location, or fallback to defaults
  const eventDate = event.meta.event_date ? event.meta.event_date : event.date;
  const eventLocation = event.meta.event_location || 'Online';

  if (variant === 'featured') {
    return (
      <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="md:flex">
          <div className="md:w-2/5">
            <div className="relative h-64 md:h-full">
              <img 
                src={featuredImage} 
                alt={event.title.rendered} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
            </div>
          </div>
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full mb-3">
              Featured Event
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              <Link to={`/events/${event.slug}`}>
                {event.title.rendered}
              </Link>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mb-3 space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                <span>{formatDate(eventDate)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                <span>{eventLocation}</span>
              </div>
            </div>
            <div 
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: truncateExcerpt(event.excerpt.rendered, 180) }}
            ></div>
            <div className="mt-auto">
              <Link 
                to={`/events/${event.slug}`}
                className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Event Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={featuredImage} 
          alt={event.title.rendered} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 px-3 py-1 bg-orange-500 text-white text-sm font-medium">
          Event
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/events/${event.slug}`}>
            {event.title.rendered}
          </Link>
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mb-3 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
            <span>{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-orange-500" />
            <span>{eventLocation}</span>
          </div>
        </div>
        <div 
          className="text-gray-600 mb-4"
          dangerouslySetInnerHTML={{ __html: truncateExcerpt(event.excerpt.rendered) }}
        ></div>
        <div className="flex justify-end mt-4">
          <Link 
            to={`/events/${event.slug}`}
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Event Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;