const STRIPE = "/stripe";

const CHECKOUT_DIRECT = `${STRIPE}/checkout-direct`;
const CHECKOUT_CART = `${STRIPE}/checkout`;
const CHECKOUT_CALLBACK_HANDLER = `${STRIPE}/checkout-callback-handler`;

const ONBOARDING_LINK = `${STRIPE}/onboarding-link`;
const LOGIN_LINK = `${STRIPE}/login-link`;

const PAYOUT = `${STRIPE}/payout`;
const REFUND = `${STRIPE}/refund`;
const REVERSE_PAYOUT = `${STRIPE}/reverse-payout`;

const VERIFY_SELLER_ACCOUNT = `${STRIPE}/verify-seller-account`;

const REFUND_CALLBACK_HANDLER = `${STRIPE}/refund-callback-handler`;

const PREVIEW_SHIPPING_DIRECT = `${STRIPE}/preview-shipping-direct`;

const GROUP_PAYMENT_LINK = `${STRIPE}/group-payment-link`;
const CANCEL_PAYMENT = `${STRIPE}/cancel-payment`;

export default {
  CHECKOUT_DIRECT,
  CHECKOUT_CART,
  CHECKOUT_CALLBACK_HANDLER,
  ONBOARDING_LINK,
  LOGIN_LINK,
  PAYOUT,
  REFUND,
  REVERSE_PAYOUT,
  VERIFY_SELLER_ACCOUNT,
  REFUND_CALLBACK_HANDLER,
  PREVIEW_SHIPPING_DIRECT,
  GROUP_PAYMENT_LINK,
  CANCEL_PAYMENT,
};
