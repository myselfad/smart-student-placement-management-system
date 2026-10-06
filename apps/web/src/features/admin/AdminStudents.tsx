import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useState } from 'react';
import { Users, Search, GraduationCap, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

export default function AdminStudents() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: students, isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const res = await apiClient.get('/students').catch(() => ({ data: [] }));
      return res.data;
    }
  });

  const filtered = (students || []).filter((s: any) => {
    const q = search.toLowerCase();
    return (
      !q ||
      s.fullName?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  if (isLoading) return <Loader text="Loading students..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <PageHeader
        title="Students"
        description="Manage student profiles and placement progress."
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Search by name, email or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64 shadow-sm"
          />
        </div>
      </PageHeader>

      {filtered.length === 0 ? (
        search ? (
          <EmptyState
            icon={<Search className="h-10 w-10" />}
            title="No results found"
            description={`No students match "${search}". Try a different search term.`}
          />
        ) : (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No students yet"
            description="Once students register and complete their profiles, they'll appear here."
          />
        )
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600">Student</TableHead>
                <TableHead className="font-semibold text-slate-600">Branch</TableHead>
                <TableHead className="font-semibold text-slate-600">CGPA</TableHead>
                <TableHead className="font-semibold text-slate-600">Grad Year</TableHead>
                <TableHead className="font-semibold text-slate-600">Backlogs</TableHead>
                <TableHead className="font-semibold text-slate-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student: any) => {
                const initials = student.fullName
                  ? student.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                  : (student.email?.slice(0, 2).toUpperCase() || 'ST');

                return (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{student.fullName || 'Unnamed'}</div>
                          <div className="text-xs text-slate-500 font-medium">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm">{student.branch || '—'}</TableCell>
                    <TableCell>
                      {student.cgpa ? (
                        <span className="font-semibold text-sm text-slate-900">{student.cgpa}</span>
                      ) : <span className="text-slate-400 text-sm">—</span>}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium text-sm">{student.graduationYear || '—'}</TableCell>
                    <TableCell>
                      {student.backlogCount > 0 ? (
                        <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">{student.backlogCount} backlog{student.backlogCount > 1 ? 's' : ''}</Badge>
                      ) : (
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Clean
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.isPlaced ? (
                        <Badge variant="success" className="bg-blue-50 text-blue-700 border-blue-200">
                          <GraduationCap className="h-3.5 w-3.5 mr-1" /> Placed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                          <Clock className="h-3.5 w-3.5 mr-1" /> Seeking
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
