import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await api.get('/auth/me'); // Ensure this route exists or we can just fetch bets
        setUser(userRes.data);
      } catch (err) {
        // User profile might not exist, but we can still fetch bets
      }

      try {
        const betsRes = await api.get('/bets');
        setBets(betsRes.data);
      } catch (error) {
        console.error('Failed to fetch bets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const activeBets = bets.filter(b => b.status === 'PENDING');
  const pastBets = bets.filter(b => b.status !== 'PENDING');

  const getSelectionText = (selection: string, team1Name: string, team2Name: string) => {
    if (selection === 'TEAM_1_WIN') return `فوز ${team1Name}`;
    if (selection === 'TEAM_2_WIN') return `فوز ${team2Name}`;
    if (selection === 'DRAW') return 'تعادل';
    return selection;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">الملف الشخصي</h1>

      <div className="glass p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center gap-6 text-center md:text-right relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-bold relative z-10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          {user?.firstName?.[0] || 'U'}
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">{user?.firstName} {user?.lastName}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">الرهانات النشطة</h2>
      <div className="grid gap-4 mb-12">
        {activeBets.length === 0 ? (
           <div className="glass p-6 text-center text-muted-foreground rounded-2xl">لا توجد رهانات نشطة.</div>
        ) : (
          activeBets.map(bet => (
            <div key={bet.id} className="glass p-6 rounded-2xl border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="font-bold text-lg mb-1">{bet.match.team1Name} ضد {bet.match.team2Name}</div>
                <div className="text-muted-foreground text-sm">اختيارك: <span className="text-primary font-bold">{getSelectionText(bet.selection, bet.match.team1Name, bet.match.team2Name)}</span> (نسبة: {bet.oddsAtBet})</div>
              </div>
              <div className="text-center md:text-left relative z-10 bg-background/40 p-3 rounded-xl border border-border/40 w-full md:w-auto">
                <div className="text-muted-foreground text-xs mb-1">المبلغ المراهن به</div>
                <div className="font-bold text-xl">${bet.stake}</div>
                <div className="text-xs text-green-500 mt-1 font-bold">عائد محتمل: ${bet.potentialPayout}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">سجل الرهانات السابقة</h2>
      <div className="grid gap-4">
        {pastBets.length === 0 ? (
           <div className="glass p-6 text-center text-muted-foreground rounded-2xl">لا توجد رهانات سابقة.</div>
        ) : (
          pastBets.map(bet => (
            <div key={bet.id} className="glass p-6 rounded-2xl border border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right opacity-80 hover:opacity-100 transition-opacity">
              <div>
                <div className="font-bold text-lg mb-1">{bet.match?.team1Name} ضد {bet.match?.team2Name}</div>
                <div className="text-muted-foreground text-sm">اختيارك: {getSelectionText(bet.selection, bet.match?.team1Name, bet.match?.team2Name)} (نسبة: {bet.oddsAtBet})</div>
              </div>
              <div className="text-center md:text-left bg-background/30 p-3 rounded-xl w-full md:w-auto flex flex-col items-center md:items-end">
                <div className="font-bold text-xl mb-2">${bet.stake}</div>
                <div className={`text-sm font-bold px-4 py-1 rounded-full inline-block w-full md:w-auto text-center ${bet.status === 'WON' ? 'bg-green-500/20 text-green-500 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                  {bet.status === 'WON' ? `ربح +$${bet.potentialPayout}` : 'خسارة'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
