import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { cn } from '../../components/ui/Button';
import Loader from '../../components/Loader';

type AppStatus = 'ALL' | 'APPLIED' | 'SHORTLISTED' | 'ASSESSMENT' | 'TECHNICAL_INTERVIEW' | 'HR_INTERVIEW' | 'SELECTED' | 'REJECTED';

const STATUS_TABS: { label: string; value: AppStatus }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Applied', value: 'APPLIED' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Interview', value: 'TECHNICAL_INTERVIEW' },
  { label: 'Selected', value: 'SELECTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

function getVariant(status: string): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' {
  switch (status) {
    case 'SELECTED': return 'success';
    case 'REJECTED': return 'destructive';
    case 'SHORTLISTED':
    case 'ASSESSMENT':
    case 'TECHNICAL_INTERVIEW':
    case 'HR_INTERVIEW':
      return 'warning';
    case 'APPLIED': return 'secondary';
    default: return 'outline';
  }
}

export default function AdminApplications() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppStatus>('ALL');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const res = await apiClient.get('/applications/admin').catch(() => apiClient.get('/applications').catch(() => ({ data: [] })));
      return res.data;
    }
  });

  const filtered = (applications || []).filter((app: any) => {
    const matchesSearch = !search ||
      app.studentProfile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.drive?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.drive?.company?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <Loader text="Loading applications..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Applications"
        description="Track student applications across all placement drives."
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-52"
          />
        </div>
      </PageHeader>

      {/* Status Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              statusFilter === tab.value
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No applications found"
          description={search || statusFilter !== 'ALL' ? 'Try adjusting your filters.' : 'No applications have been submitted yet.'}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Drive / Company</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((app: any) => {
              const initials = app.studentProfile?.fullName
                ? app.studentProfile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : 'ST';
              return (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-[hsl(196,100%,47%)]/20 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="font-semibold text-sm text-foreground">
                        {app.studentProfile?.fullName || 'Student'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm text-foreground">{app.drive?.title}</div>
                    <div className="text-xs text-muted-foreground">{app.drive?.company?.name}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getVariant(app.status)}>
                      {app.status?.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
