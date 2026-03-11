import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CustomCursor } from './components/ui/CustomCursor';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Services } from './components/sections/Services';
import { Projects } from './components/sections/Projects';
import { Team } from './components/sections/Team';
import { Contact } from './components/sections/Contact';
import { ChatbotDemo } from './components/sections/ChatbotDemo';
import { RidersPage } from './pages/RidersPage';
import { RiderDetailPage } from './pages/RiderDetailPage';
import { PartnersPage } from './pages/PartnersPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { CityPage } from './pages/CityPage';

const HomePage = () => (
  <>
    <Hero />
    <Services />
    <ChatbotDemo />
    <Projects />
    <About />
    <Team />
    <Contact />
  </>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
          <CustomCursor />
          <ParticleBackground />

          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/riders" element={<RidersPage />} />
              <Route path="/riders/:topic" element={<RiderDetailPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/partners/:city" element={<CityPage />} />
              <Route path="/technology" element={<TechnologyPage />} />
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
