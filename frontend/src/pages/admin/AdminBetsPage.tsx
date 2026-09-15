import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

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
        return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold">معلق (بانتظار النتيجة)</span>;
      case 'WON':
        return <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">ربح</span>;
      case 'LOST':
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold">خسارة</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-500 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getSelectionText = (selection: string) => {
    if (selection === 'TEAM_1_WIN') return 'فوز الفريق الأول';
    if (selection === 'TEAM_2_WIN') return 'فوز الفريق الثاني';
    if (selection === 'DRAW') return 'تعادل';
    return selection;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">سجل الرهانات العام</h2>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
        ) : bets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">لا يوجد رهانات مسجلة حتى الآن.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 rounded-tr-lg">المستخدم</th>
                  <th className="px-6 py-4">المباراة</th>
                  <th className="px-6 py-4">الخيار</th>
                  <th className="px-6 py-4">المبلغ (الاحتمال)</th>
                  <th className="px-6 py-4">العائد المحتمل</th>
                  <th className="px-6 py-4 rounded-tl-lg">حالة الرهان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {bets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold">
                      {bet.user?.firstName} {bet.user?.lastName}
                      <div className="text-xs text-muted-foreground font-normal">{bet.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {bet.match?.team1Name} ضد {bet.match?.team2Name}
                    </td>
                    <td className="px-6 py-4 text-primary font-bold">{getSelectionText(bet.selection)}</td>
                    <td className="px-6 py-4">
                      ${bet.stake.toFixed(2)} <span className="text-xs text-muted-foreground">(x{bet.oddsAtBet})</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-500">${bet.potentialPayout.toFixed(2)}</td>
                    <td className="px-6 py-4">
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
