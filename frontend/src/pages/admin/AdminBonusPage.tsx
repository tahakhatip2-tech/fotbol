import React, { useState, useEffect } from 'react';
import { Gift, Plus, Minus, Search, X } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { HeroSection } from '../../components/ui/HeroSection';

export const AdminBonusPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState<number | ''>('');
  const [actionType, setActionType] = useState<'ADD' | 'DEDUCT'>('ADD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredUsers(users.filter(u => 
        u.email?.toLowerCase().includes(lower) || 
        u.firstName?.toLowerCase().includes(lower) || 
        u.lastName?.toLowerCase().includes(lower)
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await api.post(`/admin/users/${selectedUser.id}/bonus`, {
        action: actionType,
        amount: Number(amount)
      });
      toast.success(`تم ${actionType === 'ADD' ? 'إضافة' : 'خصم'} البونص بنجاح`);
      closeModal();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء معالجة الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (user: any) => {
    setSelectedUser(user);
    setAmount('');
    setActionType('ADD');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setAmount('');
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <HeroSection 
        title="إدارة البونص"
        subtitle="أضف أو اخصم رصيد بونص ترويجي للمستخدمين"
        badge="لوحة التحكم ⚙️"
        icon={<Gift size={24} className="text-primary" />}
        minHeight="min-h-[25vh]"
      >
        <div className="mt-6 max-w-sm mx-auto relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو البريد..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm text-slate-800"
          />
        </div>
      </HeroSection>

      <div className="container mx-auto px-2 sm:px-4 max-w-5xl relative z-20 -mt-6 mb-8">
        <div className="glass rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-right table-fixed">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] sm:text-xs md:text-sm font-bold">
              <tr>
                <th className="px-2 py-3 md:p-4 w-[35%]">المستخدم</th>
                <th className="px-1 py-3 md:p-4 w-[20%] text-center md:text-right">حقيقي</th>
                <th className="px-1 py-3 md:p-4 w-[20%] text-center md:text-right text-blue-500">بونص 🎁</th>
                <th className="px-1 py-3 md:p-4 w-[25%] text-center">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-4 md:p-8 text-center text-slate-400 text-xs md:text-sm">جاري تحميل البيانات...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 md:p-8 text-center text-slate-400 text-xs md:text-sm">لا يوجد مستخدمين.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 py-3 md:p-4 overflow-hidden">
                      <div className="font-bold text-slate-800 text-[11px] sm:text-xs md:text-sm truncate w-full">{user.firstName} {user.lastName}</div>
                      <div className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 mt-0.5 truncate w-full">{user.email}</div>
                    </td>
                    <td className="px-1 py-3 md:p-4 font-mono font-bold text-[10px] sm:text-xs md:text-sm text-slate-600 text-center md:text-right">${user.wallet?.balance?.toFixed(2) || '0.00'}</td>
                    <td className="px-1 py-3 md:p-4 font-mono font-bold text-[10px] sm:text-xs md:text-sm text-blue-500 text-center md:text-right">${user.wallet?.bonusBalance?.toFixed(2) || '0.00'}</td>
                    <td className="px-1 py-3 md:p-4 text-center">
                      <Button 
                        size="sm" 
                        onClick={() => openModal(user)} 
                        className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 h-7 px-2 text-[10px] sm:h-8 sm:px-3 sm:text-xs md:h-9 md:px-4 md:text-sm shadow-sm transition-all"
                      >
                        إدارة
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bonus Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-muted p-4 flex justify-between items-center border-b border-border">
              <h3 className="font-bold text-lg text-slate-900">إدارة بونص: {selectedUser.firstName}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-slate-900 p-1"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex bg-background border border-border rounded-xl overflow-hidden mb-6 p-1">
                <button
                  type="button"
                  onClick={() => setActionType('ADD')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${actionType === 'ADD' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  <Plus size={16} />
                  إضافة بونص
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('DEDUCT')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${actionType === 'DEDUCT' ? 'bg-red-500 text-slate-900 shadow-md' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  <Minus size={16} />
                  خصم بونص
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">المبلغ (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary text-lg"
                    placeholder="0.00"
                  />
                </div>
                {actionType === 'DEDUCT' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    الحد الأقصى للخصم: ${selectedUser.wallet?.bonusBalance?.toFixed(2) || '0.00'}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className={`w-full text-lg h-12 ${actionType === 'DEDUCT' && 'bg-red-600 hover:bg-red-700'}`}
                disabled={isSubmitting || !amount || Number(amount) <= 0 || (actionType === 'DEDUCT' && Number(amount) > (selectedUser.wallet?.bonusBalance || 0))}
              >
                {isSubmitting ? 'جاري التنفيذ...' : actionType === 'ADD' ? 'إضافة الرصيد' : 'خصم الرصيد'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
