import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { BetSlip } from '../components/BetSlip';
import { getMatches } from '../api/matches';
import { BackendImage } from '../components/BackendImage';
import { HeroSection } from '../components/ui/HeroSection';
import { Trophy, ShieldHalf, CalendarDays, Clock, Activity } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBet, setSelectedBet] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        // Only show upcoming or live matches to users
        setMatches(data.filter((m: any) => m.status !== 'FINISHED'));
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <HeroSection 
        title={
          <>
            تابع أقوى <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">المباريات</span>
          </>
        }
        subtitle="استعرض أحدث المباريات، حلل الاحتمالات، وضع رهانك الرابح الآن."
        badge="مباريات اليوم ⚽"
        minHeight="min-h-[40vh]"
      >
        <div className="flex gap-2 justify-end w-full md:w-auto bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm mt-6">
          <Button variant="ghost" className="flex-1 md:flex-none text-xs md:text-sm px-6 bg-primary text-white rounded-xl shadow-sm">الكل</Button>
          <Button variant="ghost" className="flex-1 md:flex-none text-xs md:text-sm px-6 text-slate-600 hover:text-slate-900 rounded-xl">مباشر</Button>
          <Button variant="ghost" className="flex-1 md:flex-none text-xs md:text-sm px-6 text-slate-600 hover:text-slate-900 rounded-xl">قادمة</Button>
        </div>
      </HeroSection>

      <div className="container mx-auto px-4 py-12">

      {isLoading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/5">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Trophy size={64} className="opacity-20 mb-6" />
            <p className="text-xl font-bold text-white mb-2">لا توجد مباريات متاحة حالياً.</p>
            <p className="opacity-60">عد لاحقاً لمتابعة أقوى المباريات والمراهنة عليها.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="glass rounded-3xl overflow-hidden relative group border border-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] flex flex-col">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                  match.status === 'LIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {match.status === 'LIVE' && <Activity size={12} className="animate-pulse" />}
                  {match.status === 'LIVE' ? 'جارية الآن' : 'قادمة'}
                </span>
              </div>
              
              {/* League Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold gap-1.5">
                  <Trophy size={12} />
                  {match.league || 'بطولة'}
                </span>
              </div>

              {/* Teams & Score Area */}
              <div className="pt-16 pb-6 px-6 relative z-10 flex-1">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-white/70">
                    <CalendarDays size={12} />
                    <span>{new Date(match.matchDate).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                    <span className="mx-1">•</span>
                    <Clock size={12} />
                    <span>{new Date(match.matchDate).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {/* Team 1 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg mb-3 p-2 overflow-hidden relative group-hover:scale-110 transition-transform duration-300">
                      <BackendImage src={match.team1Logo} alt={match.team1Name} className="w-full h-full object-contain" fallbackIcon={<ShieldHalf size={28} className="text-primary/50" />} />
                    </div>
                    <h3 className="font-bold text-sm text-center text-white line-clamp-2">{match.team1Name}</h3>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center justify-center px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-primary/30">VS</div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg mb-3 p-2 overflow-hidden relative group-hover:scale-110 transition-transform duration-300">
                      <BackendImage src={match.team2Logo} alt={match.team2Name} className="w-full h-full object-contain" fallbackIcon={<ShieldHalf size={28} className="text-blue-400/50" />} />
                    </div>
                    <h3 className="font-bold text-sm text-center text-white line-clamp-2">{match.team2Name}</h3>
                  </div>
                </div>
              </div>

              {/* Betting Odds Area */}
              <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-2 mb-3">
                  <span>اختر رهانك (الاحتمالات):</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setSelectedBet({ matchId: match.id, team1: match.team1Name, team2: match.team2Name, selectionLabel: 'فوز ' + match.team1Name, selectionValue: 'TEAM_1_WIN', odds: match.odds?.[0]?.team1Win || 1.5 })}
                    className="flex flex-col items-center py-2.5 px-1 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/5 hover:border-primary/50 transition-all group/btn"
                  >
                    <span className="text-[10px] text-muted-foreground mb-1 group-hover/btn:text-white transition-colors">فوز 1</span>
                    <span className="font-black text-primary text-sm">{match.odds?.[0]?.team1Win || '-'}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedBet({ matchId: match.id, team1: match.team1Name, team2: match.team2Name, selectionLabel: 'تعادل', selectionValue: 'DRAW', odds: match.odds?.[0]?.draw || 3.0 })}
                    className="flex flex-col items-center py-2.5 px-1 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/50 transition-all group/btn"
                  >
                    <span className="text-[10px] text-muted-foreground mb-1 group-hover/btn:text-white transition-colors">تعادل</span>
                    <span className="font-black text-amber-400 text-sm">{match.odds?.[0]?.draw || '-'}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedBet({ matchId: match.id, team1: match.team1Name, team2: match.team2Name, selectionLabel: 'فوز ' + match.team2Name, selectionValue: 'TEAM_2_WIN', odds: match.odds?.[0]?.team2Win || 2.5 })}
                    className="flex flex-col items-center py-2.5 px-1 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/50 transition-all group/btn"
                  >
                    <span className="text-[10px] text-muted-foreground mb-1 group-hover/btn:text-white transition-colors">فوز 2</span>
                    <span className="font-black text-blue-400 text-sm">{match.odds?.[0]?.team2Win || '-'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <BetSlip 
        selection={selectedBet} 
        onClose={() => setSelectedBet(null)} 
        onConfirm={() => {
          setSelectedBet(null);
        }} 
      />
    </div>
    </div>
  );
};
