const CUSTOMER_FAVOURITE = "/customer-favourites";
const CUSTOMER_FAVOURITE_WITH_ID = (favouriteId: string) => `${CUSTOMER_FAVOURITE}/${favouriteId}`;

export default {
  CUSTOMER_FAVOURITE,
  CUSTOMER_FAVOURITE_WITH_ID,
};
