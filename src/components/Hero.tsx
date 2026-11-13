import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#101c2c]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(212,173,104,.12),transparent_35%),linear-gradient(125deg,#101c2c,#1d3048_60%,#26364d)]" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f8fa] to-transparent" />
    </section>
  );
}
