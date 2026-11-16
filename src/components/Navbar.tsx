import { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
interface NavbarProps { onNavigate:(section:string)=>void; onAdminClick:()=>void; }
export default function Navbar({onNavigate,onAdminClick}:NavbarProps){
 const [isOpen,setIsOpen]=useState(false);
 const items=[{label:'Home',section:'hero'},{label:'About',section:'about'},{label:'Founders',section:'founders'},{label:'Latest Articles',section:'articles'}];
 const go=(s:string)=>{onNavigate(s);setIsOpen(false)};
 return <>
 <nav className="site-header fixed top-0 left-0 right-0 z-50">
  <div className="max-w-7xl mx-auto h-[68px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
   <button onClick={()=>go('hero')} className="flex items-center gap-3" aria-label="NISHTHA home"><img src="/nishtha-site/logos/NISHTHA%20LOGO.jpeg" alt="Project NISHTHA logo" className="nav-nishtha-logo"/><span className="text-white font-semibold tracking-[.14em] text-lg sm:text-xl">NISHTHA</span></button>
   <div className="hidden md:flex items-center gap-7">{items.map(i=><button key={i.section} onClick={()=>go(i.section)} className="site-nav-link">{i.label}</button>)}<button onClick={onAdminClick} className="site-admin-link"><Lock size={14}/> Admin</button></div>
   <button onClick={()=>setIsOpen(!isOpen)} className="md:hidden text-[#142640] p-2" aria-label={isOpen?'Close menu':'Open menu'}>{isOpen?<X size={24}/>:<Menu size={24}/>}</button>
  </div>
 </nav>
 {isOpen&&<div className="fixed inset-0 z-[60] md:hidden"><button className="absolute inset-0 bg-black/35" onClick={()=>setIsOpen(false)} aria-label="Close menu backdrop"/><div className="absolute right-0 top-0 bottom-0 w-[min(82vw,320px)] bg-white shadow-xl pt-20 px-6 flex flex-col gap-2">{items.map(i=><button key={i.section} onClick={()=>go(i.section)} className="text-left py-3 px-2 text-[#142640] border-b border-slate-100 font-medium">{i.label}</button>)}<button onClick={()=>{onAdminClick();setIsOpen(false)}} className="flex items-center gap-2 text-left py-3 px-2 text-[#a8792c] font-medium"><Lock size={15}/>Admin Panel</button></div></div>}
 </>;
}