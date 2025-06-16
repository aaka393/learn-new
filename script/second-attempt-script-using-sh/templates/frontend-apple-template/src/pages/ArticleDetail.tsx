import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { fetchArticleBySlug, getArticleCover, getArticleCategory } from '../services/apiService';
import { Article } from '../types/Article';
import ReactMarkdown from 'react-markdown';
import AnimatedLink from '../components/ui/AnimatedLink';
import MotionDiv from '../components/ui/MotionDiv';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (!slug) return;
        const data = await fetchArticleBySlug(slug);
        console.log("data", data)
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
      <div className="flex justify-center items-center min-h-screen animated-bg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animated-bg min-h-screen">
        <div className="glass-card p-8 rounded-3xl border border-red-500/20">
          <p className="text-red-400 mb-6">{error || 'Article not found'}</p>
          <AnimatedLink 
            to="/articles" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
            variant="underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </AnimatedLink>
        </div>
      </div>
    );
  }

  const imageUrl = getArticleCover(article);
  console.log(imageUrl)
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = Math.ceil((article.markdownContent?.length || 0) / 1000);

  return (
    <article className="pt-16 pb-24 animated-bg min-h-screen">
      {/* Header */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <MotionDiv delay={0.1}>
            <AnimatedLink
              to="/articles"
              className="inline-flex items-center glass px-4 py-2 rounded-full text-slate-300 hover:text-white mb-8 transition-colors"
              variant="underline"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Articles
            </AnimatedLink>
          </MotionDiv>

          <MotionDiv delay={0.2}>
            {category && (
              <motion.span 
                className="inline-block glass px-4 py-2 rounded-full text-blue-300 text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                {category}
              </motion.span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-white">
              {article.title}
            </h1>
          </MotionDiv>
            
          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
              <div className="flex items-center glass px-3 py-2 rounded-full">
                <Calendar size={18} className="mr-2" />
                <span>{formattedDate}</span>
              </div>
              
              {article.author && (
                <div className="flex items-center glass px-3 py-2 rounded-full">
                  <User size={18} className="mr-2" />
                  <span>{article.author.name}</span>
                </div>
              )}

              <div className="flex items-center glass px-3 py-2 rounded-full">
                <Clock size={18} className="mr-2" />
                <span>{readingTime} min read</span>
              </div>

              <motion.button
                className="flex items-center glass px-3 py-2 rounded-full hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={18} className="mr-2" />
                <span>Share</span>
              </motion.button>
            </div>
          </MotionDiv>
        </div>
      </div>
      
      {/* Featured Image */}
      {article.coverMedia && (
      console.log(imageUrl),
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-16">
          <MotionDiv delay={0.4}>
            <motion.div 
              className="relative glass-card rounded-3xl overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={imageUrl} 
                alt={article.title} 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </motion.div>
          </MotionDiv>
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv delay={0.5}>
          {article.description && (
            <div className="text-xl md:text-2xl text-slate-300 mb-12 p-8 glass-card rounded-3xl border-l-4 border-blue-500">
              {article.description}
            </div>
          )}
          
          <div className="prose-dark max-w-none">
            {article.markdownContent && (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 mt-12 gradient-text">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-10 gradient-text">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-8">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-300 mb-6 leading-relaxed text-lg">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 glass-card rounded-r-3xl">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="glass px-2 py-1 rounded text-blue-300 font-mono text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="glass-card p-6 rounded-2xl overflow-x-auto my-6">
                      {children}
                    </pre>
                  ),
                }}
              >
                {article.markdownContent}
              </ReactMarkdown>
            )}
            {article.textContent && (
              <div className="text-slate-300 leading-relaxed text-lg">
                {article.textContent}
              </div>
            )}
          </div>
          
          {/* Back Link */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <AnimatedLink 
              to="/articles" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium glass px-6 py-3 rounded-full transition-colors"
              variant="underline"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Articles
            </AnimatedLink>
          </div>
        </MotionDiv>
      </div>
    </article>
  );
};

export default ArticleDetail;