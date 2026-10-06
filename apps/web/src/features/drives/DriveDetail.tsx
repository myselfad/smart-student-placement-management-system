import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Building, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function DriveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applyError, setApplyError] = useState('');

  const { data: drive, isLoading: driveLoading } = useQuery({
    queryKey: ['drive', id],
    queryFn: async () => {
      const res = await apiClient.get(`/drives/${id}`);
      return res.data;
    }
  });

  const { data: eligibility, isLoading: eligibilityLoading } = useQuery({
    queryKey: ['eligibility', id],
    queryFn: async () => {
      const res = await apiClient.get(`/drives/${id}/eligibility`);
      return res.data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      setApplyError('');
      const res = await apiClient.post(`/applications/drive/${id}/apply`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully applied to the drive!');
      navigate('/student/applications');
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.error?.message || 'Failed to apply';
      setApplyError(errMsg);
      toast.error(errMsg);
    }
  });

  if (driveLoading || eligibilityLoading) return <Loader text="Loading details..." />;
  if (!drive) return <div className="p-8 text-center text-muted-foreground">Drive not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Link to="/student/opportunities" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities
      </Link>

      <Card className="overflow-hidden border-t-4 border-t-primary relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-3xl rounded-full pointer-events-none" />
        <CardContent className="p-8 md:p-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">{drive.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-lg font-medium">
                <Building className="w-5 h-5 text-primary" /> {drive.company?.name}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end p-4 bg-muted/30 rounded-xl border border-border/50">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4" /> Application Deadline
              </div>
              <div className="font-bold text-destructive">
                {new Date(drive.applicationDeadline).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Eligibility Panel */}
          <div className={`p-6 rounded-xl border mb-10 transition-colors ${eligibility?.isEligible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
            <div className="flex items-center gap-3 mb-5">
              {eligibility?.isEligible ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-7 h-7 text-destructive" />
              )}
              <h2 className={`text-xl font-bold ${eligibility?.isEligible ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}`}>
                {eligibility?.isEligible ? 'You are eligible to apply' : 'You are not eligible'}
              </h2>
            </div>
            
            <ul className="space-y-3">
              {eligibility?.criteria?.map((c: any, i: number) => (
                <li key={i} className={`text-sm font-medium flex items-start gap-2.5 ${c.isMet ? 'text-emerald-700/80 dark:text-emerald-400/80' : 'text-destructive/80'}`}>
                  <div className={`mt-0.5 rounded-full w-4 h-4 flex items-center justify-center border ${c.isMet ? 'border-emerald-500/30' : 'border-destructive/30'}`}>
                     {c.isMet ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  </div>
                  {c.message}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="font-bold text-xl mb-4 text-foreground/90">Job Description</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{drive.description}</div>
              </section>
              <section>
                <h3 className="font-bold text-xl mb-4 text-foreground/90">Selection Process</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{drive.selectionProcess || 'Not specified'}</div>
              </section>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4 text-foreground/90">Details</h3>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Location</span>
                <span className="font-semibold text-right">{drive.location}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Compensation</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">{drive.compensation}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Job Type</span>
                <span className="font-semibold text-primary text-right">{drive.jobType}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Openings</span>
                <span className="font-semibold text-right">{drive.openings}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col items-center">
            {applyError && (
              <div className="mb-4 text-sm font-medium text-destructive bg-destructive/10 px-4 py-3 rounded-lg w-full max-w-md text-center border border-destructive/20">
                {applyError}
              </div>
            )}
            <Button
              size="lg"
              onClick={() => applyMutation.mutate()}
              disabled={!eligibility?.isEligible || applyMutation.isPending || drive.status !== 'OPEN'}
              className="w-full max-w-md h-14 text-base"
            >
              {applyMutation.isPending ? 'Submitting Application...' : 'Apply Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
