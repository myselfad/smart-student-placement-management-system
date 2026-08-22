import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Check, Circle } from 'lucide-react';

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

  if (isLoading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your placement activities.</p>
        </div>
        {notifications?.some((n: any) => !n.isRead) && (
          <button 
            onClick={() => markAllAsRead.mutate()}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-card border rounded-lg shadow-sm divide-y">
        {notifications?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          notifications?.map((notification: any) => (
            <div 
              key={notification.id} 
              className={`p-4 flex gap-4 transition-colors ${notification.isRead ? 'bg-background' : 'bg-muted/30'}`}
            >
              <div className="mt-1">
                {notification.isRead ? (
                  <Circle className="w-2.5 h-2.5 text-muted-foreground/30 fill-muted-foreground/30" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-primary fill-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-medium ${notification.isRead ? 'text-foreground/80' : 'text-foreground'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => markAsRead.mutate(notification.id)}
                    className="text-xs font-medium text-primary mt-2 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
