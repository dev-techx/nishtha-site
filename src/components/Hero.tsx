import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#101c2c]">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f8fa] to-transparent" />
    </section>
  );
}
