import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, User, BookOpen } from 'lucide-react';
import { fetchAuthorData, fetchArticles } from '../services/apiService';
import { Article } from '../types/Article';
import { baseUrl } from '../constants/appConstants';
import MotionDiv from '../components/ui/MotionDiv';
import HoverImage from '../components/ui/HoverImage';
import AnimatedLink from '../components/ui/AnimatedLink';

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
    return <p className="text-center text-slate-400">This author has not provided a bio.</p>;
  }

  // Try rendering structured bio
  try {
    return author.bio.map((block, index) => {
      if (block.type === 'paragraph' && Array.isArray(block.children)) {
        const text = block.children.map((child) => child.text).join('');
        return (
          <p key={index} className="text-center text-slate-300 mb-2 leading-relaxed">
            {text}
          </p>
        );
      } else {
        // If the block doesn't match expected structure, try to stringify
        return (
          <p key={index} className="text-center text-slate-400 italic mb-2">
            {JSON.stringify(block)}
          </p>
        );
      }
    });
  } catch (error) {
    console.warn('Error parsing author bio:', error);
    return (
      <p className="text-center text-slate-400 italic">
        Unable to render bio content correctly.
      </p>
    );
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg">
        <div className="glass-card p-8 rounded-3xl">
          <p className="text-slate-400">Author information not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 animated-bg min-h-screen">
      {/* Header */}
      <header className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative">
          <MotionDiv delay={0.1}>
            <div className="relative w-40 h-40 mb-8 overflow-hidden rounded-full">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              <HoverImage
                src={getImageUrl(author.avatar?.url ?? '')}
                alt={author.name}
                className="relative w-full h-full rounded-full border-4 border-white/20"
              />
            </div>
          </MotionDiv>

          <MotionDiv delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text">{author.name}</h1>
          </MotionDiv>

          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 mb-8">
              <div className="flex items-center glass px-4 py-2 rounded-full">
                <Mail className="h-5 w-5 mr-2" />
                <a 
                  href={`mailto:${author.email}`} 
                  className="hover:text-blue-400 transition-colors"
                >
                  {author.email}
                </a>
              </div>
              <div className="flex items-center glass px-4 py-2 rounded-full">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>{articles.length} Articles Published</span>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv delay={0.4}>
            <div className="max-w-2xl">{renderBio()}</div>
          </MotionDiv>
        </div>
      </header>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <MotionDiv delay={0.5}>
          <div className="flex items-center justify-center mb-12">
            <User className="text-blue-400 mr-3" size={32} />
            <h2 className="text-4xl md:text-5xl font-black gradient-text">
              Articles by {author.name}
            </h2>
          </div>
        </MotionDiv>

        {articles.length === 0 ? (
          <MotionDiv delay={0.6}>
            <div className="text-center py-20">
              <div className="glass-card p-12 rounded-3xl max-w-md mx-auto">
                <p className="text-slate-400 text-xl mb-4">
                  No articles available from this author yet.
                </p>
                <p className="text-slate-500">
                  Check back soon for new content!
                </p>
              </div>
            </div>
          </MotionDiv>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                className="group glass-card rounded-3xl overflow-hidden hover-lift card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <div className="p-8">
                  <AnimatedLink
                    to={`/articles/${article.slug}`}
                    className="block"
                    variant="scale"
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                  </AnimatedLink>
                  
                  <p className="text-slate-400 mb-4 line-clamp-3 group-hover:text-slate-300 transition-colors">
                    {article.description || 'Read this article to learn more...'}
                  </p>
                  
                  <div className="flex items-center text-sm text-slate-500 pt-4 border-t border-white/10">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Author;