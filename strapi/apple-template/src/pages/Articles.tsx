import React, { useState, useEffect } from 'react';
import { fetchArticles } from '../services/apiService';
import { Article } from '../types/Article';
import ArticleCard from '../components/Articles/ArticleCard';
import { motion } from 'framer-motion';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          data
            .filter(article => article.category)
            .map(article => article.category?.name)
        )) as string[];
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = activeFilter === 'all' 
  ? articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())  
  : articles.filter(article => article.category?.name === activeFilter)
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()); 


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Articles & Insights
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay updated with the latest trends, technologies, and insights from our experts.
          </motion.p>
        </div>
      </div>
      
      {/* Filters */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <motion.div 
            className="flex flex-wrap items-center justify-center space-x-2 space-y-2 md:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } transition-colors`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            
            {categories.map((category, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      )}
      
      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;