import React, { useState, useEffect } from 'react';
import { fetchAuthorData, fetchArticles } from '../services/apiService';
import { Article } from '../types/Article';
import ArticleCard from '../components/Articles/ArticleCard';
import { Mail } from 'lucide-react';
import { baseUrl } from '../constants/appConstants';

interface AuthorData {
  id: number;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  bio?: {
    type: string;
    children: {
      type: string;
      text: string;
    }[];
  }[];
}

const Author: React.FC = () => {
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authorData = await fetchAuthorData();
        setAuthor(authorData);

        const allArticles = await fetchArticles();
        const authorArticles = allArticles.filter(
          (article) => article.author && article.author.id === authorData.id
        );
        setArticles(authorArticles);

        document.title = `${authorData.name} | Yensi Solution`;
      } catch (error) {
        console.error('Failed to load author data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getImageUrl = (url: string) => {
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  const renderBio = () => {
    if (!author?.bio || author.bio.length === 0) {
      return <p className="text-center text-gray-600">This author has not provided a bio.</p>;
    }

    return author.bio.map((block, index) => {
      if (block.type === 'paragraph') {
        const text = block.children.map((child) => child.text).join('');
        return (
          <p key={index} className="text-center text-gray-600 mb-2">
            {text}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Author information not available.</p>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      <header className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-300 mb-6 overflow-hidden">
            <img
              src={getImageUrl(author.avatar?.url ?? '')}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">{author.name}</h1>
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${author.email}`} className="hover:text-blue-600 transition-colors">
              {author.email}
            </a>
          </div>
          <div className="mt-6 max-w-2xl">{renderBio()}</div>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Articles by {author.name}</h2>
        {articles.length === 0 ? (
          <p className="text-gray-600">No articles available from this author.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Author;