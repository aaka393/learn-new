import React from 'react';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { Article } from '../types/contentTypes';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]">
      {/* Apple-style glass card background */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-xl shadow-apple-glass"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden h-40 rounded-t-3xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          {/* Category badge with glass effect */}
          <div className="absolute top-3 right-3">
            <span className="relative px-3 py-1 text-xs font-semibold text-white rounded-xl overflow-hidden">
               <div className="absolute inset-0 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-xl"></div>
              <span className="relative z-10">{article.category}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
            {article.title}
          </h3>
          
          <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed flex-1">
            {article.summary}
          </p>

          {/* Tags with glass effect */}
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="relative inline-flex items-center px-2 py-1 text-xs text-gray-700 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-xl"></div>
                <Tag size={10} className="relative z-10 mr-1" />
                <span className="relative z-10">{tag}</span>
              </span>
            ))}
          </div>

          {/* Meta information */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-white/30">
            <div className="flex items-center space-x-1">
              <User size={12} />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-purple-600 font-medium">
                <Clock size={12} />
                <span>{article.readTime}m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect ring */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl ring-1 ring-purple-500/40"></div>
      </div>
    </article>
  );
};