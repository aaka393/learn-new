import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Blog } from '../types/contentTypes';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]">
      {/* Apple-style glass card background */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-xl shadow-apple-glass"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

          {/* Tags overlay with glass effect */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="relative px-3 py-1 text-xs font-medium overflow-hidden text-white rounded-xl shadow-[0_0_8px_0_rgba(0,0,0,0.15)]"
              >
                <div className="absolute inset-0 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-xl"></div>

                <span className="relative z-10 rounded-xl">{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
            {blog.title}
          </h2>

          <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
            {blog.summary}
          </p>

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-blue-600 font-medium">
              <Clock size={14} />
              <span>{blog.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect ring */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl ring-2 ring-blue-500/30"></div>
      </div>
    </article >
  );
};