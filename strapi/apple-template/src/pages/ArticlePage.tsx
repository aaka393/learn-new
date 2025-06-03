import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug, getArticleCover, getArticleCategory } from '../services/apiService';
import { Article } from '../types/Article';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (!slug) return;
        const data = await fetchArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Article not found'}</p>
        </div>
        <div className="mt-6">
          <Link 
            to="/articles" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="pt-16 pb-24">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {category && (
              <span className="inline-block bg-blue-500 text-white text-sm px-3 py-1 rounded-full mb-4">
                {category}
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center text-gray-300 space-x-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formattedDate}</span>
              </div>
              
              {article.author && (
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>{article.author.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Featured Image */}
      {article.coverMedia && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
          <motion.div 
            className="relative rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src={imageUrl} 
              alt={article.title} 
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {article.description && (
            <div className="text-xl text-gray-600 mb-8 border-l-4 border-blue-500 pl-4 py-2">
              {article.description}
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            {article.markdownContent && (
              <ReactMarkdown>
                {article.markdownContent}
              </ReactMarkdown>
            )}
            {article.textContent && <div>{article.textContent}</div>}
          </div>
          
          {/* Back Link */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link 
              to="/articles" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Articles
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  );
};

export default ArticlePage;