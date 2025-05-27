import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types/Article';
import { getArticleCover, getArticleCategory } from '../services/apiService';
import { CalendarDays, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const coverUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (featured) {
    return (
      <Link to={`/articles/${article.slug}`} className="group block">
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-white text-black rounded-full mb-3">
              {category}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:underline decoration-2 underline-offset-2">
              {article.title}
            </h3>
            <p className="text-gray-200 line-clamp-2 mb-4">
              {article.description}
            </p>
            <div className="flex items-center text-gray-300 text-sm">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span className="mr-4">{formattedDate}</span>
              {article.author && (
                <>
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/articles/${article.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {category && (
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white text-black rounded-full">
              {category}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 line-clamp-2 text-sm mb-3">
            {article.description}
          </p>
          <div className="flex items-center text-gray-500 text-xs">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span className="mr-3">{formattedDate}</span>
            {article.author && (
              <>
                <User className="h-3 w-3 mr-1" />
                <span>{article.author.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;