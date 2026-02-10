
import React from 'react';
import { Wallet, PieChart, MessageSquare, Bell } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-2xl border-emerald-100/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-2.5 rounded-2xl shadow-xl shadow-emerald-100 animate-float">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-900 to-emerald-700">
              FinTwin
            </span>
            <span className="block text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] leading-none mt-0.5 text-center sm:text-left">Your Personal Financial Asst</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-500">
          <NavLink icon={<PieChart className="w-4 h-4" />} label="Portfolio" active />
          <NavLink icon={<MessageSquare className="w-4 h-4" />} label="Twin Insights" />
          <NavLink icon={<Bell className="w-4 h-4" />} label="Activity" />
        </nav>
        
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-emerald-950 leading-tight">Rahul Sharma</p>
          </div>
          <button 
            onClick={onProfileClick}
            className="relative cursor-pointer group outline-none"
          >
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur group-hover:blur-md transition-all"></div>
            <img 
              src="https://picsum.photos/seed/rahul/80/80" 
              alt="Profile" 
              className="relative w-11 h-11 rounded-full border-2 border-white ring-1 ring-emerald-50 object-cover transition-transform group-hover:scale-105"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

const NavLink: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center gap-2 transition-all hover:text-emerald-700 ${active ? 'text-emerald-700' : ''}`}>
    {icon}
    <span>{label}</span>
    {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-1"></span>}
  </a>
);

export default Header;
