import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Users, Building, Briefcase, Award, Plus, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import Loader from '../../components/Loader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';

const CHART_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const quickActions = [
  { label: 'View All Students', href: '/admin/students', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Placement Drives', href: '/admin/drives', icon: Building, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'All Applications', href: '/admin/applications', icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Announcements', href: '/admin/announcements', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/admin');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading dashboard…" />;

  const hasChartData = dashboard?.applicationsByStatus && dashboard.applicationsByStatus.length > 0;
  const adminName = (user as any)?.name || user?.email?.split('@')[0] || 'Admin';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">
            Welcome, {adminName}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            Manage placements, review applications, and track campus analytics.
          </p>
        </div>
        <Link to="/admin/drives">
          <Button className="gap-2 shadow-sm font-semibold h-11 px-5" size="default">
            <Plus className="h-4 w-4" />
            Create Drive
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 w-full sm:w-auto bg-slate-100 p-1 rounded-lg border-none">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">Analytics</TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-600">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stat Cards */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={dashboard?.metrics?.totalStudents?.toLocaleString() ?? 0}
              icon={<Users className="w-5 h-5" />}
              accent="blue"
            />
            <StatCard
              title="Active Drives"
              value={dashboard?.metrics?.totalDrives ?? 0}
              icon={<Building className="w-5 h-5" />}
              accent="cyan"
            />
            <StatCard
              title="Total Applications"
              value={dashboard?.metrics?.totalApplications?.toLocaleString() ?? 0}
              icon={<Briefcase className="w-5 h-5" />}
              accent="violet"
            />
            <StatCard
              title="Offers Made"
              value={dashboard?.metrics?.totalOffers ?? 0}
              icon={<Award className="w-5 h-5" />}
              accent="emerald"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Application Status Pipeline</CardTitle>
                <CardDescription>Overall progression of applications</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard?.applicationsByStatus || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {(dashboard?.applicationsByStatus || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Applications by Company</CardTitle>
                <CardDescription>Top hiring partners</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={dashboard?.applicationsByCompany || []} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#3b82f6" maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
           <Card className="border-slate-200 shadow-sm overflow-hidden mb-6">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Offers by Branch</CardTitle>
                <CardDescription className="mt-1">Placement distribution across engineering branches</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full">
                <Activity className="h-3.5 w-3.5" /> Placement Rate: {dashboard?.metrics?.placementPercentage || 0}%
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!hasChartData ? (
                 <EmptyState title="No placement data yet" description="Analytics will appear when offers are made." className="py-12 border-none" />
              ) : (
                <div className="h-[320px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard?.offersByBranch} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="count" label>
                        {dashboard?.offersByBranch?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href} className="block group">
                <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className={`p-4 rounded-xl flex-shrink-0 ${action.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`h-8 w-8 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{action.label}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
