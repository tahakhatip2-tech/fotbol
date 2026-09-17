import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Trash2, Flag } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';

export const AdminLeaguesPage: React.FC = () => {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [logo, setLogo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeagues = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/leagues');
      setLeagues(res.data);
    } catch (error) {
      console.error('Failed to fetch leagues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleAddLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      await api.post('/admin/leagues', { name, logo, country });
      setName('');
      setCountry('');
      setLogo('');
      fetchLeagues();
    } catch (error: any) {
      alert(error.response?.data?.error || 'حدث خطأ أثناء الإضافة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدوري؟')) return;
    try {
      await api.delete(`/admin/leagues/${id}`);
      fetchLeagues();
    } catch (error) {
      alert('خطأ أثناء الحذف');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="text-primary" size={32} />
          إدارة الدوريات
        </h1>
        <p className="text-muted-foreground mt-2">أضف واحذف الدوريات المتاحة في النظام</p>
      </div>

      {/* Add League Form */}
      <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="text-primary" size={20} /> إضافة دوري جديد
        </h2>
        <form onSubmit={handleAddLeague} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <label className="block text-sm text-muted-foreground mb-1">اسم الدوري *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2 px-3 outline-none focus:border-primary text-sm"
              placeholder="مثال: الدوري الإنجليزي"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-muted-foreground mb-1">البلد (اختياري)</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2 px-3 outline-none focus:border-primary text-sm"
              placeholder="مثال: إنجلترا"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-muted-foreground mb-1">رابط الشعار (اختياري)</label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2 px-3 outline-none focus:border-primary text-sm text-left"
              placeholder="https://..."
              dir="ltr"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Button type="submit" disabled={isSubmitting || !name} className="w-full h-10">
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </div>
        </form>
      </div>

      {/* Leagues List */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-right table-fixed">
          <thead className="bg-background/40 backdrop-blur-md border-b border-border/40 text-muted-foreground text-[11px] sm:text-xs md:text-sm font-medium">
            <tr>
              <th className="px-2 py-3 md:p-4 w-[20%] text-center">الشعار</th>
              <th className="px-2 py-3 md:p-4 w-[45%]">الدوري</th>
              <th className="px-2 py-3 md:p-4 w-[20%] text-center">البلد</th>
              <th className="px-2 py-3 md:p-4 w-[15%] text-center">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-4 md:p-8 text-center text-muted-foreground text-xs md:text-sm">جاري التحميل...</td>
              </tr>
            ) : leagues.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 md:p-8 text-center text-muted-foreground text-xs md:text-sm">لا توجد دوريات مضافة حالياً.</td>
              </tr>
            ) : (
              leagues.map((league) => (
                <tr key={league.id} className="border-b border-border/20 hover:bg-white/5 transition-colors">
                  <td className="px-2 py-3 md:p-4 text-center">
                    {league.logo ? (
                      <img src={league.logo} alt={league.name} className="w-6 h-6 md:w-8 md:h-8 object-contain mx-auto rounded-full bg-white/10 p-0.5" />
                    ) : (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border border-border flex items-center justify-center mx-auto text-muted-foreground">
                        <Trophy size={12} />
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-3 md:p-4 font-bold text-white text-[11px] sm:text-sm truncate">
                    {league.name}
                  </td>
                  <td className="px-2 py-3 md:p-4 text-center text-muted-foreground text-[10px] sm:text-xs truncate">
                    {league.country ? (
                      <span className="flex items-center justify-center gap-1">
                        <Flag size={10} className="hidden sm:block" /> {league.country}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-2 py-3 md:p-4 text-center">
                    <button 
                      onClick={() => handleDelete(league.id)}
                      className="p-1.5 md:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
