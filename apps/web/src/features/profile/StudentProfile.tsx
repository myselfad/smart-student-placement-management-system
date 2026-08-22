import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useState } from 'react';
import { FileUp, UserCircle } from 'lucide-react';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your academic details and resume.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal & Academic Info Card */}
        <div className="bg-card border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-semibold">Personal Details</h2>
          </div>
          <div className="space-y-2">
            <div><span className="font-medium text-muted-foreground">Full Name:</span> {profile?.fullName || 'Not provided'}</div>
            <div><span className="font-medium text-muted-foreground">Branch:</span> {profile?.branch || 'Not provided'}</div>
            <div><span className="font-medium text-muted-foreground">CGPA:</span> {profile?.cgpa || 'Not provided'}</div>
            <div><span className="font-medium text-muted-foreground">Graduation Year:</span> {profile?.graduationYear || 'Not provided'}</div>
            <div><span className="font-medium text-muted-foreground">Backlogs:</span> {profile?.backlogCount ?? 0}</div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">{profile?.profileCompletionPct}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${profile?.profileCompletionPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* Resume Card */}
        <div className="bg-card border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FileUp className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-semibold">Resume</h2>
          </div>
          
          {currentResume ? (
            <div className="p-4 bg-muted/50 border rounded-md">
              <div className="font-medium truncate">{currentResume.fileName}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Uploaded: {new Date(currentResume.uploadedAt).toLocaleDateString()}
              </div>
              <a href={currentResume.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                View current resume
              </a>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
              No resume uploaded. You must upload a resume to apply for drives.
            </div>
          )}

          <div className="pt-2">
            <label className="block w-full cursor-pointer text-center py-2 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium rounded-md text-sm transition-colors">
              {uploading ? 'Uploading...' : (currentResume ? 'Replace Resume' : 'Upload Resume')}
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={uploading} />
            </label>
            <p className="text-xs text-muted-foreground mt-2 text-center">Max 5MB (PDF, DOC, DOCX)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
