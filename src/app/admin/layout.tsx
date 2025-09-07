import { AdminHeader } from '@/components/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/50">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
