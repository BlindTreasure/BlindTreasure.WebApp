const ACCOUNT = "/me";
const GET_ACCOUNT_PROFILE = ACCOUNT;
const UPDATE_AVATAR_PROFILE = ACCOUNT + "/avatar";
const UPDATE_INFO_PROFILE = ACCOUNT;
const GET_ACCOUNT_SELLER_PROFILE = ACCOUNT + "/seller-profile";
const UPDATE_INFO_SELLER_PROFILE = ACCOUNT + "/seller-profile";
const UPDATE_AVATAR_SELLER = ACCOUNT + "/seller-avatar";
const ADD_ADDRESS = ACCOUNT + "/addresses";
const GET_ADDRESSES = ACCOUNT + "/addresses";
const ADDRESS_BY_ID = (addressId: string) => `${ACCOUNT}/addresses/${addressId}`;
const SET_DEFAULT_ADDRESS = (addressId: string) => `${ACCOUNT}/addresses/${addressId}/default`;


export default {
  GET_ACCOUNT_PROFILE,
  UPDATE_AVATAR_PROFILE,
  UPDATE_INFO_PROFILE,
  GET_ACCOUNT_SELLER_PROFILE,
  UPDATE_INFO_SELLER_PROFILE,
  ADD_ADDRESS,
  GET_ADDRESSES,
  ADDRESS_BY_ID,
  SET_DEFAULT_ADDRESS,
  UPDATE_AVATAR_SELLER,
};
