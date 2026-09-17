import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { HeroSection } from '../components/ui/HeroSection';

export const WalletPage: React.FC = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0.00);
  const [lockedBalance, setLockedBalance] = useState(0.00);
  const [bonusBalance, setBonusBalance] = useState(0.00);
  const [lockedBonusBalance, setLockedBonusBalance] = useState(0.00);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod] = useState('USDT TRC-20');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/wallet');
      if (res.data && res.data.wallet) {
        setBalance(res.data.wallet.balance);
        setLockedBalance(res.data.wallet.lockedBalance);
        setBonusBalance(res.data.wallet.bonusBalance || 0);
        setLockedBonusBalance(res.data.wallet.lockedBonusBalance || 0);
      }
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !depositAmount) return alert('الرجاء إدخال المبلغ ورفع صورة الإيصال');
    
    const formData = new FormData();
    formData.append('amount', depositAmount);
    formData.append('method', depositMethod);
    formData.append('receipt', receiptFile);

    try {
      await api.post('/wallet/deposit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('تم إرسال طلب الإيداع بنجاح. سيتم مراجعته من قبل الإدارة.');
      setShowDeposit(false);
      setDepositAmount('');
      setReceiptFile(null);
      fetchData();
    } catch (err) {
      alert('حدث خطأ أثناء رفع الطلب');
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdrawAddress) return alert('الرجاء إدخال المبلغ وعنوان المحفظة');
    if (Number(withdrawAmount) > balance) return alert('الرصيد غير كافٍ');

    try {
      await api.post('/wallet/withdraw', {
        amount: withdrawAmount,
        address: withdrawAddress,
        method: 'USDT TRC-20'
      });
      alert('تم إرسال طلب السحب بنجاح. سيتم تحويل المبلغ قريباً.');
      setShowWithdraw(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
      fetchData();
    } catch (err) {
      alert('حدث خطأ أثناء إرسال الطلب');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <HeroSection 
        title={`$${balance.toFixed(2)}`}
        subtitle="الرصيد المتاح"
        minHeight="min-h-[45vh]"
        badge="💳 محفظتي"
      >
        <div className="flex gap-4 mt-6 justify-center w-full max-w-sm mx-auto">
          <Button size="lg" className="flex-1 shadow-[0_0_15px_rgba(34,197,94,0.4)] text-lg" onClick={() => setShowDeposit(true)}>إيداع</Button>
          <Button size="lg" variant="outline" className="flex-1 border-slate-300 bg-white/50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-lg" onClick={() => setShowWithdraw(true)}>سحب</Button>
        </div>
      </HeroSection>
      
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <h2 className="text-sm md:text-lg text-slate-600 mb-2 relative z-10">الرصيد المعلق (في الرهانات)</h2>
            <div className="text-2xl md:text-4xl font-bold text-slate-400 relative z-10">${lockedBalance.toFixed(2)}</div>
          </div>
          
          <div className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden group border border-blue-500/20 bg-blue-50/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <h2 className="text-sm md:text-lg text-blue-600 mb-2 relative z-10 font-bold">رصيد البونص 🎁</h2>
            <div className="text-2xl md:text-4xl font-bold text-blue-600 relative z-10">${bonusBalance.toFixed(2)}</div>
          </div>

          <div className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden group border border-slate-200/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <h2 className="text-sm md:text-lg text-slate-500 mb-2 relative z-10">البونص المعلق</h2>
            <div className="text-2xl md:text-4xl font-bold text-slate-400 relative z-10">${lockedBonusBalance.toFixed(2)}</div>
          </div>
        </div>

      {showDeposit && (
        <div className="glass p-8 rounded-2xl mb-12 border border-border/20">
          <h3 className="text-2xl font-bold mb-6 text-primary">طلب إيداع</h3>
          <div className="bg-background/50 p-4 rounded-xl mb-6 font-mono text-sm border border-border/50">
            <p className="text-muted-foreground mb-2">عنوان الإيداع (USDT TRC-20):</p>
            <div className="flex justify-between items-center bg-card p-3 rounded-lg">
              <span className="truncate break-all">T9yD14Nj9j7xAB4dbGeiX9h8iVvK9jxyz1</span>
              <Button variant="outline" className="h-8 px-3 ml-4" onClick={() => navigator.clipboard.writeText('T9yD14Nj9j7xAB4dbGeiX9h8iVvK9jxyz1')}>نسخ</Button>
            </div>
          </div>
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">المبلغ (USD)</label>
              <input type="number" required value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block mb-2 text-sm">صورة إثبات التحويل (Screenshot)</label>
              <input type="file" accept="image/*" required onChange={e => setReceiptFile(e.target.files?.[0] || null)} className="w-full bg-background border border-border rounded-lg p-2 outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">إرسال الطلب</Button>
              <Button variant="outline" onClick={() => setShowDeposit(false)}>إلغاء</Button>
            </div>
          </form>
        </div>
      )}

      {showWithdraw && (
        <div className="glass p-8 rounded-2xl mb-12 border border-border/20">
          <h3 className="text-2xl font-bold mb-6 text-primary">طلب سحب</h3>
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">المبلغ (USD)</label>
              <input type="number" max={balance} required value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary" />
              <span className="text-xs text-muted-foreground mt-1">الحد الأقصى: ${balance.toFixed(2)}</span>
            </div>
            <div>
              <label className="block mb-2 text-sm">عنوان محفظتك (USDT TRC-20)</label>
              <input type="text" required value={withdrawAddress} onChange={e => setWithdrawAddress(e.target.value)} className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary font-mono" placeholder="T..." />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">إرسال الطلب</Button>
              <Button variant="outline" onClick={() => setShowWithdraw(false)}>إلغاء</Button>
            </div>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">سجل المعاملات</h2>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-right min-w-[500px]">
          <thead className="bg-background/40 backdrop-blur-md border-b border-border/40 text-muted-foreground text-sm font-medium">
            <tr>
              <th className="p-4 whitespace-nowrap">النوع</th>
              <th className="p-4 whitespace-nowrap">المبلغ</th>
              <th className="p-4 whitespace-nowrap">التاريخ</th>
              <th className="p-4 whitespace-nowrap">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">جاري التحميل...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">لا توجد معاملات سابقة.</td>
              </tr>
            ) : (
            transactions.map(tx => (
              <tr key={tx.id} className="border-b border-border/40 hover:bg-card/20 last:border-0">
                <td className="p-4 font-medium whitespace-nowrap">{tx.type === 'DEPOSIT' ? 'إيداع' : tx.type === 'WITHDRAWAL' ? 'سحب' : tx.type === 'BET_PLACED' ? 'رهان' : 'ربح رهان'}</td>
                <td className={`p-4 font-bold font-mono whitespace-nowrap ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </td>
                <td className="p-4 text-sm whitespace-nowrap">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="p-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : tx.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};
