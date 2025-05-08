import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPageBySlug } from '../services/api';
import PageContent from '../components/common/PageContent';
import Loader from '../components/common/Loader';

const StaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPage = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const pageData = await fetchPageBySlug(slug);
        setPage(pageData);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Failed to load the page. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPage();
  }, [slug]);

  // Redirect to 404 page if page not found
  useEffect(() => {
    if (!isLoading && !page && !error) {
      navigate('/not-found', { replace: true });
    }
  }, [isLoading, page, error, navigate]);

  if (isLoading) {
    return <Loader message="Loading page..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!page) {
    return null; // Will be redirected by the effect above
  }

  return <PageContent page={page} />;
};

export default StaticPage;