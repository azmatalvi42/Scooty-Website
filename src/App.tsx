import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

import { MotionConfig } from 'framer-motion';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Projects } from './components/sections/Projects';
import { About } from './components/sections/About';
import { ChatbotDemo } from './components/sections/ChatbotDemo';
import { RidersPage } from './pages/RidersPage';
import { RiderDetailPage } from './pages/RiderDetailPage';
import { PartnersPage } from './pages/PartnersPage';
import { ProductPage } from './pages/ProductPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { CityPage } from './pages/CityPage';
import { AboutPage } from './pages/AboutPage';
import { RideLogPage } from './pages/RideLogPage';
import { BlogPostPage } from './pages/BlogPostPage';
const HomePage = () => (
  <>
    <Hero />
    <Services />
    <ChatbotDemo />
    <Projects />
    <About />
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <Router>
        <ScrollToTop />
        <div className="editorial-shell min-h-screen">
          <Navbar />

          <main className="relative" style={{ zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/riders" element={<RidersPage />} />
              <Route path="/riders/:topic" element={<RiderDetailPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/partners/:city" element={<CityPage />} />
              <Route path="/products/:productSlug" element={<ProductPage />} />
              <Route path="/technology" element={<TechnologyPage />} />
              <Route path="/blog" element={<RideLogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<AboutPage />} />

              <Route path="*" element={
                <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-black rounded-lg hover:bg-primary-400 transition-colors font-semibold"
                    >
                      <span>Go Home</span>
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
          </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
