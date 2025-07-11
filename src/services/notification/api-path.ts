const NOTIFICATION = "/notifications";
const UNREAD_COUNT = `${NOTIFICATION}/unread-count`;
const MARK_AS_READ = (notificationId: string) => `${NOTIFICATION}/${notificationId}/read`;
const MARK_ALL_AS_READ = `${NOTIFICATION}/read-all`; // Endpoint chính xác từ controller
const DELETE_NOTIFICATION = (notificationId: string) => `${NOTIFICATION}/${notificationId}`;

export default {
  NOTIFICATION,
  UNREAD_COUNT,
  MARK_AS_READ,
  MARK_ALL_AS_READ,
  DELETE_NOTIFICATION,
}; 