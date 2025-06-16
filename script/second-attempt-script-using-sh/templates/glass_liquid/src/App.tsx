import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BlogCard } from './components/BlogCard';
import { ArticleCard } from './components/ArticleCard';
import { BlogPage } from './pages/Blog';
import { ArticlesPage } from './pages/Articles';
import { useUIStore } from './store/uiStore';
import { blogService } from './services/blogService';
import { Blog, Article } from './types/contentTypes';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

function App() {
  const { activeSection } = useUIStore();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [blogsData, articlesData] = await Promise.all([
          blogService.getBlogs(),
          blogService.getArticles()
        ]);
        setBlogs(blogsData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Render different pages based on active section
  if (activeSection === 'blog') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <BlogPage />
        <Footer />
      </div>
    );
  }

  if (activeSection === 'articles') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <ArticlesPage />
        <Footer />
      </div>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 animate-pulse"></div>
            <Sparkles className="relative text-blue-500 mx-auto" size={48} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Liquid Glass
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Design Blog
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Where design meets technology in perfect harmony. Explore the future of 
            glassmorphism and modern web experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => useUIStore.getState().setActiveSection('blog')}
              className="group relative px-8 py-4 rounded-2xl font-semibold text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 overflow-hidden"
            >
              {/* Apple-style glass background */}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-xl shadow-apple-glass"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="relative z-10">Explore Blogs</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => useUIStore.getState().setActiveSection('articles')}
              className="group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 overflow-hidden"
            >
              {/* Gradient background with glass effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 shadow-apple-glass"></div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="relative z-10">Read Articles</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading content...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Blogs Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Blogs
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Dive into our latest thoughts on design, technology, and digital experiences
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </section>

          {/* Recent Articles Section */}
          <section className="py-20 relative">
            {/* Glass section background */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Technical Articles
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Deep technical insights, tutorials, and development best practices
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;