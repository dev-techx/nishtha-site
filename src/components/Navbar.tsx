import { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';

interface NavbarProps { onNavigate: (section: string) => void; onAdminClick: () => void; }

export default function Navbar({ onNavigate, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  const navItems = [{label:'Home',section:'hero'},{label:'About',section:'about'},{label:'Founders',section:'founders'},{label:'Articles',section:'articles'}];
  const handleNavClick = (section:string) => { onNavigate(section); setIsOpen(false); };
  return <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${scrolled?'nav-glass shadow-sm py-2':'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button onClick={()=>handleNavClick('hero')} className="flex items-center gap-3">
          <span className={`font-semibold text-2xl tracking-[.12em] ${scrolled?'text-[#142640]':'text-white'}`}>NISHTHA</span>
        </button>
        <div className="hidden md:flex items-center gap-8">{navItems.map(item=><button key={item.section} onClick={()=>handleNavClick(item.section)} className={`text-sm font-medium hover:text-[#c49a53] ${scrolled?'text-[#142640]':'text-white/90'}`}>{item.label}</button>)}<button onClick={onAdminClick} className="flex items-center gap-1.5 text-sm font-medium text-[#c49a53]"><Lock size={14}/>Admin</button></div>
        <button onClick={()=>setIsOpen(!isOpen)} className={`md:hidden ${scrolled?'text-[#142640]':'text-white'}`} aria-label="Toggle menu">{isOpen?<X size={26}/>:<Menu size={26}/>}</button>
      </div>
    </nav>
    {isOpen&&<div className="fixed inset-0 z-40 md:hidden"><div className="absolute inset-0 bg-black/40" onClick={()=>setIsOpen(false)}/><div className="absolute right-0 top-0 bottom-0 w-72 bg-[#142640] pt-20 pb-6 px-6 flex flex-col gap-4">{navItems.map(item=><button key={item.section} onClick={()=>handleNavClick(item.section)} className="text-lg text-white text-left py-2 border-b border-white/15">{item.label}</button>)}<button onClick={()=>{onAdminClick();setIsOpen(false)}} className="flex items-center gap-2 text-lg text-[#c49a53] py-2 mt-2"><Lock size={16}/>Admin Panel</button></div></div>}
  </>;
}
