const TRADING = "/trading"
const TRADE_REQUEST = "/trade-requests"
const VIEW_TRADE_REQUEST_LISTING = (listingId: string) => `${TRADING}/${listingId}${TRADE_REQUEST}`
const ACCEPT_TRADE_REQUEST = (tradeRequestId: string) => `${TRADING}${TRADE_REQUEST}/${tradeRequestId}/respond`
const VIEW_TRADE_REQUEST_DETAIL= (tradeRequestId: string) => `${TRADING}${TRADE_REQUEST}/${tradeRequestId}`
const LOCK_TRADE_REQUEST = (tradeRequestId: string) => `${TRADING}${TRADE_REQUEST}/${tradeRequestId}/lock`
const VIEW_MY_TRADING_HISTORY = TRADING + "/histories"

export default {
    VIEW_TRADE_REQUEST_LISTING,
    ACCEPT_TRADE_REQUEST,
    VIEW_TRADE_REQUEST_DETAIL,
    LOCK_TRADE_REQUEST,
    VIEW_MY_TRADING_HISTORY
}