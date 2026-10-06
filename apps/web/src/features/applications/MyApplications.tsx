import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, XCircle, Clock, Building, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import Loader from '../../components/Loader';

export default function MyApplications() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await apiClient.post('/applications/me');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading applications..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="My Applications" 
        description="Track the status of your placement applications."
      />

      <div className="space-y-4">
        {applications?.length === 0 ? (
          <EmptyState 
            title="No applications yet"
            description="You haven't applied to any placement drives yet."
            action={
              <Link to="/student/opportunities">
                <Button>Browse Opportunities</Button>
              </Link>
            }
          />
        ) : (
          applications?.map((app: any) => (
            <Card key={app.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="font-semibold text-lg">{app.drive.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Building className="w-4 h-4 text-primary" /> {app.drive.company?.name}
                  </div>
                  <div className="text-xs text-muted-foreground/80 mt-3 bg-muted/50 inline-block px-2 py-1 rounded-md">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                  <div className="flex-1 md:flex-none">
                    <StatusBadge status={app.status} />
                  </div>
                  <Link to={`/student/opportunities/${app.driveId}`} className="w-full md:w-auto">
                    <Button variant="outline" className="w-full md:w-auto">
                      View Drive <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' = 'secondary';
  let Icon = Circle;

  switch (status) {
    case 'APPLIED':
      variant = 'secondary';
      Icon = Clock;
      break;
    case 'SHORTLISTED':
    case 'ASSESSMENT':
    case 'TECHNICAL_INTERVIEW':
    case 'HR_INTERVIEW':
      variant = 'warning';
      Icon = Clock;
      break;
    case 'SELECTED':
      variant = 'success';
      Icon = CheckCircle2;
      break;
    case 'REJECTED':
      variant = 'destructive';
      Icon = XCircle;
      break;
  }

  return (
    <Badge variant={variant} className="px-3 py-1.5 text-sm gap-2">
      <Icon className="w-4 h-4" />
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
