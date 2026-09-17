import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, Receipt, Target, ArrowRight, Menu, X, Gift } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'الرئيسية', path: '/admin', icon: LayoutDashboard },
    { name: 'المباريات', path: '/admin/matches', icon: Trophy },
    { name: 'المستخدمين', path: '/admin/users', icon: Users },
    { name: 'المعاملات المالية', path: '/admin/transactions', icon: Receipt },
    { name: 'الرهانات', path: '/admin/bets', icon: Target },
    { name: 'إدارة البونص', path: '/admin/bonus', icon: Gift },
    { name: 'الدوريات', path: '/admin/leagues', icon: Trophy }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden" dir="rtl">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-20 pointer-events-none"></div>

      {/* Mobile Header */}
      <div className="md:hidden glass border-b border-white/5 px-4 h-16 flex justify-between items-center relative z-40 shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Goolbet Logo" className="w-8 h-8 object-cover rounded-full border border-primary/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200">الإدارة</h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 right-0 z-40 w-72 md:w-72 h-full
        glass border-l border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-full h-48 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-emerald-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Logo Area (Desktop) */}
          <div className="hidden md:flex items-center gap-4 mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full"></div>
              <img src="/logo.jpg" alt="Goolbet Logo" className="w-12 h-12 object-cover rounded-full border-2 border-primary/50 relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200 tracking-tight">لوحة الإدارة</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Admin Dashboard</p>
            </div>
          </div>

          <div className="md:hidden mb-8 mt-4">
             <h2 className="text-xl font-bold text-white mb-2">القائمة الرئيسية</h2>
             <div className="h-px w-full bg-gradient-to-l from-primary/50 to-transparent"></div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium text-sm group relative overflow-hidden
                    ${isActive 
                      ? 'text-white shadow-[0_0_20px_rgba(34,197,94,0.15)] bg-gradient-to-l from-primary/20 to-primary/5 border border-primary/20' 
                      : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'}
                  `}
                >
                  {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full shadow-[0_0_10px_rgba(34,197,94,1)]"></div>}
                  <Icon size={20} className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'} transition-colors`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Area */}
          <div className="mt-auto pt-8 border-t border-white/5">
            <Link to="/" className="flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border/40 hover:border-border px-4 py-3 rounded-2xl text-sm font-medium transition-all group">
              <ArrowRight size={18} className="text-muted-foreground group-hover:text-white transition-colors" />
              العودة للموقع
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-0">
        <div className="min-h-full p-4 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
