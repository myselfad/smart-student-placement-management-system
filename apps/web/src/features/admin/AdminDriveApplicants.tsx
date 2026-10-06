import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import Loader from '../../components/Loader';
import { ArrowLeft, Users } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'TECHNICAL_INTERVIEW', label: 'Technical Interview' },
  { value: 'HR_INTERVIEW', label: 'HR Interview' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'REJECTED', label: 'Rejected' },
];

function getVariant(status: string): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' {
  if (status === 'SELECTED') return 'success';
  if (status === 'REJECTED') return 'destructive';
  if (['SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW'].includes(status)) return 'warning';
  return 'secondary';
}

export default function AdminDriveApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});

  const { data: applications, isLoading } = useQuery({
    queryKey: ['drive-applications', id],
    queryFn: async () => {
      const res = await apiClient.get(`/drives/${id}/applications`).catch(() => ({ data: [] }));
      return res.data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      await apiClient.patch(`/applications/${appId}/status`, { status, note: 'Admin updated status' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive-applications', id] });
    }
  });

  const handleStatusChange = (appId: string, newStatus: string) => {
    setSelectedStatus(prev => ({ ...prev, [appId]: newStatus }));
    updateStatus.mutate({ appId, status: newStatus });
  };

  if (isLoading) return <Loader text="Loading applicants..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Link
        to="/admin/drives"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Drives
      </Link>

      <PageHeader
        title="Manage Applicants"
        description="Review and update student application stages for this drive."
      />

      {!applications || applications.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No applicants yet"
          description="No students have applied to this placement drive yet."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Branch & CGPA</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Current Stage</TableHead>
              <TableHead className="text-right">Update Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app: any) => {
              const initials = app.studentProfile?.fullName
                ? app.studentProfile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : 'ST';
              return (
                <TableRow key={app.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/students/${app.studentProfileId}`)}>
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
                  <TableCell className="text-sm text-muted-foreground">
                    {app.studentProfile?.branch || '—'}
                    {app.studentProfile?.cgpa && (
                      <span className="ml-1 font-medium text-foreground">· {app.studentProfile.cgpa}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getVariant(app.status)}>
                      {app.status?.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <select
                      className="h-9 w-44 rounded-lg border border-input bg-white/70 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                      value={selectedStatus[app.id] || app.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={updateStatus.isPending}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
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
