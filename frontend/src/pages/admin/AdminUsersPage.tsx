import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Mail, Wallet, Clock, UserCheck, UserX, DollarSign, X } from 'lucide-react';
import { HeroSection } from '../../components/ui/HeroSection';
import { Button } from '../../components/ui/Button';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState<string>('');
  const [walletType, setWalletType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    if (!window.confirm(`هل أنت متأكد أنك تريد ${currentStatus ? 'إيقاف' : 'تنشيط'} هذا المستخدم؟`)) return;
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('حدث خطأ أثناء تغيير حالة المستخدم');
    }
  };

  const handleOpenWalletModal = (user: any) => {
    setSelectedUser(user);
    setWalletAmount('');
    setWalletType('DEPOSIT');
    setIsWalletModalOpen(true);
  };

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !walletAmount) return;
    setIsWalletLoading(true);
    try {
      await api.post(`/admin/users/${selectedUser.id}/wallet`, {
        amount: Number(walletAmount),
        type: walletType
      });
      setIsWalletModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to manage wallet:', error);
      alert(error.response?.data?.error || 'حدث خطأ أثناء تعديل الرصيد');
    } finally {
      setIsWalletLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <HeroSection 
        title={
          <>
            إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">المستخدمين</span>
          </>
        }
        subtitle="متابعة حسابات المستخدمين وأرصدتهم."
        badge="لوحة الإدارة ⚙️"
        minHeight="min-h-[40vh]"
      />

      <div className="container mx-auto px-4 mt-2 relative z-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-48 glass rounded-3xl">
             <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="glass rounded-3xl text-center py-16 text-muted-foreground flex flex-col items-center">
            <Users size={48} className="opacity-20 mb-4" />
            <p>لا يوجد مستخدمين مسجلين.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id} className="glass rounded-3xl p-5 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors -z-10 pointer-events-none"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold backdrop-blur-md">
                      <UserCheck size={12} /> نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold backdrop-blur-md">
                      <UserX size={12} /> محظور
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] shrink-0">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-primary transition-colors">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 truncate">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                  <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1 flex items-center gap-1">
                      <Wallet size={10} className="text-emerald-400" /> الرصيد المتاح
                    </div>
                    <div className="font-black text-emerald-400 text-sm">
                      ${user.wallet?.balance?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="bg-amber-500/5 rounded-2xl p-3 border border-amber-500/10">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1 flex items-center gap-1">
                      <Clock size={10} className="text-amber-500" /> الرصيد المعلق
                    </div>
                    <div className="font-black text-amber-500 text-sm">
                      ${user.wallet?.lockedBalance?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3 relative z-10">
                  <div className="text-[11px] text-muted-foreground">
                    انضم: {new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenWalletModal(user)}
                      className="flex-1 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center gap-1"
                    >
                      <DollarSign size={12} /> تعديل الرصيد
                    </button>
                    <button
                      onClick={() => toggleStatus(user.id, user.isActive)}
                      className={`flex-1 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                        user.isActive 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {user.isActive ? 'إيقاف الحساب' : 'تنشيط الحساب'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      {isWalletModalOpen && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm transition-opacity" 
            onClick={() => setIsWalletModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 pointer-events-none">
            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-border">
              <div className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Wallet size={20} />
                  إدارة رصيد ({selectedUser.firstName})
                </h3>
                <button 
                  onClick={() => setIsWalletModalOpen(false)} 
                  className="hover:opacity-80 p-1 bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleWalletSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">نوع العملية</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${walletType === 'DEPOSIT' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <input type="radio" name="type" className="hidden" checked={walletType === 'DEPOSIT'} onChange={() => setWalletType('DEPOSIT')} />
                        إيداع (+)
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${walletType === 'WITHDRAW' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <input type="radio" name="type" className="hidden" checked={walletType === 'WITHDRAW'} onChange={() => setWalletType('WITHDRAW')} />
                        سحب (-)
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">المبلغ ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsWalletModalOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isWalletLoading || !walletAmount}
                    >
                      {isWalletLoading ? 'جاري التنفيذ...' : 'تأكيد العملية'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
