import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">لا يوجد مستخدمين مسجلين.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 rounded-tr-lg">الاسم</th>
                  <th className="px-6 py-4">البريد الإلكتروني</th>
                  <th className="px-6 py-4">الرصيد المتاح</th>
                  <th className="px-6 py-4">الرصيد المعلق</th>
                  <th className="px-6 py-4">تاريخ التسجيل</th>
                  <th className="px-6 py-4 rounded-tl-lg">حالة الحساب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-green-500 font-bold">${user.wallet?.balance?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-yellow-500">${user.wallet?.lockedBalance?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">نشط</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold">محظور</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
