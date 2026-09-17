import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/ui/Footer';
import { Trophy, Wallet, User, Menu, LogOut, LayoutDashboard, Home } from 'lucide-react';

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="glass sticky top-0 z-40 border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent tracking-tighter flex items-center gap-2">
            <img src="/logo.jpg" alt="Goolbet Logo" className="w-10 h-10 object-cover rounded-full border border-primary/30" />
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] pb-1">Goolbet</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/matches" className="hover:text-primary transition-colors">{t('matches')}</Link>
            <Link to="/wallet" className="hover:text-primary transition-colors">{t('wallet')}</Link>
            <Link to="/profile" className="hover:text-primary transition-colors">حسابي</Link>
          </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" className="hidden md:inline-flex" onClick={toggleLanguage}>
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </Button>
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-white shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <span className="text-primary font-black text-lg">
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </span>
                    
                    {/* Green Online Dot (Facebook style) */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    
                    {/* Small Hamburger Icon Badge */}
                    <div className="absolute -bottom-1 -left-1 bg-slate-100 border border-white rounded-full p-0.5 shadow-sm">
                      <Menu size={12} className="text-slate-700" />
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute end-0 top-full mt-3 w-56 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 origin-top-end">
                      <div className="p-3 border-b border-border/30 bg-secondary/20">
                        <p className="font-semibold text-sm truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      
                      <div className="p-2 flex flex-col gap-1">
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/60 text-sm font-medium transition-colors">
                          <User size={18} className="text-primary" />
                          حسابي
                        </Link>
                        
                        {user?.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/60 text-sm font-medium transition-colors text-amber-500">
                            <LayoutDashboard size={18} />
                            لوحة الإدارة
                          </Link>
                        )}
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
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">{t('login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button>{t('register')}</Button>
                  </Link>
                </>
              )}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 pb-24 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/40 z-50 flex justify-around items-center h-16 pb-safe bg-background/80 backdrop-blur-md">
        <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Home size={20} className={location.pathname === '/' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </Link>
        <Link to="/matches" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/matches' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Trophy size={20} className={location.pathname === '/matches' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">{t('matches')}</span>
        </Link>
        <Link to="/wallet" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/wallet' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Wallet size={20} className={location.pathname === '/wallet' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">{t('wallet')}</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <User size={20} className={location.pathname === '/profile' ? 'stroke-primary fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">حسابي</span>
        </Link>
      </nav>

      <Footer />
    </div>
  );
};
