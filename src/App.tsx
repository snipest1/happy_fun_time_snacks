import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';

function App() {
  React.useEffect(() => {
    document.title = 'Happy Fun Time Snacks | Premium Smart Vending';
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
