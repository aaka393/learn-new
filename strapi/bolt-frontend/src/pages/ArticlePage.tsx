import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug, getArticleCover, getArticleCategory } from '../services/service';
import { Article } from '../types/Article';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;
      
      try {
        const data = await fetchArticleBySlug(slug);
        setArticle(data);
        
        // Update document title
        if (data) {
          document.title = `${data.title} | Yensi Solution`;
        }
      } catch (error) {
        console.error(`Failed to load article with slug ${slug}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-6">Article not found</p>
        <Link 
          to="/articles" 
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Link>
      </div>
    );
  }

  const coverUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <header className="relative h-[50vh] md:h-[60vh] bg-gray-900">
        {coverUrl && (
          <div className="absolute inset-0">
            <img 
              src={coverUrl}
              alt={article.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>
        )}
        
        <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-12">
          <Link 
            to="/articles" 
            className="mb-4 inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
          
          {category && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-white text-black rounded-full mb-4">
              {category}
            </span>
          )}
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{article.title}</h1>
          
          {article.description && (
            <p className="text-xl text-white/90 mb-6">{article.description}</p>
          )}
          
          <div className="flex flex-wrap items-center text-white/80 text-sm gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            
            {article.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.author.name}</span>
              </div>
            )}
            
            {article.category && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>{article.category.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {article.markdownContent ? (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{article.markdownContent}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-600 italic">No content available for this article.</p>
        )}
      </article>
    </div>
  );
};

export default ArticlePage;