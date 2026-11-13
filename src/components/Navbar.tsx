import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Lock } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  onAdminClick: () => void;
}

export default function Navbar({ onNavigate, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'About', section: 'about' },
    { label: 'Articles', section: 'articles' },
    { label: 'Newsletter', section: 'newsletter' },
  ];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          scrolled
            ? 'wood-bg shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 group"
          >
            <BookOpen
              size={28}
              className={scrolled ? 'text-library-gold-light' : 'text-library-cream'}
              strokeWidth={1.5}
            />
            <span
              className={`font-serif-display text-2xl font-bold tracking-wide transition-smooth ${
                scrolled ? 'text-library-cream' : 'text-library-cream'
              }`}
            >
              NISHTHA
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className={`font-ui text-sm font-medium tracking-wide transition-smooth hover:text-library-gold-light ${
                  scrolled ? 'text-library-cream' : 'text-library-cream/90'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 font-ui text-sm font-medium text-library-gold-light hover:text-library-gold transition-smooth"
            >
              <Lock size={14} strokeWidth={2} />
              Admin
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden ${scrolled ? 'text-library-cream' : 'text-library-cream'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 wood-bg mobile-menu-enter pt-20 pb-6 px-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="font-ui text-lg font-medium text-library-cream text-left py-2 border-b border-library-wood-light/20 hover:text-library-gold-light transition-smooth"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 font-ui text-lg font-medium text-library-gold-light text-left py-2 mt-2"
            >
              <Lock size={16} strokeWidth={2} />
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
