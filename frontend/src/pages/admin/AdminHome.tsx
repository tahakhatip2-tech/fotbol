import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Target, Trophy, Activity } from 'lucide-react';
import { HeroSection } from '../../components/ui/HeroSection';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'السبت', الرهانات: 4 },
  { name: 'الأحد', الرهانات: 3 },
  { name: 'الاثنين', الرهانات: 5 },
  { name: 'الثلاثاء', الرهانات: 4 },
  { name: 'الأربعاء', الرهانات: 7 },
  { name: 'الخميس', الرهانات: 6 },
  { name: 'الجمعة', الرهانات: 9 },
];

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
      <HeroSection
        title={
          <>
            نظرة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">عامة</span>
          </>
        }
        subtitle="إحصائيات المنصة وأحدث النشاطات"
        badge="لوحة الإدارة ⚙️"
        minHeight="min-h-[30vh]"
      >
        <div className="mt-8 grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
          {/* Users Card */}
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/70 transition-all cursor-pointer">
            <Users size={20} className="text-blue-500 mb-1" />
            <span className="text-[10px] md:text-xs text-slate-500 font-bold mb-1">المستخدمين</span>
            <span className="text-lg md:text-xl font-black text-slate-900">{stats.usersCount}</span>
          </div>

          {/* Bets Card */}
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/70 transition-all cursor-pointer">
            <Target size={20} className="text-amber-500 mb-1" />
            <span className="text-[10px] md:text-xs text-slate-500 font-bold mb-1">الرهانات</span>
            <span className="text-lg md:text-xl font-black text-slate-900">{stats.betsCount}</span>
          </div>

          {/* Matches Card */}
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/70 transition-all cursor-pointer">
            <Trophy size={20} className="text-emerald-500 mb-1" />
            <span className="text-[10px] md:text-xs text-slate-500 font-bold mb-1">المباريات</span>
            <span className="text-lg md:text-xl font-black text-slate-900">{stats.activeMatches}</span>
          </div>

          {/* Revenue Card */}
          <div className="bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/70 transition-all cursor-pointer">
            <Activity size={20} className="text-purple-500 mb-1" />
            <span className="text-[10px] md:text-xs text-slate-500 font-bold mb-1">الإيرادات</span>
            <span className="text-lg md:text-xl font-black text-slate-900">$0.0</span>
          </div>
        </div>
      </HeroSection>

      <div className="container mx-auto px-4 mt-2 mb-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-[360px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                مخطط النشاط الأسبوعي
              </h2>
              <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">آخر 7 أيام</span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="الرهانات" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBets)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#2563eb' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-[360px]">
            <h2 className="text-lg font-bold text-slate-900 mb-4">أحدث النشاطات</h2>
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-slate-400 text-sm text-center flex flex-col items-center gap-2">
                <Activity size={28} className="opacity-30" />
                لا توجد نشاطات حديثة
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
