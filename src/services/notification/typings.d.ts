declare namespace REQUEST {
  type NotificationParamsRequest = {
    pageIndex?: number;
    pageSize?: number;
    type?: string;
  }
}

declare namespace API {
  type NotificationResponse = {
    userId: string;
    id: string;
    title: string;
    message: string;
    type: 'System' | 'Order' | 'Promotion' | 'Product' | 'General' | 'Trading';
    sourceUrl?: string;
    sentAt: string;
    readAt: string;
    isRead: boolean;
    isDeleted: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    targetRole?: string;
  }

  type NotificationListResponse = {
    items: NotificationResponse[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
  }

  type MessageNotification = {
    message: string
  }

}

