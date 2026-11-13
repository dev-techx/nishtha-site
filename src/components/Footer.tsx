import { Instagram, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="wood-bg pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <BookOpen size={24} className="text-library-gold-light" strokeWidth={1.5} />
          <span className="font-serif-display text-2xl font-bold text-library-cream tracking-wide">
            NISHTHA
          </span>
        </div>

        <div className="gold-divider mx-auto w-32 mb-6" />

        {/* Copyright */}
        <p className="font-ui text-xs text-center text-white/65 leading-relaxed max-w-3xl mx-auto">
          © {new Date().getFullYear()} NISHTHA. All rights reserved. All content published on this
          platform is the intellectual property of NISHTHA and is protected under the Information
          Technology Act, 2000, and applicable copyright laws. Unauthorized reproduction,
          distribution, or modification of any content without prior written consent is strictly
          prohibited and may attract penal action under relevant IT and cyber law provisions.
        </p>

        <div className="mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://instagram.com/techx.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-ui text-sm text-library-gold-light hover:text-library-gold transition-smooth"
          >
            <Instagram size={16} strokeWidth={2} />
            Developed by @techx.sh
          </a>
        </div>
      </div>
    </footer>
  );
}
