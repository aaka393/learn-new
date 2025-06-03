import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticlePage from './pages/ArticlePage';
import About from './pages/About';
import Author from './pages/Author';
import Gallery from './pages/Gallery';
import AlbumGallery from './components/Album/AlbumGallery';
import { clarity } from 'react-microsoft-clarity';

function App() {
   clarity.init('o1ckozw510')
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/author" element={<Author />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/album" element={<AlbumGallery />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;