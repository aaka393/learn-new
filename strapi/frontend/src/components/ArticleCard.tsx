import React from 'react';
import { Article } from '../types/Article';
import { format } from 'date-fns';
import { Link } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const baseUrl = 'http://localhost:1337';
  const cover = article.cover?.formats?.medium?.url ? `${baseUrl}${article.cover.formats.medium.url}` :
    article.cover?.formats?.small?.url ? `${baseUrl}${article.cover.formats.small.url}` :
    'https://source.unsplash.com/random/400x300'; // Fallback image
  const category = article.category?.name || 'Uncategorized';

  const formattedDate = format(new Date(article.publishedAt), 'MMM dd, yyyy');

  return (
    <div className="rounded-2xl shadow-md p-4 m-4 flex flex-col h-full">
      <img
        src={cover}
        alt={article.title}
        className="rounded-t-2xl h-48 w-full object-cover mb-4"
      />
      <div className="flex-grow">
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-4">{article.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">{category}</span>
        <span className="text-gray-500">{formattedDate}</span>
      </div>
      <a href={`/article/${article.slug}`} className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
        Read More
        <Link className="ml-2 h-4 w-4" />
      </a>
    </div>
  );
};

export default ArticleCard;
