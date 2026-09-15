import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { BetSlip } from '../components/BetSlip';
import { getMatches } from '../api/matches';

export const MatchesPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBet, setSelectedBet] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{t('matches')}</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none text-xs md:text-sm px-2">الكل</Button>
          <Button variant="outline" className="flex-1 md:flex-none text-xs md:text-sm px-2">مباشر</Button>
          <Button variant="outline" className="flex-1 md:flex-none text-xs md:text-sm px-2">قادمة</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">جاري تحميل المباريات...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد مباريات متاحة حالياً.</div>
        ) : (
          matches.map((match) => (
          <div key={match.id} className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:border-primary/30 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex-1 flex justify-between items-center w-full relative z-10">
              <div className="text-lg md:text-2xl font-black text-center w-1/3 break-words">{match.team1Name}</div>
              <div className="text-center w-1/3 flex flex-col items-center px-1">
                <div className="text-[10px] md:text-xs text-muted-foreground/80 font-mono tracking-wider mb-2">{new Date(match.matchDate).toLocaleDateString()}</div>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] md:text-xs shadow-[0_0_15px_rgba(34,197,94,0.3)]">VS</div>
                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 md:px-3 bg-primary text-primary-foreground rounded-full mt-3 shadow-lg shadow-primary/30 text-center whitespace-nowrap">
                  {match.status}
                </div>
              </div>
              <div className="text-lg md:text-2xl font-bold text-center w-1/3 break-words">{match.team2Name}</div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto relative z-10">
              <Button variant="outline" className="flex-1 flex flex-col h-16 py-2 bg-background/50 border-border/50 hover:border-primary hover:bg-primary/10 transition-all" onClick={() => setSelectedBet({ matchId: match.id, team1: match.team1Name, team2: match.team2Name, selectionLabel: 'فوز ' + match.team1Name, selectionValue: 'TEAM_1_WIN', odds: match.odds?.[0]?.team1Win || 1.0 })}>
                <span className="text-[10px] text-muted-foreground mb-1">فوز 1</span>
                <span className="font-black text-lg">{match.odds?.[0]?.team1Win || '-'}</span>
              </Button>
              <Button variant="outline" className="flex-1 flex flex-col h-16 py-2 bg-background/50 border-border/50 hover:border-primary hover:bg-primary/10 transition-all" onClick={() => setSelectedBet({ matchId: match.id, team1: match.team1Name, team2: match.team2Name, selectionLabel: 'تعادل', selectionValue: 'DRAW', odds: match.odds?.[0]?.draw || 1.0 })}>
                <span className="text-[10px] text-muted-foreground mb-1">تعادل</span>
                <span className="font-black text-lg">{match.odds?.[0]?.draw || '-'}</span>
              </Button>
              <Button variant="outline" className="flex-1 flex flex-col h-16 py-2 bg-background/50 border-border/50 hover:border-primary hover:bg-primary/10 transition-all" onClick={() => setSelectedBet({ matchId: match.id, team1: match.team1Name, team2: match.team2Name, selectionLabel: 'فوز ' + match.team2Name, selectionValue: 'TEAM_2_WIN', odds: match.odds?.[0]?.team2Win || 1.0 })}>
                <span className="text-[10px] text-muted-foreground mb-1">فوز 2</span>
                <span className="font-black text-lg">{match.odds?.[0]?.team2Win || '-'}</span>
              </Button>
            </div>
          </div>
        )))}
      </div>
      
      <BetSlip 
        selection={selectedBet} 
        onClose={() => setSelectedBet(null)} 
        onConfirm={() => {
          alert('تم تأكيد الرهان بنجاح!');
          setSelectedBet(null);
        }} 
      />
    </div>
  );
};
