import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RepairPage from './pages/RepairPage';

function App() {
  React.useEffect(() => {
    document.title = 'VendTech | Smart Vending Solutions';
    const titleElement = document.querySelector('title[data-default]');
    if (titleElement) {
      titleElement.removeAttribute('data-default');
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repair" element={<RepairPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

