import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Mail, Wallet, Clock, UserCheck, UserX, DollarSign, X, Gift, ChevronDown } from 'lucide-react';
import { HeroSection } from '../../components/ui/HeroSection';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

type OperationType = 'DEPOSIT' | 'WITHDRAW' | 'BONUS_ADD' | 'BONUS_DEDUCT';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState<string>('');
  const [operationType, setOperationType] = useState<OperationType>('DEPOSIT');
  const [walletNote, setWalletNote] = useState('');
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
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
      toast.success(`تم ${currentStatus ? 'إيقاف' : 'تنشيط'} المستخدم بنجاح`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('حدث خطأ أثناء تغيير حالة المستخدم');
    }
  };

  const handleOpenWalletModal = (user: any) => {
    setSelectedUser(user);
    setWalletAmount('');
    setOperationType('DEPOSIT');
    setWalletNote('');
    setIsWalletModalOpen(true);
  };

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !walletAmount) return;
    setIsWalletLoading(true);

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

      toast.success(`تم ${opConfig[operationType].label.replace(' (+)', '').replace(' (−)', '')} بقيمة $${walletAmount} بنجاح`);
      fetchUsers();
      setIsWalletModalOpen(false);
    } catch (error: any) {
      console.error('Failed to manage wallet:', error);
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء تعديل الرصيد');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative group flex flex-col h-full">
                {/* Header: Avatar, Name, Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm shrink-0">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-primary transition-colors leading-tight">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                        <Mail size={10} className="shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 ms-2">
                    {user.isActive ? (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold">
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-md text-[10px] font-bold">
                        محظور
                      </span>
                    )}
                  </div>
                </div>

                {/* Balance Section - Compact */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">الرصيد</div>
                    <div className="font-bold text-emerald-600 text-xs">${user.wallet?.balance?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">معلق</div>
                    <div className="font-bold text-amber-500 text-xs">${user.wallet?.lockedBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">بونص</div>
                    <div className="font-bold text-blue-500 text-xs">${user.wallet?.bonusBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    انضم: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenWalletModal(user)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-primary hover:text-white transition-colors text-[11px] font-bold flex items-center gap-1"
                    >
                      <DollarSign size={12} /> تعديل
                    </button>
                    <button
                      onClick={() => toggleStatus(user.id, user.isActive)}
                      className={`px-3 py-1.5 rounded-lg transition-colors text-[11px] font-bold ${
                        user.isActive 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {user.isActive ? 'إيقاف' : 'تنشيط'}
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
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 pt-24 pb-20 md:py-6 pointer-events-none">
            <div className="bg-white w-full max-w-md max-h-[75vh] md:max-h-[85vh] flex flex-col rounded-2xl shadow-2xl pointer-events-auto border border-slate-200">
              
              {/* Header */}
              <div className="border-b border-slate-100 py-4 px-5 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                  إدارة الرصيد
                  <span className="text-slate-400 text-sm font-normal">— {selectedUser.firstName} {selectedUser.lastName}</span>
                </h3>
                <button 
                  onClick={() => setIsWalletModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-5 overflow-y-auto custom-scrollbar">
                {/* Current Balances */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-slate-500 font-bold mb-1">الرصيد الحقيقي</div>
                    <div className="font-black text-emerald-600 text-sm">${selectedUser.wallet?.balance?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-slate-500 font-bold mb-1">رصيد معلق</div>
                    <div className="font-black text-amber-500 text-sm">${selectedUser.wallet?.lockedBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-slate-500 font-bold mb-1">رصيد بونص</div>
                    <div className="font-black text-blue-500 text-sm">${selectedUser.wallet?.bonusBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>

                <form onSubmit={handleWalletSubmit} className="space-y-4">
                  {/* Operation Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">نوع العملية</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(opConfig) as OperationType[]).map((op) => (
                        <label
                          key={op}
                          className={`flex items-center justify-center text-center gap-1.5 p-2.5 rounded-xl border cursor-pointer transition-all text-xs font-bold ${
                            operationType === op
                              ? `border-${opConfig[op].borderColor.split('-')[1]}-500 bg-${opConfig[op].bgColor.split('-')[1]}-50 text-${opConfig[op].textColor.split('-')[1]}-700 shadow-sm ring-1 ring-${opConfig[op].borderColor.split('-')[1]}-500`
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
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">المبلغ ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={14} className="text-slate-400 ms-3" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={walletAmount}
                        onChange={(e) => setWalletAmount(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-200 rounded-xl ps-9 pe-4 font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Note (for real balance ops only) */}
                  {(operationType === 'DEPOSIT' || operationType === 'WITHDRAW') && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">ملاحظة (اختياري)</label>
                      <input
                        type="text"
                        value={walletNote}
                        onChange={(e) => setWalletNote(e.target.value)}
                        className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        placeholder="مثال: ايداع يدوي بطلب العميل"
                      />
                    </div>
                  )}


                </form>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-100 p-4 shrink-0 bg-slate-50/50 rounded-b-2xl flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 bg-white text-xs font-bold h-10"
                  onClick={() => setIsWalletModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={handleWalletSubmit}
                  className="flex-1 text-xs font-bold h-10 shadow-md"
                  disabled={isWalletLoading || !walletAmount}
                >
                  {isWalletLoading ? 'جاري التنفيذ...' : 'تأكيد العملية'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
