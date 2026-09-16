import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function CollegeDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout variant="college">{children}</DashboardLayout>;
}
