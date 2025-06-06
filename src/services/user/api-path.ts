const USERS = "/users";
const CHANGE_STATUS_USERS_BY_ADMIN = (sellerId: string) => `${USERS}/${sellerId}/status`;

export default {
  USERS,
  CHANGE_STATUS_USERS_BY_ADMIN
};
  