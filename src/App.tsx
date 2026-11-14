import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ArticleShelf from '@/components/ArticleShelf';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { supabase } from '@/lib/supabase';

type View = 'website' | 'admin-login' | 'admin-dashboard';
export default function App() {
 const [view,setView]=useState<View>('website');
 useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(data.session)setView('admin-dashboard')});const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{if(!session&&view==='admin-dashboard')setView('website')});return()=>listener.subscription.unsubscribe()},[]);
 const scrollToSection=(section:string)=>{const el=document.getElementById(section);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})};
 const handleNavigate=(section:string)=>{if(view!=='website'){setView('website');setTimeout(()=>scrollToSection(section),100)}else scrollToSection(section)};
 const handleAdminClick=async()=>{const {data}=await supabase.auth.getSession();setView(data.session?'admin-dashboard':'admin-login')};
 if(view==='admin-login')return <AdminLogin onSuccess={()=>setView('admin-dashboard')} onBack={()=>setView('website')}/>;
 if(view==='admin-dashboard')return <AdminDashboard onLogout={async()=>{await supabase.auth.signOut();setView('website')}} onBack={()=>setView('website')}/>;
 return <div className="min-h-screen library-bg"><Navbar onNavigate={handleNavigate} onAdminClick={handleAdminClick}/><Hero onNavigate={handleNavigate}/><About/><ArticleShelf/><Footer/></div>;
}