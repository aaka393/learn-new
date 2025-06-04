import React, { useState, useEffect } from 'react';
import { fetchArticles } from '../services/service';
import { Article } from '../types/Article';
import ArticleCard from '../components/ArticleCard';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{id: number, name: string, slug: string}[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
        
        // Extract unique categories
        const uniqueCategories = data.reduce((acc: {id: number, name: string, slug: string}[], article) => {
          if (article.category && !acc.some(cat => cat.id === article.category?.id)) {
            acc.push(article.category);
          }
          return acc;
        }, []);
        
        setCategories(uniqueCategories);
        document.title = 'Articles | Yensi Solution';
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Filter articles based on selected category
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category?.slug === selectedCategory);

  return (
    <div className="pt-16 md:pt-20">
      <header className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Articles</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Insights, tutorials, and updates from our team
          </p>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.slug 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found in this category.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {selectedCategory === 'all' && filteredArticles.length > 0 && (
              <div className="mb-16">
                <ArticleCard article={filteredArticles[0]} featured={true} />
              </div>
            )}
            
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'all' ? filteredArticles.slice(1) : filteredArticles).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Articles;