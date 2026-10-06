import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import { Plus, Users, Building, Search } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import Loader from '../../components/Loader';

export default function AdminDrives() {
  const [search, setSearch] = useState('');

  const { data: drives, isLoading } = useQuery({
    queryKey: ['admin-drives'],
    queryFn: async () => {
      const res = await apiClient.get('/drives');
      return res.data;
    }
  });

  const filtered = (drives || []).filter((d: any) => {
    const q = search.toLowerCase();
    return !q || d.title?.toLowerCase().includes(q) || d.company?.name?.toLowerCase().includes(q);
  });

  if (isLoading) return <Loader text="Loading drives..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Placement Drives"
        description="Manage and track campus recruitment opportunities."
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Search drives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-52"
          />
        </div>
        <Button className="gap-2" disabled>
          <Plus className="w-4 h-4" /> Create Drive
        </Button>
      </PageHeader>

      {filtered.length === 0 ? (
        search ? (
          <EmptyState
            icon={<Search className="h-10 w-10" />}
            title="No results found"
            description={`No drives match "${search}".`}
          />
        ) : (
          <EmptyState
            icon={<Building className="h-10 w-10" />}
            title="No placement drives yet"
            description="Create your first placement drive to start the recruitment process."
          />
        )
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company & Role</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Applicants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((drive: any) => (
              <TableRow key={drive.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-[hsl(196,100%,47%)]/15 flex items-center justify-center flex-shrink-0">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{drive.title}</div>
                      <div className="text-xs text-muted-foreground">{drive.company?.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{drive.compensation || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(drive.applicationDeadline).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={drive.status === 'OPEN' ? 'success' : 'secondary'}>
                    {drive.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-medium">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    {drive._count?.applications ?? 0}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/drives/${drive.id}/applicants`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5">
                      Manage →
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
