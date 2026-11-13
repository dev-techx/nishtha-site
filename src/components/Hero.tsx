import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#101c2c]">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 py-28 text-left">
        <div className="hero-kicker mb-7">Independent knowledge · Public policy · Governance</div>
        <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white mb-8 animate-fade-in-up">
          NISHTHA<span className="text-[#d4ad68]">.</span>
        </h1>
        <div className="h-px w-20 bg-[#d4ad68] mb-8" />
        <p className="max-w-2xl text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light mb-6">
          Neutrality. Integrity. Stability. Transparency.
          <span className="block text-white/75">Honesty. Accountability.</span>
        </p>
        <p className="max-w-xl text-base sm:text-lg leading-8 text-white/70 mb-10">
          Credible knowledge and constructive dialogue connecting public policy,
          administrative practice, and informed public engagement.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('articles')} className="hero-button-primary">
            Explore articles <ArrowRight size={17} />
          </button>
          <button onClick={() => onNavigate('about')} className="hero-button-secondary">
            About NISHTHA
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f8fa] to-transparent" />
    </section>
  );
}
