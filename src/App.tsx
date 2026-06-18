import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Only true on desktop-sized screens (>= 1024px). Used to skip the
// background animation on mobile/tablet so its canvas loop never runs there.
const useIsDesktop = () => {
  const query = '(min-width: 1024px)';
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    setIsDesktop(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
};
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { NetworkCanvas } from './components/ui/NetworkCanvas';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RidersPage } from './pages/RidersPage';
import { RiderDetailPage } from './pages/RiderDetailPage';
import { PartnersPage } from './pages/PartnersPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { CityPage } from './pages/CityPage';
import { AboutPage } from './pages/AboutPage';
import { RideLogPage } from './pages/RideLogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { Demo3DPage } from './pages/Demo3DPage';
import { HeroLabPage } from './pages/HeroLabPage';
import { HomePage } from './pages/HomePage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
          {isDesktop && <NetworkCanvas />}

          <Navbar />

          <main className="relative" style={{ zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/riders" element={<RidersPage />} />
              <Route path="/riders/:topic" element={<RiderDetailPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/partners/:city" element={<CityPage />} />
              <Route path="/technology" element={<TechnologyPage />} />
              <Route path="/blog" element={<RideLogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/demo-3d" element={<Demo3DPage />} />
              <Route path="/hero-lab" element={<HeroLabPage />} />

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
    </ErrorBoundary>
  );
}

export default App;
