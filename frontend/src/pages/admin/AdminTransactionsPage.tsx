import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Receipt, Check, X, CreditCard, ExternalLink } from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(action === 'APPROVE' ? 'هل أنت متأكد من قبول هذه المعاملة؟' : 'هل أنت متأكد من رفض هذه المعاملة؟')) return;
    try {
      await api.put(`/admin/transactions/${id}/process`, { action });
      fetchTransactions();
    } catch (error) {
      alert('حدث خطأ أثناء معالجة المعاملة');
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
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200 tracking-tight">المعاملات المالية</h1>
          <p className="text-muted-foreground mt-2 text-sm">مراجعة ومعالجة طلبات السحب والإيداع المعلقة.</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-2 md:p-6 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
            <Receipt size={48} className="opacity-20 mb-4" />
            <p>لا توجد طلبات معلقة حالياً.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm text-right min-w-[900px]">
              <thead className="bg-secondary/40 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-5 font-bold">المستخدم</th>
                  <th className="px-6 py-5 font-bold text-center">النوع</th>
                  <th className="px-6 py-5 font-bold text-center">المبلغ</th>
                  <th className="px-6 py-5 font-bold">التفاصيل</th>
                  <th className="px-6 py-5 font-bold text-center">التاريخ</th>
                  <th className="px-6 py-5 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20">
                {transactions.map(tx => {
                  const details = JSON.parse(tx.details || '{}');
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white group-hover:text-primary transition-colors">{tx.user.firstName} {tx.user.lastName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{tx.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'}`}>
                          {tx.type === 'DEPOSIT' ? 'إيداع' : 'سحب'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-lg text-white">
                          ${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex flex-col gap-1.5">
                          <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-primary" /> {details.method || 'غير محدد'}</span>
                          {tx.type === 'WITHDRAWAL' ? (
                            <span className="text-xs opacity-70 truncate max-w-[200px]" title={details.address}>المحفظة: {details.address}</span>
                          ) : (
                            details.receiptImage && (
                              <a href={`http://localhost:5000/uploads/${details.receiptImage}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-emerald-300 transition-colors hover:underline text-xs bg-primary/5 px-2 py-1 rounded w-fit border border-primary/10">
                                <ExternalLink size={12} /> عرض الإيصال
                              </a>
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString('ar-EG')}
                          <div className="opacity-60">{new Date(tx.createdAt).toLocaleTimeString('ar-EG')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" className="h-9 px-4 text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border-emerald-500/20 transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1.5" onClick={() => handleProcess(tx.id, 'APPROVE')}>
                            <Check size={16} /> موافقة
                          </Button>
                          <Button variant="outline" className="h-9 px-4 text-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/20 transition-all flex items-center gap-1.5" onClick={() => handleProcess(tx.id, 'REJECT')}>
                            <X size={16} /> رفض
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
