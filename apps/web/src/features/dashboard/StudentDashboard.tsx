import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CalendarDays, ChevronRight, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import Loader from '../../components/Loader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';

export default function StudentDashboard() {
  const user = useAuthStore(state => state.user);
  const studentName = (user as any)?.name || user?.email?.split('@')[0] || 'Student';

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/student');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 capitalize">
            Welcome, {studentName} 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1.5 text-sm">
            Here's your placement activity and upcoming opportunities.
          </p>
        </div>
        <Link to="/student/opportunities">
          <Button className="gap-2 shadow-sm font-semibold h-11 px-5" size="default">
            <Briefcase className="h-4 w-4" />
            Browse Opportunities
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 w-full sm:w-auto bg-slate-100 p-1 rounded-lg border-none">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">Overview</TabsTrigger>
          <TabsTrigger value="deadlines" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Active Applications"
              value={dashboard?.activeApplications ?? 0}
              icon={<Briefcase className="w-5 h-5" />}
              accent="blue"
            />
            {/* Add more stats if needed here */}
          </div>
          
          {/* Recent actions / quick links could go here */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Update Profile</h3>
                  <p className="text-slate-500 text-sm mt-1">Keep your CGPA, skills, and resume updated to match more drives.</p>
                  <Link to="/student/profile" className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1 mt-3">
                    Go to Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">My Applications</h3>
                  <p className="text-slate-500 text-sm mt-1">Track the status of your current job applications in one place.</p>
                  <Link to="/student/applications" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center gap-1 mt-3">
                    View Applications <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deadlines">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-slate-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!dashboard?.upcomingDeadlines || dashboard.upcomingDeadlines.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays className="w-10 h-10" />}
                  title="No upcoming deadlines"
                  description="You're all caught up! Browse opportunities to find new drives."
                  className="py-12 border-none bg-transparent shadow-none"
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {dashboard.upcomingDeadlines.map((drive: any) => (
                    <div
                      key={drive.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                          <Building className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-base line-clamp-1">{drive.title}</p>
                          <p className="text-sm text-slate-500 font-medium">{drive.company?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 sm:w-auto w-full sm:justify-end justify-between">
                        <span className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
                          Due {new Date(drive.applicationDeadline).toLocaleDateString()}
                        </span>
                        <Link to={`/student/opportunities/${drive.id}`}>
                          <Button variant="outline" size="sm" className="h-9">
                            View Details <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {dashboard?.upcomingDeadlines?.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                <Link to="/student/opportunities" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                  View all opportunities <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
