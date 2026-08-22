import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { Building, MapPin, DollarSign, Briefcase } from 'lucide-react';
import Loader from '../../components/Loader';

export default function Opportunities() {
  const { data: drives, isLoading } = useQuery({
    queryKey: ['drives', 'OPEN'],
    queryFn: async () => {
      const res = await apiClient.get('/drives?status=OPEN');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading opportunities..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement Opportunities</h1>
        <p className="text-muted-foreground">Discover and apply to open placement drives.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drives?.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-card border rounded-lg text-muted-foreground">
            No open drives at the moment.
          </div>
        ) : (
          drives?.map((drive: any) => (
            <div key={drive.id} className="bg-card border rounded-lg p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{drive.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Building className="w-3 h-3" /> {drive.company?.name}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-foreground/70" /> {drive.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-foreground/70" /> {drive.compensation}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-foreground/70" /> {drive.jobType}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                </span>
                <Link 
                  to={`/student/opportunities/${drive.id}`} 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
