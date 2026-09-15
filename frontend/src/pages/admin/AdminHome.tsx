import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export const AdminHome: React.FC = () => {
  const [stats, setStats] = useState({ usersCount: 0, betsCount: 0, activeMatches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div>
      <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">نظرة عامة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-border/20 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="text-muted-foreground mb-2 relative z-10 text-sm font-medium uppercase tracking-wider">إجمالي المستخدمين</div>
          <div className="text-4xl font-black relative z-10">{stats.usersCount}</div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-border/20 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="text-muted-foreground mb-2 relative z-10 text-sm font-medium uppercase tracking-wider">إجمالي الرهانات</div>
          <div className="text-4xl font-black relative z-10">{stats.betsCount}</div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-border/20 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="text-muted-foreground mb-2 relative z-10 text-sm font-medium uppercase tracking-wider">مباريات نشطة</div>
          <div className="text-4xl font-black text-primary relative z-10">{stats.activeMatches}</div>
        </div>
      </div>

      <div className="glass border border-border/20 rounded-2xl shadow-lg p-8 relative overflow-hidden">
         <h2 className="text-2xl font-bold mb-4">أحدث النشاطات</h2>
         <p className="text-muted-foreground">لا توجد نشاطات حديثة لعرضها في الوقت الحالي.</p>
      </div>
    </div>
  );
};
