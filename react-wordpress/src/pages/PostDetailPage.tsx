import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostBySlug, fetchPosts } from '../services/api';
import { WordPressPost } from '../types/wordpress';
import PostCard from '../components/posts/PostCard';
import Loader from '../components/common/Loader';
import { Calendar, User, Tag } from 'lucide-react';

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const postData = await fetchPostBySlug(slug);
        setPost(postData);
        
        // Fetch related posts (this is a simplified approach)
        const { posts } = await fetchPosts(1, 3);
        // Filter out the current post
        const filtered = posts.filter(p => postData && p.id !== postData.id);
        setRelatedPosts(filtered.slice(0, 3));
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load the post. Please try again later.');
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };
    
    loadPost();
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
    return <Loader message="Loading post..." />;
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error || 'Post not found'}</p>
        <Link
          to="/posts"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  // Extract featured image
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
    'https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg'; // Default image

  // Extract author info
  const author = post._embedded?.author?.[0] || { name: 'Anonymous' };
  const authorAvatar = author.avatar_urls?.['96'] || 'https://via.placeholder.com/96';

  return (
    <div className="bg-white">
      {/* Featured image banner */}
      <div 
        className="w-full h-64 md:h-96 bg-center bg-cover" 
        style={{ backgroundImage: `url(${featuredImage})` }}
      >
        <div className="w-full h-full flex items-end bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            ></h1>
            <div className="flex flex-wrap items-center text-sm mt-4 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{author.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="md:w-8/12">
            <article className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                className="wp-content"
              ></div>
            </article>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-2 ml-2">
                    {post.tags.map(tag => (
                      <Link 
                        to={`/tag/${tag}`}
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Tag {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Author bio */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <img 
                  src={authorAvatar} 
                  alt={author.name} 
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{author.name}</h3>
                  <p className="text-gray-600">Author</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-4/12 mt-8 md:mt-0">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Posts</h3>
              {relatedPosts.length > 0 ? (
                <div className="space-y-4">
                  {relatedPosts.map(post => (
                    <PostCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No related posts found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
        <Link 
          to="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default PostDetailPage;