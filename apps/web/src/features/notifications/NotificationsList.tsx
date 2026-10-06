import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Check, Bell, BellRing } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import Loader from '../../components/Loader';

export default function NotificationsList() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await apiClient.get('/notifications');
      return res.data;
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await apiClient.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (isLoading) return <Loader text="Loading notifications..." />;

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Notifications" 
        description="Stay updated on your placement activities."
      >
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <Check className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        )}
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {notifications?.length === 0 ? (
              <EmptyState 
                icon={<Bell className="w-12 h-12" />}
                title="You're all caught up"
                description="No notifications at the moment."
                className="my-8 border-none"
              />
            ) : (
              notifications?.map((notification: any) => (
                <div 
                  key={notification.id} 
                  className={`p-6 flex gap-5 transition-colors ${notification.isRead ? 'bg-transparent' : 'bg-primary/5 hover:bg-primary/10'}`}
                >
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'}`}>
                      {notification.isRead ? <Bell className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-base font-semibold ${notification.isRead ? 'text-foreground/80' : 'text-foreground'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted/50 px-2 py-1 rounded-md">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${notification.isRead ? 'text-muted-foreground' : 'text-foreground/90'}`}>
                      {notification.message}
                    </p>
                    
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead.mutate(notification.id)}
                        disabled={markAsRead.isPending}
                        className="mt-3 text-xs h-7 px-3 bg-background border"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
