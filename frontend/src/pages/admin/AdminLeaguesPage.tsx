import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Trash2, Flag } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { HeroSection } from '../../components/ui/HeroSection';

const LeagueCard: React.FC<{ league: any; onDelete: (id: string) => void }> = ({ league, onDelete }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        {league.logo ? (
          <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain rounded-full border border-slate-100 p-1" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
            <Trophy size={16} />
          </div>
        )}
        <div>
          <div className="font-bold text-slate-800 text-sm">{league.name}</div>
          {league.country && (
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Flag size={10} /> {league.country}
            </div>
          )}
        </div>
      </div>
      <button 
        onClick={() => onDelete(league.id)}
        className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shrink-0"
        title="حذف"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export const AdminLeaguesPage: React.FC = () => {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const formData = new FormData();
      formData.append('name', name);
      if (country) formData.append('country', country);
      if (logoFile) formData.append('logo', logoFile);

      await api.post('/admin/leagues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setName('');
      setCountry('');
      setLogoFile(null);
      setIsModalOpen(false);
      fetchLeagues();
    } catch (error: any) {
      alert(error.response?.data?.error || 'حدث خطأ أثناء الإضافة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدوري؟ ستبقى المباريات المرتبطة به ولكن بدون دوري.')) return;
    try {
      await api.delete(`/admin/leagues/${id}`);
      fetchLeagues();
    } catch (error) {
      alert('خطأ أثناء الحذف');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-6">
      <HeroSection 
        title="إدارة الدوريات"
        subtitle="أضف واحذف الدوريات والبطولات المتاحة في المنصة."
      >
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-blue-400/50 text-blue-800 hover:bg-white/60 transition-all rounded-xl shadow-sm px-6 py-2.5 font-bold"
          >
            <Plus size={18} className="text-blue-600" />
            <span>إضافة دوري جديد</span>
          </button>
        </div>
      </HeroSection>

      {/* Add League Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plus size={20} />
              </div>
              إضافة دوري جديد
            </h2>
            
            <form onSubmit={handleAddLeague} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1.5">اسم الدوري *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-sm transition-all"
                  placeholder="مثال: الدوري الإنجليزي"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1.5">البلد (اختياري)</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-sm transition-all"
                  placeholder="مثال: إنجلترا"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1.5">شعار الدوري (صورة من الجهاز)</label>
                <div className="flex items-center gap-4">
                  {logoFile && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm shrink-0">
                      <img src={URL.createObjectURL(logoFile)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none focus:border-blue-500 focus:bg-white text-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !name} 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all text-base flex justify-center items-center"
                >
                  {isSubmitting ? 'جاري الإضافة...' : 'إضافة الدوري'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Leagues List */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : leagues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 flex flex-col items-center">
            <Trophy size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">لا توجد دوريات مضافة حالياً.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-3">
              {leagues.map((league) => (
                <LeagueCard key={league.id} league={league} onDelete={handleDelete} />
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-center w-24">الشعار</th>
                      <th className="px-6 py-4 font-bold">الدوري</th>
                      <th className="px-6 py-4 font-bold">البلد</th>
                      <th className="px-6 py-4 font-bold text-center w-24">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leagues.map((league) => (
                      <tr key={league.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 text-center">
                          {league.logo ? (
                            <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain mx-auto rounded-full border border-slate-100 p-1 bg-white shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-500">
                              <Trophy size={16} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{league.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          {league.country ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-xs font-bold">
                              <Flag size={12} className="text-slate-400" /> {league.country}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleDelete(league.id)}
                            className="w-9 h-9 mx-auto rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
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
