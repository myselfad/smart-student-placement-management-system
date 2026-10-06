import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, BookOpen, GraduationCap, FileText, 
  CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import Loader from '../../components/Loader';


export default function AdminStudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: students, isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const res = await apiClient.get('/students');
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading student..." />;

  const student = students?.find((s: any) => s.id === id);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Student not found</h2>
        <Button className="mt-4" onClick={() => navigate('/admin/students')}>Back to Students</Button>
      </div>
    );
  }

  const initials = student.fullName
    ? student.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (student.email?.slice(0, 2).toUpperCase() || 'ST');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{student.fullName || 'Unnamed Student'}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {student.email}</span>
                {student.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {student.phone}</span>}
              </div>
            </div>
            {student.isPlaced ? (
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 px-3 py-1 text-sm rounded-full">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Placed
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 px-3 py-1 text-sm rounded-full">
                <Clock className="w-4 h-4 mr-1.5" /> Actively Seeking
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500 font-medium">Branch</p>
              <p className="font-semibold text-slate-900">{student.branch || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">CGPA</p>
              <p className="font-semibold text-slate-900">{student.cgpa ? `${student.cgpa} / 10.0` : '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Graduation Year</p>
              <p className="font-semibold text-slate-900">{student.graduationYear || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Backlogs</p>
              <p className={`font-semibold ${student.backlogCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {student.backlogCount || '0 (Clean)'}
              </p>
            </div>
            {student.resumeUrl && (
              <div className="pt-2">
                <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2">
                    <FileText className="w-4 h-4" /> View Resume
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {student.skills && student.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">No skills listed</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
