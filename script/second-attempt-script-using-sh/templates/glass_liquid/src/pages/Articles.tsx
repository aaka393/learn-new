import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchArticles, getArticleCover, getArticleCategory } from '../services/apiService';
import { Article } from '../types/Article';
import { Calendar, User, ArrowRight, Search, Filter, Clock, BookOpen, Sparkles } from 'lucide-react';
import AnimatedLink from '../components/ui/AnimatedLink';
import HoverImage from '../components/ui/HoverImage';
import MotionDiv from '../components/ui/MotionDiv';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);

        const uniqueCategories = Array.from(new Set(
          data
            .filter(article => article.category)
            .map(article => article.category?.name)
        )) as string[];

        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = articles
    .filter(article => {
      const matchesCategory = activeFilter === 'all' || article.category?.name === activeFilter;
      const matchesSearch = searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen animated-bg">
        <div className="relative">
          <motion.div
            className="w-20 h-20 glass rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-20 h-20 glass-strong rounded-full absolute top-0 left-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20 blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animated-bg min-h-screen">
        <div className="glass-card p-8 rounded-3xl border border-red-200">
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 animated-bg min-h-screen">
      {/* Enhanced Header */}
      <div className="relative py-32 md:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <MotionDiv delay={0.1}>
            <motion.div
              className="inline-flex items-center glass px-6 py-3 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="text-gray-600 mr-3" size={24} />
              <span className="text-gray-700 font-semibold">Knowledge Hub</span>
            </motion.div>
          </MotionDiv>

          <MotionDiv delay={0.2}>
            <h1 className="text-display font-bold mb-8 gradient-text-subtle">
              Articles & Insights
            </h1>
          </MotionDiv>

          <MotionDiv delay={0.3}>
            <div className="glass-card p-8 rounded-3xl max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Discover cutting-edge insights, expert perspectives, and innovative solutions
                that shape the future of technology and development.
              </p>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <MotionDiv delay={0.4}>
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-12">
            {/* Enhanced Search Bar */}
            <div className="relative w-full lg:w-96">
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                whileHover={{ scale: 1.1 }}
              >
                <Search size={24} />
              </motion.div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 glass-card rounded-2xl text-gray-800 placeholder-gray-500 border border-white/20 focus:border-white/40 focus:outline-none transition-all duration-300 text-lg input-glass"
              />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
              />
            </div>

            {/* Enhanced Category Filters */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-gray-600 mr-2">
                  <Filter size={20} className="mr-2" />
                  <span className="font-medium">Filter:</span>
                </div>

                <motion.button
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === 'all'
                      ? 'btn-primary-glass'
                      : 'glass text-gray-600 hover:text-gray-800 border border-white/20 hover:border-white/40'
                    }`}
                  onClick={() => setActiveFilter('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Articles
                </motion.button>

                {categories.map((category, index) => (
                  <motion.button
                    key={index}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === category
                        ? 'btn-primary-glass'
                        : 'glass text-gray-600 hover:text-gray-800 border border-white/20 hover:border-white/40'
                      }`}
                    onClick={() => setActiveFilter(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </MotionDiv>
      </div>

      {/* Enhanced Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            <motion.div
              key={`${activeFilter}-${searchTerm}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="glass-card p-16 rounded-3xl max-w-lg mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-6 text-gray-400"
                >
                  <Search size={64} />
                </motion.div>
                <p className="text-gray-600 text-2xl mb-6 font-medium">
                  No articles found
                </p>
                <p className="text-gray-500 text-lg">
                  Try adjusting your search or filter criteria to discover more content.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => {
  const imageUrl = getArticleCover(article);
  const category = getArticleCategory(article);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = Math.ceil((article.markdownContent?.length || 0) / 1000);

  return (
    <motion.div
      className="group glass-card rounded-3xl overflow-hidden hover-lift card-hover h-full flex flex-col relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Enhanced image section */}
      <div className="relative h-72 overflow-hidden">
        <AnimatedLink to={`/articles/${article.slug}`} className="block w-full h-full">
          <HoverImage
            src={imageUrl}
            alt={article.title}
            className="w-full h-full"
          />
        </AnimatedLink>

        {/* Enhanced Category Badge */}
        <motion.div
          className="absolute top-6 left-6 glass px-4 py-2 rounded-full backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-gray-700 text-sm font-semibold flex items-center">
            <Sparkles size={14} className="mr-2" />
            {category}
          </span>
        </motion.div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <AnimatedLink
          to={`/articles/${article.slug}`}
          className="block mb-6"
          variant="scale"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-all duration-300 line-clamp-2 leading-tight">
            {article.title}
          </h3>
        </AnimatedLink>

        <p className="text-gray-600 mb-8 line-clamp-3 flex-grow leading-relaxed text-base">
          {article.description || 'Discover insights and expert perspectives in this comprehensive article...'}
        </p>

        {/* Enhanced metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 space-x-4">
          <div className="flex items-center glass px-3 py-2 rounded-full">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span className='text-gray-600'>{formattedDate}</span>
          </div>

          <div className="flex items-center glass px-3 py-2 rounded-full">
            <Clock size={16} className="mr-2 text-gray-400" />
            <span className='text-gray-600'>{readingTime} min</span>
          </div>
        </div>

        {article.author && (
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center glass px-3 py-2 rounded-full">
              <User size={16} className="mr-2 text-gray-400" />
              <span className='text-gray-600'>{article.author.name}</span>
            </div>
          </div>
        )}

        {/* Enhanced read more section */}
        <motion.div
          className="pt-6 border-t border-white/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AnimatedLink
            to={`/articles/${article.slug}`}
            className="inline-flex items-center text-gray-600 font-semibold group-hover:text-gray-800 transition-colors text-lg"
            variant="underline"
          >
            Read Article
            <motion.div
              className="ml-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </AnimatedLink>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Articles;