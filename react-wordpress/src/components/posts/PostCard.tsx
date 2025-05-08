import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { WordPressPost } from '../../types/wordpress';

interface PostCardProps {
  post: WordPressPost;
  variant?: 'default' | 'featured' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Extract image URL from _embedded
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
    'https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg'; // Default image

  // Helper to limit excerpt length
  const truncateExcerpt = (excerpt: string, length = 120) => {
    // Remove HTML tags
    const strippedExcerpt = excerpt.replace(/<\/?[^>]+(>|$)/g, "");
    if (strippedExcerpt.length <= length) return strippedExcerpt;
    return strippedExcerpt.substring(0, length) + '...';
  };

  // Extract author name if available
  const authorName = post._embedded?.author?.[0]?.name || 'Anonymous';

  if (variant === 'featured') {
    return (
      <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full">
              <img 
                src={featuredImage} 
                alt={post.title.rendered} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
            </div>
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(post.date)}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              <Link to={`/posts/${post.slug}`}>
                {post.title.rendered}
              </Link>
            </h2>
            <div 
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: truncateExcerpt(post.excerpt.rendered, 180) }}
            ></div>
            <div className="mt-auto">
              <Link 
                to={`/posts/${post.slug}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="group flex bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
        <div className="w-1/3 h-24">
          <img 
            src={featuredImage} 
            alt={post.title.rendered} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            <Link to={`/posts/${post.slug}`}>
              {post.title.rendered}
            </Link>
          </h3>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(post.date)}</span>
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
          alt={post.title.rendered} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(post.date)}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/posts/${post.slug}`}>
            {post.title.rendered}
          </Link>
        </h2>
        <div 
          className="text-gray-600 mb-4"
          dangerouslySetInnerHTML={{ __html: truncateExcerpt(post.excerpt.rendered) }}
        ></div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">By {authorName}</span>
          <Link 
            to={`/posts/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;