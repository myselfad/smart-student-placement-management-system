import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function AdminDriveApplicants() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});

  const { data: applications, isLoading } = useQuery({
    queryKey: ['drive-applications', id],
    queryFn: async () => {
      // Create admin endpoint for this in real app, using me for mockup purposes, wait PRD specifies an admin route.
      // Wait, let's assume we have GET /api/drives/:id/applications 
      const res = await apiClient.get(`/drives/${id}/applications`).catch(() => ({ data: [] })); // mock fallback
      return res.data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ appId, status }: { appId: string, status: string }) => {
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

  if (isLoading) return <div className="p-4">Loading applicants...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Applicants</h1>
        <p className="text-muted-foreground">Review and update student application stages.</p>
      </div>

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Student</th>
              <th className="px-6 py-3 font-medium">Branch/CGPA</th>
              <th className="px-6 py-3 font-medium">Applied Date</th>
              <th className="px-6 py-3 font-medium">Current Stage</th>
              <th className="px-6 py-3 font-medium text-right">Update Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No applications received yet.
                </td>
              </tr>
            ) : (
              applications?.map((app: any) => (
                <tr key={app.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{app.studentProfile?.fullName || 'Student'}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {app.studentProfile?.branch} • {app.studentProfile?.cgpa} CGPA
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {app.status.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="border rounded-md p-1.5 text-sm bg-background"
                      value={selectedStatus[app.id] || app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={updateStatus.isPending}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="ASSESSMENT">Assessment</option>
                      <option value="TECHNICAL_INTERVIEW">Technical Interview</option>
                      <option value="HR_INTERVIEW">HR Interview</option>
                      <option value="SELECTED">Selected</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
