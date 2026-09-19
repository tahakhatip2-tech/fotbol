import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Mail, Wallet, Clock, UserCheck, UserX, DollarSign, X, Gift, ChevronDown } from 'lucide-react';
import { HeroSection } from '../../components/ui/HeroSection';
import { Button } from '../../components/ui/Button';

type OperationType = 'DEPOSIT' | 'WITHDRAW' | 'BONUS_ADD' | 'BONUS_DEDUCT';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState<string>('');
  const [operationType, setOperationType] = useState<OperationType>('DEPOSIT');
  const [walletNote, setWalletNote] = useState('');
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [walletSuccess, setWalletSuccess] = useState('');
  const [walletError, setWalletError] = useState('');

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
    setOperationType('DEPOSIT');
    setWalletNote('');
    setWalletSuccess('');
    setWalletError('');
    setIsWalletModalOpen(true);
  };

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !walletAmount) return;
    setIsWalletLoading(true);
    setWalletSuccess('');
    setWalletError('');
    try {
      const isBonus = operationType === 'BONUS_ADD' || operationType === 'BONUS_DEDUCT';

      if (isBonus) {
        await api.post(`/admin/users/${selectedUser.id}/bonus`, {
          action: operationType === 'BONUS_ADD' ? 'ADD' : 'DEDUCT',
          amount: Number(walletAmount)
        });
      } else {
        await api.post(`/admin/users/${selectedUser.id}/wallet`, {
          amount: Number(walletAmount),
          type: operationType,
          note: walletNote
        });
      }

      setWalletSuccess('تمت العملية بنجاح ✅');
      fetchUsers();
      setTimeout(() => {
        setIsWalletModalOpen(false);
        setWalletSuccess('');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to manage wallet:', error);
      setWalletError(error.response?.data?.error || 'حدث خطأ أثناء تعديل الرصيد');
    } finally {
      setIsWalletLoading(false);
    }
  };

  const opConfig: Record<OperationType, { label: string; color: string; borderColor: string; bgColor: string; textColor: string }> = {
    DEPOSIT:      { label: 'إضافة رصيد حقيقي (+)', color: 'emerald', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
    WITHDRAW:     { label: 'خصم رصيد حقيقي (−)',  color: 'rose',    borderColor: 'border-rose-500',    bgColor: 'bg-rose-50',    textColor: 'text-rose-700' },
    BONUS_ADD:    { label: 'منح بونص (+)',          color: 'blue',    borderColor: 'border-blue-500',    bgColor: 'bg-blue-50',    textColor: 'text-blue-700' },
    BONUS_DEDUCT: { label: 'سحب بونص (−)',          color: 'orange',  borderColor: 'border-orange-500',  bgColor: 'bg-orange-50',  textColor: 'text-orange-700' },
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

                <div className="flex items-center gap-4 mb-4 relative z-10">
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

                {/* Balance Grid — 3 boxes */}
                <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
                  <div className="bg-emerald-500/5 rounded-xl p-2.5 border border-emerald-500/10">
                    <div className="text-[9px] text-muted-foreground font-medium mb-0.5 flex items-center gap-0.5">
                      <Wallet size={9} className="text-emerald-400" /> رصيد
                    </div>
                    <div className="font-black text-emerald-500 text-xs">
                      ${user.wallet?.balance?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="bg-amber-500/5 rounded-xl p-2.5 border border-amber-500/10">
                    <div className="text-[9px] text-muted-foreground font-medium mb-0.5 flex items-center gap-0.5">
                      <Clock size={9} className="text-amber-500" /> معلق
                    </div>
                    <div className="font-black text-amber-500 text-xs">
                      ${user.wallet?.lockedBalance?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="bg-blue-500/5 rounded-xl p-2.5 border border-blue-500/10">
                    <div className="text-[9px] text-muted-foreground font-medium mb-0.5 flex items-center gap-0.5">
                      <Gift size={9} className="text-blue-500" /> بونص
                    </div>
                    <div className="font-black text-blue-500 text-xs">
                      ${user.wallet?.bonusBalance?.toFixed(2) || '0.00'}
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

      {/* Wallet & Bonus Modal */}
      {isWalletModalOpen && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm transition-opacity" 
            onClick={() => setIsWalletModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 pointer-events-none">
            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-border">
              
              {/* Header */}
              <div className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Wallet size={20} />
                  إدارة رصيد — {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <button 
                  onClick={() => setIsWalletModalOpen(false)} 
                  className="hover:opacity-80 p-1 bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {/* Current Balances */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                    <div className="text-[10px] text-emerald-700 font-bold mb-0.5">الرصيد الحقيقي</div>
                    <div className="font-black text-emerald-600 text-sm">${selectedUser.wallet?.balance?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
                    <div className="text-[10px] text-amber-700 font-bold mb-0.5">رصيد معلق</div>
                    <div className="font-black text-amber-600 text-sm">${selectedUser.wallet?.lockedBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center">
                    <div className="text-[10px] text-blue-700 font-bold mb-0.5">رصيد بونص</div>
                    <div className="font-black text-blue-600 text-sm">${selectedUser.wallet?.bonusBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>

                <form onSubmit={handleWalletSubmit} className="space-y-4">
                  {/* Operation Type */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">نوع العملية</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(opConfig) as OperationType[]).map((op) => (
                        <label
                          key={op}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all text-xs font-bold ${
                            operationType === op
                              ? `${opConfig[op].borderColor} ${opConfig[op].bgColor} ${opConfig[op].textColor}`
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="opType"
                            className="hidden"
                            checked={operationType === op}
                            onChange={() => setOperationType(op)}
                          />
                          {opConfig[op].label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">المبلغ ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Note (for real balance ops only) */}
                  {(operationType === 'DEPOSIT' || operationType === 'WITHDRAW') && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">ملاحظة (اختياري)</label>
                      <input
                        type="text"
                        value={walletNote}
                        onChange={(e) => setWalletNote(e.target.value)}
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-primary transition-all"
                        placeholder="مثال: ايداع يدوي بطلب العميل"
                      />
                    </div>
                  )}

                  {/* Feedback */}
                  {walletError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
                      {walletError}
                    </div>
                  )}
                  {walletSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl text-sm font-bold text-center">
                      {walletSuccess}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
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
