import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Trophy, Wallet, User, Menu } from 'lucide-react';

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

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
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      {/* Navbar */}
      <header className="glass sticky top-0 z-40 border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent tracking-tighter flex items-center gap-2">
            <img src="/logo.jpg" alt="Fotbol Logo" className="w-10 h-10 object-cover rounded-full border border-primary/30" />
            Fotbol
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
                <div className="flex items-center gap-2 md:gap-3">
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" title="لوحة الإدارة">
                      <Button variant="ghost" className="p-2 text-primary hover:bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
                        <Menu size={24} />
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-primary/30 transition-colors">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  </Link>
                  <Button variant="ghost" className="hidden md:inline-flex text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={handleLogout}>
                    تسجيل خروج
                  </Button>
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
      <main className="flex-1 relative z-10 pt-8 pb-24 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/40 z-50 flex justify-around items-center h-16 pb-safe bg-background/80 backdrop-blur-md">
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

      {/* Footer */}
      <footer className="glass border-t border-border/40 mt-auto py-8 mb-16 md:mb-0 hidden md:block">
        <div className="container mx-auto px-4 text-center flex flex-col items-center gap-4">
          <img src="/logo.jpg" alt="Fotbol Logo" className="w-12 h-12 object-cover rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-primary/20" />
          <p className="text-muted-foreground">© 2026 Fotbol. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/60 tracking-widest font-medium uppercase mt-2">Developed by Taha Alkhatip</p>
        </div>
      </footer>
    </div>
  );
};
