import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', path: '/admin' },
    { name: 'المباريات', path: '/admin/matches' },
    { name: 'المستخدمين', path: '/admin/users' },
    { name: 'المعاملات المالية', path: '/admin/transactions' },
    { name: 'الرهانات', path: '/admin/bets' }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground" dir="rtl">
      {/* Sidebar (Mobile Header) */}
      <div className="md:hidden glass border-b border-border/20 p-4 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Fotbol Logo" className="w-8 h-8 object-cover rounded-full border border-primary/30" />
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">الإدارة</h2>
        </div>
        <select 
          className="bg-card text-sm border border-border/50 rounded-lg p-2 outline-none focus:border-primary"
          value={location.pathname}
          onChange={(e) => window.location.href = e.target.value}
        >
          {navItems.map(item => (
            <option key={item.path} value={item.path}>{item.name}</option>
          ))}
        </select>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 glass border-l border-border/20 h-full p-6 relative overflow-hidden z-10 flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 -z-10"></div>
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo.jpg" alt="Fotbol Logo" className="w-12 h-12 object-cover rounded-full border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" />
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">لوحة الإدارة</h2>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'hover:bg-card/50 text-muted-foreground hover:text-foreground'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-border/30">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            العودة للموقع
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-40 -mt-40 -z-10"></div>
        <Outlet />
      </main>
    </div>
  );
};
