import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/ui/Footer';
import { LayoutDashboard, Trophy, Users, Receipt, Target, Menu, LogOut, Gift, MoreHorizontal, ArrowRight } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'الرئيسية', path: '/admin', icon: LayoutDashboard },
    { name: 'المباريات', path: '/admin/matches', icon: Trophy },
    { name: 'المستخدمين', path: '/admin/users', icon: Users },
    { name: 'المعاملات', path: '/admin/transactions', icon: Receipt },
    { name: 'الرهانات', path: '/admin/bets', icon: Target },
    { name: 'البونص', path: '/admin/bonus', icon: Gift },
    { name: 'الدوريات', path: '/admin/leagues', icon: Trophy }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-20 pointer-events-none"></div>

      {/* Navbar */}
      <header className="glass sticky top-0 z-40 border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/admin" className="text-3xl font-black bg-gradient-to-l from-primary to-emerald-200 bg-clip-text text-transparent tracking-tighter flex items-center gap-2">
            <img src="/logo.jpg" alt="Goolbet Logo" className="w-10 h-10 object-cover rounded-full border border-primary/30" />
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-primary to-emerald-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] pb-1">الإدارة</span>
          </Link>
          
          <nav className="hidden lg:flex gap-4 xl:gap-6 flex-wrap justify-center">
             {navItems.map((item) => (
               <Link 
                 key={item.path}
                 to={item.path} 
                 className={`text-sm hover:text-primary transition-colors flex items-center gap-1.5 ${location.pathname === item.path ? 'text-primary font-bold' : 'text-muted-foreground'}`}
               >
                 <item.icon size={16} />
                 {item.name}
               </Link>
             ))}
          </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" className="hidden md:inline-flex" onClick={toggleLanguage}>
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </Button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-emerald-500/10 border-2 border-white shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none"
                >
                  <span className="text-primary font-black text-lg">
                    {user?.firstName?.[0]?.toUpperCase() || 'A'}
                  </span>
                  
                  {/* Green Online Dot */}
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  
                  <div className="absolute -bottom-1 -left-1 bg-slate-100 border border-white rounded-full p-0.5 shadow-sm">
                    <Menu size={12} className="text-slate-700" />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute end-0 top-full mt-3 w-56 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 origin-top-end">
                    <div className="p-3 border-b border-border/30 bg-emerald-500/10">
                      <p className="font-semibold text-sm truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-emerald-600 truncate font-bold">Admin</p>
                    </div>
                    
                    <div className="p-2 flex flex-col gap-1">
                      <Link to="/" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/60 text-sm font-medium transition-colors">
                        <ArrowRight size={18} className="text-primary" />
                        العودة للموقع
                      </Link>
                    </div>
                    
                    <div className="p-2 border-t border-border/30">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-medium transition-colors text-red-500">
                        <LogOut size={18} />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-24 md:pb-16">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/40 z-50 flex justify-around items-center h-16 pb-safe bg-background/80 backdrop-blur-md">
        <Link to="/admin" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <LayoutDashboard size={20} className={location.pathname === '/admin' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </Link>
        <Link to="/admin/matches" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/admin/matches' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Trophy size={20} className={location.pathname === '/admin/matches' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">المباريات</span>
        </Link>
        <Link to="/admin/users" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/admin/users' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Users size={20} className={location.pathname === '/admin/users' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">المستخدمين</span>
        </Link>
        
        {/* More Menu Toggle */}
        <div className="relative flex flex-col items-center justify-center w-full h-full" ref={moreMenuRef}>
          <button 
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isMoreMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <MoreHorizontal size={20} className={isMoreMenuOpen ? 'stroke-primary fill-primary/20' : ''} />
            <span className="text-[10px] font-medium">المزيد</span>
          </button>

          {/* More Menu Dropdown */}
          {isMoreMenuOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50 w-48 py-2">
               <Link to="/admin/transactions" onClick={() => setIsMoreMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 text-sm font-medium transition-colors ${location.pathname === '/admin/transactions' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
                 <Receipt size={18} />
                 المعاملات
               </Link>
               <Link to="/admin/bets" onClick={() => setIsMoreMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 text-sm font-medium transition-colors ${location.pathname === '/admin/bets' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
                 <Target size={18} />
                 الرهانات
               </Link>
               <Link to="/admin/bonus" onClick={() => setIsMoreMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 text-sm font-medium transition-colors ${location.pathname === '/admin/bonus' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
                 <Gift size={18} />
                 البونص
               </Link>
               <Link to="/admin/leagues" onClick={() => setIsMoreMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 text-sm font-medium transition-colors ${location.pathname === '/admin/leagues' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
                 <Trophy size={18} />
                 الدوريات
               </Link>
            </div>
          )}
        </div>
      </nav>

      <Footer />
    </div>
  );
};
