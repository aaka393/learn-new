import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../services/api';
import { WordPressPost, PaginationInfo } from '../types/wordpress';
import PostCard from '../components/posts/PostCard';
import Pagination from '../components/posts/Pagination';
import Loader from '../components/common/Loader';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await fetchPosts(page, 9);
      setPosts(result.posts);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const handlePageChange = (page: number) => {
    loadPosts(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-10 pb-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-lg text-gray-600">
            Latest updates, news, and articles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <Loader message="Loading posts..." />
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => loadPosts(pagination.currentPage)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default PostsPage;