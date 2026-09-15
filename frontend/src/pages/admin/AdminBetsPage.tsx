import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Target, Search, Clock, CheckCircle, XCircle } from 'lucide-react';

export const AdminBetsPage: React.FC = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await api.get('/admin/bets');
        setBets(response.data);
      } catch (error) {
        console.error('Failed to fetch bets', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBets();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            <Clock size={14} /> معلق
          </span>
        );
      case 'WON':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <CheckCircle size={14} /> ربح
          </span>
        );
      case 'LOST':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(244,63,94,0.1)]">
            <XCircle size={14} /> خسارة
          </span>
        );
      default:
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getSelectionText = (selection: string) => {
    if (selection === 'TEAM_1_WIN') return 'فوز الأول';
    if (selection === 'TEAM_2_WIN') return 'فوز الثاني';
    if (selection === 'DRAW') return 'تعادل';
    return selection;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200 tracking-tight">سجل الرهانات العام</h1>
          <p className="text-muted-foreground mt-2 text-sm">متابعة كافة رهانات المستخدمين على المنصة.</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-2 md:p-6 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
             <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
            <Target size={48} className="opacity-20 mb-4" />
            <p>لا يوجد رهانات مسجلة حتى الآن.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm text-right min-w-[800px]">
              <thead className="bg-secondary/40 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-5 font-bold">المستخدم</th>
                  <th className="px-6 py-5 font-bold">المباراة</th>
                  <th className="px-6 py-5 font-bold text-center">الخيار</th>
                  <th className="px-6 py-5 font-bold text-center">المبلغ</th>
                  <th className="px-6 py-5 font-bold text-center">العائد المحتمل</th>
                  <th className="px-6 py-5 font-bold text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20">
                {bets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-primary transition-colors">{bet.user?.firstName} {bet.user?.lastName}</div>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
                        <Search size={10} /> {bet.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white/90">{bet.match?.team1Name}</span>
                        <span className="text-xs text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">ضد</span>
                        <span className="font-bold text-white/90">{bet.match?.team2Name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg text-xs font-bold">
                        {getSelectionText(bet.selection)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-white">${bet.stake.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                        <span className="opacity-70">النسبة:</span> <span className="font-bold text-amber-400">x{bet.oddsAtBet}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                        ${bet.potentialPayout.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(bet.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
