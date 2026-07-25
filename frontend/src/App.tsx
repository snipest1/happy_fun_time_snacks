import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BlogPostForm } from './pages/admin/BlogPostForm';
import { ForgotPasswordPage } from './pages/admin/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/admin/ResetPasswordPage';
import { ChangePasswordPage } from './pages/admin/ChangePasswordPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/post/new"
            element={
              <ProtectedRoute>
                <BlogPostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/post/:id/edit"
            element={
              <ProtectedRoute>
                <BlogPostForm />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/service-areas" element={<PublicLayout><ServiceAreasPage /></PublicLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
