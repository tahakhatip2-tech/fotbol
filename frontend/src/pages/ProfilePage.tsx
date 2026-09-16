import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, Trophy, Activity, Wallet, ShieldCheck, Crown } from 'lucide-react';

import { HeroSection } from '../components/ui/HeroSection';

export const ProfilePage: React.FC = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (status: string, potentialPayout?: number) => {
    if (status === 'WON') {
      return (
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Trophy size={16} />
          ربح +${potentialPayout}
        </div>
      );
    }
    if (status === 'LOST') {
      return (
        <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
          خسارة
        </div>
      );
    }
    return (
      <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
        <Activity size={16} />
        قيد الانتظار
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <HeroSection 
        title={`${user?.firstName || ''} ${user?.lastName || ''}`}
        badge="👤 حسابي الشخصي"
        minHeight="min-h-[40vh]"
      >
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-white flex items-center justify-center relative shadow-xl overflow-hidden">
            <span className="text-4xl font-black text-primary drop-shadow-sm">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </span>
            {user?.role === 'ADMIN' && (
              <div className="absolute bottom-1 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                <ShieldCheck size={10} />
                ADMIN
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-white/50 px-5 py-2 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm font-medium">
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>
        </div>
      </HeroSection>

      <div className="container mx-auto px-4 py-8 max-w-5xl">

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Bets Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                <Activity size={20} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">الرهانات النشطة</h2>
            </div>
            
            <div className="grid gap-4">
              {activeBets.length === 0 ? (
                <div className="glass p-8 text-center rounded-3xl border border-dashed border-border/50 bg-secondary/10">
                  <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <Trophy size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">لا توجد رهانات نشطة حالياً</h3>
                  <p className="text-muted-foreground text-sm">توقع نتائج المباريات القادمة وابدأ في ربح الأرباح</p>
                </div>
              ) : (
                activeBets.map(bet => (
                  <div key={bet.id} className="glass p-6 rounded-3xl border border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-primary/40 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                      <div className="text-center md:text-right w-full">
                        <div className="inline-flex items-center gap-2 bg-secondary/40 border border-border/40 px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground mb-3">
                          <Trophy size={12} className="text-primary" />
                          مباراة قادمة
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-white">{bet.match.team1Name} <span className="text-muted-foreground px-2 font-normal">ضد</span> {bet.match.team2Name}</h3>
                        <div className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2">
                          اختيارك: <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md border border-primary/20">{getSelectionText(bet.selection, bet.match.team1Name, bet.match.team2Name)}</span>
                          <span className="text-xs opacity-70">(نسبة: {bet.oddsAtBet})</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 md:flex-col items-center md:items-end w-full md:w-auto bg-background/40 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none border-border/30">
                        <div className="text-center md:text-right w-1/2 md:w-auto border-l md:border-l-0 border-border/30 pl-4 md:pl-0">
                          <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">مبلغ الرهان</div>
                          <div className="font-bold text-2xl">${bet.stake}</div>
                        </div>
                        <div className="text-center md:text-right w-1/2 md:w-auto">
                          <div className="text-primary/70 text-xs mb-1 uppercase tracking-wider font-bold">العائد المحتمل</div>
                          <div className="font-black text-2xl text-primary drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">${bet.potentialPayout}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div>
          {/* History Section */}
          <section className="sticky top-28">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border/50 text-foreground">
                <Wallet size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">سجل الرهانات</h2>
            </div>

            <div className="glass rounded-3xl p-2 border border-border/40 max-h-[600px] overflow-y-auto no-scrollbar">
              {pastBets.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد رهانات سابقة.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {pastBets.map(bet => (
                    <div key={bet.id} className="bg-secondary/20 hover:bg-secondary/40 p-5 rounded-2xl border border-border/30 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-sm text-white/90 line-clamp-1 w-2/3">{bet.match?.team1Name} ضد {bet.match?.team2Name}</div>
                        {getStatusBadge(bet.status, bet.potentialPayout)}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="text-muted-foreground text-xs">
                          <div className="mb-1">الاختيار: {getSelectionText(bet.selection, bet.match?.team1Name, bet.match?.team2Name)}</div>
                          <div>الرهان: <span className="font-bold text-foreground">${bet.stake}</span></div>
                        </div>
                        <div className="text-xs opacity-50">
                          النسبة: {bet.oddsAtBet}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
    </div>
  );
};
