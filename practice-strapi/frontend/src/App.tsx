import { useState, useEffect } from 'react';
import { Article } from './types/Article';
import { Loader2, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchArticles } from './services/service';

import Home from './components/Home';
import Articles from './components/Articles';
import About from './components/About';
import Author from './components/Author';
import ArticlePage from './components/ArticlePage';
import Gallery from './components/Gallery';
import { ContactPage } from './components/ContactPage';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load articles. Please try again.');
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="inline-block animate-spin text-blue-500 h-8 w-8 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="inline-block text-red-500 h-8 w-8 mb-2" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles articles={articles} />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/author" element={<Author />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
