import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useState } from 'react';
import { FileUp, UserCircle, CheckCircle2 } from 'lucide-react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/ui/PageHeader';
import { CardContent, CardHeader, CardTitle, MotionCard } from '../../components/ui/Card';
import { motion } from 'framer-motion';

export default function StudentProfile() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/students/me/profile');
      return res.data;
    }
  });

  const uploadResume = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await apiClient.post('/students/me/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUploading(false);
      toast.success('Resume uploaded successfully!');
    },
    onError: (err: any) => {
      setUploading(false);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.error || 'Failed to upload resume';
      toast.error(errMsg);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      uploadResume.mutate(e.target.files[0]);
    }
  };

  if (isLoading) return <Loader text="Loading profile..." />;

  const currentResume = profile?.resumes?.find((r: any) => r.isCurrent);
  const completionPct = profile?.profileCompletionPct || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="My Profile" 
        description="Manage your academic details and resume."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal & Academic Info Card */}
        <MotionCard className="overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <UserCircle className="h-6 w-6 text-primary" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="font-medium">{profile?.fullName || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Branch</p>
                <p className="font-medium">{profile?.branch || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                <p className="font-medium text-primary">{profile?.cgpa || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Grad Year</p>
                <p className="font-medium">{profile?.graduationYear || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Backlogs</p>
                <p className="font-medium text-destructive">{profile?.backlogCount ?? 0}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-bold text-primary">{completionPct}%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-primary h-full rounded-full" 
                />
              </div>
            </div>
          </CardContent>
        </MotionCard>

        {/* Resume Card */}
        <MotionCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileUp className="h-6 w-6 text-primary" />
              Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentResume ? (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium truncate pr-8">{currentResume.fileName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Uploaded: {new Date(currentResume.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <a 
                  href={currentResume.fileUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm font-medium text-primary hover:underline mt-4 inline-block relative z-10"
                >
                  View current resume &rarr;
                </a>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ) : (
              <div className="p-4 bg-warning/10 border border-warning/20 text-warning-foreground rounded-xl text-sm">
                No resume uploaded. You must upload a resume to apply for placement drives.
              </div>
            )}

            <div className="pt-2">
              <label className="block w-full cursor-pointer">
                <div className="w-full h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-white/50 backdrop-blur-md hover:bg-accent hover:text-accent-foreground dark:bg-slate-900/50">
                  {uploading ? 'Uploading...' : (currentResume ? 'Replace Resume' : 'Upload Resume')}
                </div>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={uploading} />
              </label>
              <p className="text-xs text-muted-foreground mt-3 text-center">Max 5MB (PDF, DOC, DOCX)</p>
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}
