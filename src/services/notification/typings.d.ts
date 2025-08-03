declare namespace REQUEST {
  type NotificationParamsRequest = {
    pageIndex?: number;
    pageSize?: number
  }
}

declare namespace API {
  type NotificationResponse = {
    id: string;
    title: string;
    message: string;
    type: 'System' | 'Order' | 'Promotion' | 'Product' | 'General';
    sentAt: string;
    isRead: boolean;
    isDeleted: boolean;
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

