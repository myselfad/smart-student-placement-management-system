import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { Building, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { CardContent, MotionCard } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Placement Opportunities" 
        description="Discover and apply to open placement drives."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drives?.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              icon={<Briefcase className="w-12 h-12" />}
              title="No open drives"
              description="There are currently no open placement drives available. Check back later."
            />
          </div>
        ) : (
          drives?.map((drive: any) => (
            <MotionCard key={drive.id} className="flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/20 pointer-events-none" />
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="font-semibold text-xl line-clamp-1 mb-1">{drive.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Building className="w-4 h-4" /> {drive.company?.name}
                  </div>
                </div>
                
                <div className="space-y-3 mb-8 text-sm flex-1">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center text-foreground/70"><MapPin className="w-4 h-4" /></div>
                    <span className="font-medium text-foreground/80">{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><DollarSign className="w-4 h-4" /></div>
                    <span className="font-medium text-foreground/80">{drive.compensation}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400"><Briefcase className="w-4 h-4" /></div>
                    <span className="font-medium text-foreground/80">{drive.jobType}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex justify-between items-center mt-auto">
                  <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                    Deadline: <span className="text-destructive ml-1">{new Date(drive.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    to={`/student/opportunities/${drive.id}`} 
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </CardContent>
            </MotionCard>
          ))
        )}
      </div>
    </div>
  );
}
