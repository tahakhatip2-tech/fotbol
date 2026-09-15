import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Target, Trophy, Activity, ArrowUpRight } from 'lucide-react';

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

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200 tracking-tight">نظرة عامة</h1>
          <p className="text-muted-foreground mt-2">إحصائيات المنصة وأحدث النشاطات</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Users Card */}
        <div className="glass p-6 rounded-3xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
              +12% <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-muted-foreground text-sm font-medium mb-1">إجمالي المستخدمين</div>
            <div className="text-4xl font-black text-white">{stats.usersCount}</div>
          </div>
        </div>
        
        {/* Bets Card */}
        <div className="glass p-6 rounded-3xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] group-hover:bg-amber-500/20 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Target size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-muted-foreground text-sm font-medium mb-1">إجمالي الرهانات</div>
            <div className="text-4xl font-black text-white">{stats.betsCount}</div>
          </div>
        </div>
        
        {/* Matches Card */}
        <div className="glass p-6 rounded-3xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Trophy size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
              نشط الآن
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-muted-foreground text-sm font-medium mb-1">المباريات النشطة</div>
            <div className="text-4xl font-black text-white">{stats.activeMatches}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 relative overflow-hidden h-[400px] flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Activity size={20} className="text-primary" />
               مخطط النشاط
             </h2>
           </div>
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/30 rounded-2xl bg-secondary/10">
              <p className="text-muted-foreground flex flex-col items-center gap-2">
                <Activity size={32} className="opacity-20" />
                سيتم إضافة المخططات البيانية قريباً
              </p>
           </div>
        </div>

        <div className="glass rounded-3xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 relative overflow-hidden h-[400px] flex flex-col">
           <h2 className="text-xl font-bold text-white mb-6">أحدث النشاطات</h2>
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/30 rounded-2xl bg-secondary/10">
              <p className="text-muted-foreground text-sm">لا توجد نشاطات حديثة لعرضها في الوقت الحالي.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
