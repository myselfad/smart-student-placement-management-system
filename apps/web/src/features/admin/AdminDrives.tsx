import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';

export default function AdminDrives() {
  const { data: drives, isLoading } = useQuery({
    queryKey: ['admin-drives'],
    queryFn: async () => {
      const res = await apiClient.get('/drives');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-4">Loading drives...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Drives</h1>
          <p className="text-muted-foreground">Manage active and past placement drives.</p>
        </div>
        <Link 
          to="/admin/drives/new" 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Create Drive
        </Link>
      </div>

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Company & Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Deadline</th>
              <th className="px-6 py-3 font-medium text-center">Applicants</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {drives?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No placement drives found.
                </td>
              </tr>
            ) : (
              drives?.map((drive: any) => (
                <tr key={drive.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{drive.title}</div>
                    <div className="text-muted-foreground mt-0.5">{drive.company?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full border">
                      {drive.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(drive.applicationDeadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {drive._count?.applications || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link to={`/admin/drives/${drive.id}/applicants`} className="font-medium text-primary hover:underline">
                      Manage Applicants
                    </Link>
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
