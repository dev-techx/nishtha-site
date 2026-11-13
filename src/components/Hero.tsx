import { ArrowRight } from 'lucide-react';

interface HeroProps { onNavigate: (section: string) => void; }

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[min(680px,calc(100vh-76px))] flex items-center overflow-hidden bg-[#101c2c]">
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-20 md:py-24">
        <p className="hero-kicker mb-6">Independent knowledge · Public policy · Governance</p>
        <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white mb-7">NISHTHA<span className="text-[#d4ad68]">.</span></h1>
        <div className="h-px w-20 bg-[#d4ad68] mb-7" />
        <p className="max-w-3xl text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90 font-light mb-5">Neutrality. Integrity. Stability. Transparency.<span className="block text-white/75">Honesty. Accountability.</span></p>
        <p className="max-w-2xl text-base sm:text-lg leading-8 text-white/70 mb-9">Credible knowledge and constructive dialogue connecting public policy, administrative practice, and informed public engagement.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('articles')} className="hero-button-primary">Explore articles <ArrowRight size={17}/></button>
          <button onClick={() => onNavigate('about')} className="hero-button-secondary">About NISHTHA</button>
        </div>
      </div>
    </section>
  );
}
