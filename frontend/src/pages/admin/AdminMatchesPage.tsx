import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Plus, X, Edit, CheckCircle, Clock, CalendarDays, Activity, Trophy } from 'lucide-react';

export const AdminMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    team1Name: '', team2Name: '', league: '', matchDate: '', status: 'UPCOMING',
    odds: { team1Win: 1.5, draw: 3.0, team2Win: 2.5 }
  });
  const [team1LogoFile, setTeam1LogoFile] = useState<File | null>(null);
  const [team2LogoFile, setTeam2LogoFile] = useState<File | null>(null);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (error) {
      console.error('Error fetching matches', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAddOrEditMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('team1Name', formData.team1Name);
      data.append('team2Name', formData.team2Name);
      data.append('league', formData.league);
      data.append('matchDate', formData.matchDate);
      data.append('status', formData.status);
      data.append('odds', JSON.stringify(formData.odds));
      
      if (team1LogoFile) data.append('team1Logo', team1LogoFile);
      if (team2LogoFile) data.append('team2Logo', team2LogoFile);

      if (editingMatchId) {
        await api.put(`/admin/matches/${editingMatchId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/matches', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowAddForm(false);
      setEditingMatchId(null);
      setTeam1LogoFile(null);
      setTeam2LogoFile(null);
      fetchMatches();
    } catch (error) {
      alert('حدث خطأ أثناء حفظ المباراة (CORS Issue was bypassed but check network logs if it persists)');
    }
  };

  const handleEditClick = (match: any) => {
    // Format date for datetime-local input
    const d = new Date(match.matchDate);
    const dateStr = d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    
    setFormData({
      team1Name: match.team1Name,
      team2Name: match.team2Name,
      league: match.league,
      matchDate: dateStr,
      status: match.status,
      odds: {
        team1Win: match.odds[0]?.team1Win || 1.5,
        draw: match.odds[0]?.draw || 3.0,
        team2Win: match.odds[0]?.team2Win || 2.5,
      }
    });
    setTeam1LogoFile(null);
    setTeam2LogoFile(null);
    setEditingMatchId(match.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setFormData({
      team1Name: '', team2Name: '',
      league: '', matchDate: '', status: 'UPCOMING',
      odds: { team1Win: 1.5, draw: 3.0, team2Win: 2.5 }
    });
    setTeam1LogoFile(null);
    setTeam2LogoFile(null);
    setEditingMatchId(null);
    setShowAddForm(!showAddForm);
  };

  const handleSettle = async (matchId: string, result: string) => {
    if (!confirm('هل أنت متأكد من تسوية هذه المباراة؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    try {
      await api.put(`/admin/matches/${matchId}/settle`, { result });
      fetchMatches();
    } catch (error) {
      alert('حدث خطأ أثناء تسوية المباراة');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200 tracking-tight">إدارة المباريات</h1>
          <p className="text-muted-foreground mt-2 text-sm">أضف، عدل، أو سوّي المباريات والرهانات.</p>
        </div>
        <Button onClick={handleAddNewClick} className="flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          {showAddForm && !editingMatchId ? <X size={20} /> : <Plus size={20} />}
          {showAddForm && !editingMatchId ? 'إلغاء الإضافة' : 'مباراة جديدة'}
        </Button>
      </div>

      {showAddForm && (
        <div className="glass p-6 md:p-10 rounded-3xl border border-primary/20 mb-10 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-white">
            {editingMatchId ? <Edit size={24} className="text-blue-400" /> : <Plus size={24} className="text-primary" />}
            {editingMatchId ? 'تعديل بيانات المباراة' : 'إضافة مباراة جديدة'}
          </h2>
          
          <form onSubmit={handleAddOrEditMatch} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teams Input */}
              <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-primary mb-2">بيانات الفرق</h3>
                <div>
                  <label className="block text-sm mb-1.5 text-muted-foreground">الفريق الأول (المضيف)</label>
                  <input type="text" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white" required placeholder="مثال: ريال مدريد" value={formData.team1Name} onChange={e => setFormData({...formData, team1Name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-muted-foreground">شعار الفريق الأول (اختياري)</label>
                  <input type="file" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-white/10 rounded-xl bg-background/50" onChange={e => setTeam1LogoFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <div className="h-px bg-white/5 my-2"></div>
                <div>
                  <label className="block text-sm mb-1.5 text-muted-foreground">الفريق الثاني (الضيف)</label>
                  <input type="text" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white" required placeholder="مثال: برشلونة" value={formData.team2Name} onChange={e => setFormData({...formData, team2Name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-muted-foreground">شعار الفريق الثاني (اختياري)</label>
                  <input type="file" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-white/10 rounded-xl bg-background/50" onChange={e => setTeam2LogoFile(e.target.files ? e.target.files[0] : null)} />
                </div>
              </div>

              {/* Match Info Input */}
              <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-amber-400 mb-2">تفاصيل المباراة</h3>
                <div>
                  <label className="block text-sm mb-1.5 text-muted-foreground">اسم البطولة / الدوري</label>
                  <input type="text" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white" required placeholder="دوري أبطال أوروبا" value={formData.league} onChange={e => setFormData({...formData, league: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-muted-foreground">تاريخ ووقت المباراة</label>
                  <input type="datetime-local" className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white" required value={formData.matchDate} onChange={e => setFormData({...formData, matchDate: e.target.value})} />
                </div>
                {editingMatchId && (
                  <div>
                    <label className="block text-sm mb-1.5 text-muted-foreground">حالة المباراة</label>
                    <select className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="UPCOMING">قادمة (UPCOMING)</option>
                      <option value="LIVE">جارية الآن (LIVE)</option>
                      <option value="CANCELLED">ملغاة (CANCELLED)</option>
                    </select>
                  </div>
                )}
                
                <h3 className="text-lg font-bold mt-8 mb-2 text-primary">الاحتمالات (Odds)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1 text-muted-foreground text-center line-clamp-1" title={`فوز ${formData.team1Name || 'الأول'}`}>فوز {formData.team1Name || 'الأول'}</label>
                    <input type="number" step="0.01" className="w-full bg-background/50 border border-white/10 rounded-xl px-2 py-2 outline-none focus:border-primary text-center font-bold text-primary" required value={formData.odds.team1Win} onChange={e => setFormData({...formData, odds: {...formData.odds, team1Win: parseFloat(e.target.value)}})} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-muted-foreground text-center">تعادل</label>
                    <input type="number" step="0.01" className="w-full bg-background/50 border border-white/10 rounded-xl px-2 py-2 outline-none focus:border-amber-500 text-center font-bold text-amber-500" required value={formData.odds.draw} onChange={e => setFormData({...formData, odds: {...formData.odds, draw: parseFloat(e.target.value)}})} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-muted-foreground text-center line-clamp-1" title={`فوز ${formData.team2Name || 'الثاني'}`}>فوز {formData.team2Name || 'الثاني'}</label>
                    <input type="number" step="0.01" className="w-full bg-background/50 border border-white/10 rounded-xl px-2 py-2 outline-none focus:border-blue-500 text-center font-bold text-blue-500" required value={formData.odds.team2Win} onChange={e => setFormData({...formData, odds: {...formData.odds, team2Win: parseFloat(e.target.value)}})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <Button type="submit" className="flex-1 h-14 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                {editingMatchId ? 'حفظ التعديلات' : 'نشر المباراة'}
              </Button>
              {editingMatchId && (
                <Button type="button" variant="outline" className="flex-1 h-14 text-lg" onClick={() => { setShowAddForm(false); setEditingMatchId(null); }}>
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Matches List */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead className="bg-secondary/40 border-b border-white/5">
              <tr>
                <th className="p-5 font-bold text-muted-foreground">المباراة</th>
                <th className="p-5 font-bold text-muted-foreground">الدوري</th>
                <th className="p-5 font-bold text-muted-foreground">التاريخ</th>
                <th className="p-5 font-bold text-muted-foreground text-center">الحالة</th>
                <th className="p-5 font-bold text-muted-foreground text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matches.map(match => (
                <tr key={match.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-left font-bold text-white group-hover:text-primary transition-colors">{match.team1Name}</div>
                      <div className="px-2 py-1 bg-white/5 rounded text-xs text-muted-foreground font-medium">ضد</div>
                      <div className="flex-1 text-right font-bold text-white group-hover:text-blue-400 transition-colors">{match.team2Name}</div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-muted-foreground">
                      <Trophy size={14} className="text-amber-400" />
                      {match.league}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays size={14} />
                      {new Date(match.matchDate).toLocaleDateString('ar-EG')}
                      <Clock size={14} className="ml-1 opacity-50" />
                      {new Date(match.matchDate).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      match.status === 'FINISHED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      match.status === 'LIVE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {match.status === 'LIVE' && <Activity size={12} className="animate-pulse" />}
                      {match.status === 'FINISHED' ? 'مكتملة' : match.status === 'LIVE' ? 'جارية' : 'قادمة'}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {match.status !== 'FINISHED' && (
                      <div className="flex gap-2 justify-center flex-wrap">
                        <Button variant="outline" className="h-8 px-4 text-xs border-white/10 hover:bg-white/10 text-white" onClick={() => handleEditClick(match)}>تعديل</Button>
                        <div className="w-px h-8 bg-white/10 mx-1"></div>
                        <Button variant="outline" className="h-8 px-3 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={() => handleSettle(match.id, 'TEAM_1_WIN')}>فوز 1</Button>
                        <Button variant="outline" className="h-8 px-3 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10" onClick={() => handleSettle(match.id, 'DRAW')}>تعادل</Button>
                        <Button variant="outline" className="h-8 px-3 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10" onClick={() => handleSettle(match.id, 'TEAM_2_WIN')}>فوز 2</Button>
                      </div>
                    )}
                    {match.status === 'FINISHED' && (
                      <div className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-bold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                        <CheckCircle size={14} className="text-emerald-400" />
                        نتيجة: {match.result === 'TEAM_1_WIN' ? match.team1Name : match.result === 'TEAM_2_WIN' ? match.team2Name : 'التعادل'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Trophy size={48} className="opacity-20 mb-4" />
                      <p>لا توجد مباريات حالياً.</p>
                      <p className="text-sm opacity-60">قم بإضافة مباراة جديدة للبدء.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
