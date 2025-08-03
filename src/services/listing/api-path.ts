const LISTING = "/listings";
const AVAILABLE_ITEMS = LISTING + "/available-items"
const LISTING_WITH_ID = (listingId: string) => `${LISTING}/${listingId}`
const CLOSE_LISTING = (listingId: string) => `${LISTING}/${listingId}/close`


export default {
    LISTING,
    AVAILABLE_ITEMS,
    LISTING_WITH_ID,
    CLOSE_LISTING
};
