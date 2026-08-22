import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { Briefcase, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Loader from '../../components/Loader';

export default function StudentDashboard() {
  const user = useAuthStore(state => state.user);

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/student');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.email.split('@')[0]}</h1>
        <p className="text-muted-foreground">Here's what's happening with your placements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            <span className="font-medium">Active Applications</span>
          </div>
          <div className="text-4xl font-bold mb-4">{dashboard?.activeApplications || 0}</div>
          <Link to="/student/applications" className="text-sm text-primary font-medium hover:underline">
            View Applications &rarr;
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> Upcoming Deadlines
        </h2>
        <div className="bg-card border rounded-lg shadow-sm divide-y">
          {dashboard?.upcomingDeadlines?.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No upcoming deadlines.</div>
          ) : (
            dashboard?.upcomingDeadlines?.map((drive: any) => (
              <div key={drive.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{drive.title}</h4>
                  <div className="text-sm text-muted-foreground">{drive.company?.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-destructive">
                    {new Date(drive.applicationDeadline).toLocaleDateString()}
                  </div>
                  <Link to={`/student/opportunities/${drive.id}`} className="text-xs text-primary hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
