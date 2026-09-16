import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Zap, ShieldCheck, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { getMatches } from '../api/matches';

export const HomePage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [featuredMatches, setFeaturedMatches] = useState<any[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getMatches();
        // Get up to 3 upcoming or live matches
        const matches = data.filter((m: any) => m.status !== 'FINISHED').slice(0, 3);
        // Fallback to any 3 matches if no upcoming/live found
        setFeaturedMatches(matches.length > 0 ? matches : data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured matches:', error);
      } finally {
        setIsLoadingMatches(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full glass border-primary/30 text-primary text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-fade-in-up">
            🏆 المنصة الأولى للرهانات الرياضية
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            توقع. راهن. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-blue-500">
              اربح بثقة تامة.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            استمتع بتجربة مراهنة لا مثيل لها مع احتمالات فورية، أمان فائق عبر العملات الرقمية، وعوائد فورية بمجرد انتهاء المباراة.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] hover:scale-105 transition-all w-full sm:w-auto" onClick={() => navigate('/matches')}>
              ابدأ الرهان الآن
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-primary/50 hover:bg-primary/10 w-full sm:w-auto" onClick={() => navigate('/register')}>
              أنشئ حسابك مجاناً
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10 bg-background/50 backdrop-blur-sm border-y border-border/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختار Goolbet؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">صممنا منصتنا لتكون الأسرع، والأكثر أماناً، والأسهل استخداماً لعشاق كرة القدم والمراهنات.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,197,94,0.1)] group">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">احتمالات حية وديناميكية</h3>
              <p className="text-muted-foreground leading-relaxed">
                تحديثات فورية للاحتمالات (Odds) لضمان حصولك على أفضل العوائد في كل ثانية من المباراة.
              </p>
            </div>
            
            <div className="glass p-8 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,197,94,0.1)] group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <ShieldCheck className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">محفظة كريبتو آمنة</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10">
                إيداع وسحب فوري باستخدام العملات الرقمية (USDT TRC-20) مع أعلى معايير الأمان والتشفير.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,197,94,0.1)] group">
              <div className="w-14 h-14 bg-green-400/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">دفع فوري وتلقائي</h3>
              <p className="text-muted-foreground leading-relaxed">
                بمجرد انتهاء المباراة وتحديد النتيجة، يتم إضافة أرباحك إلى محفظتك بشكل تلقائي وفوري.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Matches Teaser */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">أبرز المباريات القادمة</h2>
              <p className="text-muted-foreground">لا تفوت فرصة الرهان على أقوى المواجهات الكروية.</p>
            </div>
            <Link to="/matches" className="text-primary hover:text-primary/80 font-bold flex items-center gap-2 group transition-colors">
              عرض كل المباريات
              {isRtl ? <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Link>
          </div>

          {isLoadingMatches ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredMatches.length === 0 ? (
            <div className="glass p-12 text-center rounded-3xl text-muted-foreground">لا توجد مباريات بارزة حالياً.</div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {featuredMatches.map(match => (
                <div key={match.id} className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-primary/40 transition-colors hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono text-muted-foreground/80 tracking-widest">{new Date(match.matchDate).toLocaleDateString()}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary/20 text-primary rounded-full">
                      {match.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4 mb-8">
                    <div className="text-center flex-1">
                      {match.team1Logo ? (
                         <img src={match.team1Logo.startsWith('http') ? match.team1Logo : `http://localhost:5000${match.team1Logo}`} alt={match.team1Name} className="w-16 h-16 mx-auto mb-2 object-contain" />
                      ) : (
                         <div className="w-16 h-16 mx-auto mb-2 bg-card rounded-full flex items-center justify-center text-2xl font-black">{match.team1Name[0]}</div>
                      )}
                      <div className="font-bold">{match.team1Name}</div>
                    </div>
                    
                    <div className="text-muted-foreground/50 font-black text-xl italic">VS</div>
                    
                    <div className="text-center flex-1">
                      {match.team2Logo ? (
                         <img src={match.team2Logo.startsWith('http') ? match.team2Logo : `http://localhost:5000${match.team2Logo}`} alt={match.team2Name} className="w-16 h-16 mx-auto mb-2 object-contain" />
                      ) : (
                         <div className="w-16 h-16 mx-auto mb-2 bg-card rounded-full flex items-center justify-center text-2xl font-black">{match.team2Name[0]}</div>
                      )}
                      <div className="font-bold">{match.team2Name}</div>
                    </div>
                  </div>
                  
                  <Button className="w-full h-12 shadow-[0_0_15px_rgba(34,197,94,0.2)]" onClick={() => navigate('/matches')}>راهن الآن</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
