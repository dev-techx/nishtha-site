import { BookOpen, ScrollText, Library } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background library image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Library"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20 pb-12">
        <div className="animate-fade-in delay-0">
          <Library
            size={56}
            className="mx-auto text-library-gold-light mb-6"
            strokeWidth={1}
          />
        </div>

        <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-library-cream mb-4 animate-fade-in-up delay-1">
          NISHTHA
        </h1>

        <div className="gold-divider mx-auto w-48 my-6 animate-fade-in delay-2" />

        <p className="font-body text-lg sm:text-xl md:text-2xl text-library-cream/90 italic mb-2 animate-fade-in-up delay-2">
          Neutrality, Integrity, Stability, Transparency,
        </p>
        <p className="font-body text-lg sm:text-xl md:text-2xl text-library-cream/90 italic mb-8 animate-fade-in-up delay-3">
          Honesty and Accountability
        </p>

        <p className="font-body text-base sm:text-lg text-library-cream/80 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-4">
          A space for credible knowledge, constructive dialogue, and informed public engagement.
          Bridging the gap between policy formulation, administrative practice, and public understanding.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-5">
          <button
            onClick={() => onNavigate('articles')}
            className="btn-gold flex items-center gap-2"
          >
            <BookOpen size={18} strokeWidth={2} />
            Browse Articles
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="btn-outline text-library-cream border-library-cream/40 hover:bg-library-cream hover:text-library-wood-dark"
          >
            <span className="flex items-center gap-2">
              <ScrollText size={18} strokeWidth={2} />
              About Us
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-5">
        <div className="w-6 h-10 border-2 border-library-cream/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-library-cream/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
