import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Megaphone, Bell, CalendarDays, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';

function getPriorityIcon(type?: string) {
  switch (type?.toUpperCase()) {
    case 'URGENT': return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default: return <Info className="h-4 w-4 text-primary" />;
  }
}

function getPriorityBadge(type?: string): 'destructive' | 'success' | 'default' {
  switch (type?.toUpperCase()) {
    case 'URGENT': return 'destructive';
    case 'SUCCESS': return 'success';
    default: return 'default';
  }
}

export default function AdminAnnouncements() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      // Try dedicated announcements endpoint first, fall back to notifications
      const res = await apiClient.get('/notifications/admin')
        .catch(() => apiClient.get('/notifications')
        .catch(() => ({ data: [] })));
      return res.data;
    }
  });

  if (isLoading) return <Loader text="Loading announcements..." />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Announcements"
        description="Keep students informed about placement activities and updates."
      />

      {!announcements || announcements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-10 w-10" />}
          title="No announcements yet"
          description="Announcements sent to students will appear here. Use the notification system to broadcast updates."
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getPriorityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                        <Badge variant={getPriorityBadge(item.type)}>
                          {item.type || 'General'}
                        </Badge>
                        {!item.isRead && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <Bell className="h-2.5 w-2.5" /> New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.message}</p>
                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-muted-foreground/70">
                        <CalendarDays className="h-3 w-3" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        }) : '—'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
