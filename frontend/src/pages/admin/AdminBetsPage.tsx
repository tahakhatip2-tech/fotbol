import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Target, Search, Clock, CheckCircle, XCircle, ChevronDown, User } from 'lucide-react';
import { HeroSection } from '../../components/ui/HeroSection';

const BetCard: React.FC<{ bet: any }> = ({ bet }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold">
            <Clock size={12} /> معلق
          </span>
        );
      case 'WON':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-[10px] font-bold">
            <CheckCircle size={12} /> ربح
          </span>
        );
      case 'LOST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-bold">
            <XCircle size={12} /> خسارة
          </span>
        );
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-bold">{status}</span>;
    }
  };

  const getSelectionText = (selection: string) => {
    if (selection === 'TEAM_1_WIN') return 'فوز الأول';
    if (selection === 'TEAM_2_WIN') return 'فوز الثاني';
    if (selection === 'DRAW') return 'تعادل';
    return selection;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-right hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-600 font-bold text-sm">{bet.user?.firstName?.[0]?.toUpperCase() || <User size={16} />}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800 text-sm">{bet.user?.firstName} {bet.user?.lastName}</div>
            <div className="text-[10px] text-slate-400 font-medium">مبلغ الرهان: ${bet.stake.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(bet.status)}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50 bg-slate-50/50 space-y-3 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">البريد الإلكتروني</span>
              <span className="font-bold text-slate-700">{bet.user?.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">المباراة</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>{bet.match?.team1Name}</span>
                <span className="text-[9px] text-slate-400 bg-slate-100 px-1 rounded">ضد</span>
                <span>{bet.match?.team2Name}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">الخيار</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{getSelectionText(bet.selection)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-slate-100 p-3 flex flex-col justify-center items-center">
              <span className="text-[10px] text-slate-400 mb-0.5">النسبة</span>
              <span className="font-bold text-amber-500 text-sm">x{bet.oddsAtBet}</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-3 flex flex-col justify-center items-center">
              <span className="text-[10px] text-slate-400 mb-0.5">العائد المحتمل</span>
              <span className="font-bold text-emerald-500 text-sm">${bet.potentialPayout.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold">
            <Clock size={14} /> معلق
          </span>
        );
      case 'WON':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold">
            <CheckCircle size={14} /> ربح
          </span>
        );
      case 'LOST':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold">
            <XCircle size={14} /> خسارة
          </span>
        );
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-xs font-bold">{status}</span>;
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
      <HeroSection 
        title="سجل الرهانات العام" 
        subtitle="متابعة كافة رهانات المستخدمين على المنصة بسهولة."
      />

      <div className="mt-4 md:mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
             <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 flex flex-col items-center">
            <Target size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">لا يوجد رهانات مسجلة حتى الآن.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-3">
              {bets.map(bet => (
                <BetCard key={bet.id} bet={bet} />
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[800px]">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold">المستخدم</th>
                      <th className="px-6 py-4 font-bold">المباراة</th>
                      <th className="px-6 py-4 font-bold text-center">الخيار</th>
                      <th className="px-6 py-4 font-bold text-center">المبلغ</th>
                      <th className="px-6 py-4 font-bold text-center">العائد المحتمل</th>
                      <th className="px-6 py-4 font-bold text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bets.map((bet) => (
                      <tr key={bet.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{bet.user?.firstName} {bet.user?.lastName}</div>
                          <div className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                            <Search size={10} /> {bet.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{bet.match?.team1Name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ضد</span>
                            <span className="font-bold text-slate-800">{bet.match?.team2Name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold">
                            {getSelectionText(bet.selection)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-slate-800">${bet.stake.toFixed(2)}</div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                            <span>النسبة:</span> <span className="font-bold text-amber-500">x{bet.oddsAtBet}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-black text-emerald-500">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};
