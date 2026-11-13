import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ArticleShelf from '@/components/ArticleShelf';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

type View = 'website' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [view, setView] = useState<View>('website');

  useEffect(() => {
    if (sessionStorage.getItem('nishta_admin') === 'authenticated') {
      // Keep admin session if returning
    }
  }, []);

  const handleNavigate = (section: string) => {
    if (view !== 'website') {
      setView('website');
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAdminClick = () => {
    if (sessionStorage.getItem('nishta_admin') === 'authenticated') {
      setView('admin-dashboard');
    } else {
      setView('admin-login');
    }
  };

  const handleAdminSuccess = () => {
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nishta_admin');
    setView('website');
  };

  const handleBack = () => {
    setView('website');
  };

  if (view === 'admin-login') {
    return <AdminLogin onSuccess={handleAdminSuccess} onBack={handleBack} />;
  }

  if (view === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen library-bg">
      <Navbar onNavigate={handleNavigate} onAdminClick={handleAdminClick} />
      <Hero onNavigate={handleNavigate} />
      <About />
      <ArticleShelf />
      <Newsletter />
      <Footer />
    </div>
  );
}
