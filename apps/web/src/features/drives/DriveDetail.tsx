import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Building } from 'lucide-react';
import { useState } from 'react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

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
  if (!drive) return <div className="p-4 text-center text-muted-foreground">Drive not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-card border shadow-sm rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{drive.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground text-lg">
              <Building className="w-5 h-5" /> {drive.company?.name}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> Deadline
            </div>
            <div className="font-medium text-destructive">
              {new Date(drive.applicationDeadline).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Eligibility Panel */}
        <div className={`p-5 rounded-md border mb-8 ${eligibility?.isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            {eligibility?.isEligible ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h2 className={`text-lg font-semibold ${eligibility?.isEligible ? 'text-green-800' : 'text-red-800'}`}>
              {eligibility?.isEligible ? 'You are eligible to apply' : 'You are not eligible'}
            </h2>
          </div>
          
          <ul className="space-y-2">
            {eligibility?.criteria?.map((c: any, i: number) => (
              <li key={i} className={`text-sm flex items-start gap-2 ${c.isMet ? 'text-green-700' : 'text-red-700'}`}>
                {c.message}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Job Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{drive.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Selection Process</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{drive.selectionProcess || 'Not specified'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">{drive.location}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Compensation</div>
              <div className="font-medium">{drive.compensation}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Job Type</div>
              <div className="font-medium">{drive.jobType}</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Openings</div>
              <div className="font-medium">{drive.openings}</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col items-center">
          {applyError && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md w-full max-w-md text-center">
              {applyError}
            </div>
          )}
          <button
            onClick={() => applyMutation.mutate()}
            disabled={!eligibility?.isEligible || applyMutation.isPending || drive.status !== 'OPEN'}
            className="w-full max-w-md py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {applyMutation.isPending ? 'Submitting...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
