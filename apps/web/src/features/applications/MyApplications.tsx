import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, XCircle, Clock, Building } from 'lucide-react';

export default function MyApplications() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await apiClient.post('/applications/me');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-4">Loading applications...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your placement applications.</p>
      </div>

      <div className="space-y-4">
        {applications?.length === 0 ? (
          <div className="p-8 text-center bg-card border rounded-lg text-muted-foreground">
            You haven't applied to any drives yet. <br />
            <Link to="/student/opportunities" className="text-primary hover:underline mt-2 inline-block">Browse Opportunities</Link>
          </div>
        ) : (
          applications?.map((app: any) => (
            <div key={app.id} className="bg-card border rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">{app.drive.title}</h3>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Building className="w-3 h-3" /> {app.drive.company?.name}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <StatusBadge status={app.status} />
                <Link to={`/student/opportunities/${app.driveId}`} className="text-sm font-medium text-primary hover:underline">
                  View Drive
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colorClass = "bg-gray-100 text-gray-800 border-gray-200";
  let Icon = Circle;

  switch (status) {
    case 'APPLIED':
      colorClass = "bg-blue-50 text-blue-800 border-blue-200";
      Icon = Clock;
      break;
    case 'SHORTLISTED':
    case 'ASSESSMENT':
    case 'TECHNICAL_INTERVIEW':
    case 'HR_INTERVIEW':
      colorClass = "bg-yellow-50 text-yellow-800 border-yellow-200";
      Icon = Clock;
      break;
    case 'SELECTED':
      colorClass = "bg-green-50 text-green-800 border-green-200";
      Icon = CheckCircle2;
      break;
    case 'REJECTED':
      colorClass = "bg-red-50 text-red-800 border-red-200";
      Icon = XCircle;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}
