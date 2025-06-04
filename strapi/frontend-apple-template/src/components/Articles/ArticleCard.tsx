import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Article } from '../../types/Article';
import { getArticleCover, getArticleCategory } from '../../services/apiService';
import { Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  const imageUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div 
      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/articles/${article.slug}`} className="block overflow-hidden">
        <div className="relative h-56 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
            {category}
          </div>
        </div>
      </Link>
      
      <div className="p-6 flex-grow flex flex-col">
        <Link to={`/articles/${article.slug}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
          {article.description || 'Read this article to learn more...'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
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
      </div>
    </motion.div>
  );
};

export default ArticleCard;