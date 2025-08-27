import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "@/services/chat/api-services";
import { handleError } from "@/hooks/error";

export const useServiceMarkMessageAsRead = (
  onSuccessCallback?: (fromUserId: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<TResponseData, TMeta, { fromUserId: string }>({
    mutationFn: ({ fromUserId }) => markAsRead(fromUserId),
    
    onSuccess: (data, variables) => {
      // Không hiển thị toast vì đây là hành động tự động, không cần thông báo
      
      // Gọi callback để cập nhật local state ngay lập tức
      if (onSuccessCallback) {
        onSuccessCallback(variables.fromUserId);
      }

      // Invalidate các query cache liên quan
      // Chat history của conversation cụ thể
      queryClient.invalidateQueries({
        queryKey: ["chat-history", variables.fromUserId],
      });
      
      // Danh sách conversations để cập nhật unread count
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      // Total unread count
      queryClient.invalidateQueries({
        queryKey: ["unread-count"],
      });
    },
    
    onError: (error, variables) => {
      handleError(error);
      
      // Chỉ log error, không hiển thị toast để tránh spam user
      console.error(`Failed to mark messages as read for user ${variables.fromUserId}:`, error);
    },
  });
};