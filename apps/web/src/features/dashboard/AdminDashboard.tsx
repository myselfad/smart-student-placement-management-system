import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Users, Building, Briefcase, Award } from 'lucide-react';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/admin');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">High-level placement metrics and analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Students" 
          value={dashboard?.metrics.totalStudents} 
          icon={<Users className="w-6 h-6 text-primary" />} 
        />
        <MetricCard 
          title="Total Drives" 
          value={dashboard?.metrics.totalDrives} 
          icon={<Building className="w-6 h-6 text-primary" />} 
        />
        <MetricCard 
          title="Applications" 
          value={dashboard?.metrics.totalApplications} 
          icon={<Briefcase className="w-6 h-6 text-primary" />} 
        />
        <MetricCard 
          title="Offers Made" 
          value={dashboard?.metrics.totalOffers} 
          icon={<Award className="w-6 h-6 text-primary" />} 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Offers by Branch</h2>
          {dashboard?.offersByBranch?.length === 0 ? (
            <div className="text-muted-foreground text-sm">No offers recorded yet.</div>
          ) : (
            <div className="space-y-4">
              {dashboard?.offersByBranch?.map((stat: any) => (
                <div key={stat.branch} className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{stat.branch}</span>
                  <span className="text-muted-foreground">{stat.count} offers</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-3 text-muted-foreground mb-4">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className="text-3xl font-bold">{value || 0}</div>
    </div>
  );
}
