import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';

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
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      await api.put(`/admin/transactions/${id}/process`, { action });
      fetchTransactions();
    } catch (error) {
      alert('Error processing transaction');
    }
  };

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div>
      <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">إدارة المعاملات المالية</h1>

      <div className="glass rounded-3xl border border-border/20 overflow-hidden shadow-lg">
        <table className="w-full text-right">
          <thead className="bg-card/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">المستخدم</th>
              <th className="p-4 font-medium">النوع</th>
              <th className="p-4 font-medium">المبلغ</th>
              <th className="p-4 font-medium">التفاصيل</th>
              <th className="p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {transactions.map(tx => {
              const details = JSON.parse(tx.details || '{}');
              return (
                <tr key={tx.id} className="hover:bg-card/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{tx.user.firstName} {tx.user.lastName}</div>
                    <div className="text-xs text-muted-foreground">{tx.user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.type === 'DEPOSIT' ? 'إيداع' : 'سحب'}
                    </span>
                  </td>
                  <td className="p-4 font-bold font-mono">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                    طريقة الدفع: {details.method || 'غير محدد'}<br/>
                    {tx.type === 'WITHDRAWAL' ? `المحفظة: ${details.address}` : (
                      details.receiptImage && (
                        <a href={`http://localhost:5000/uploads/${details.receiptImage}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">عرض الإيصال</a>
                      )
                    )}
                  </td>
                  <td className="p-4 text-sm">{new Date(tx.createdAt).toLocaleString('ar-EG')}</td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="h-8 text-xs px-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-green-500/20" onClick={() => handleProcess(tx.id, 'APPROVE')}>موافقة</Button>
                      <Button variant="outline" className="h-8 text-xs px-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20" onClick={() => handleProcess(tx.id, 'REJECT')}>رفض</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">لا توجد طلبات معلقة حالياً.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
