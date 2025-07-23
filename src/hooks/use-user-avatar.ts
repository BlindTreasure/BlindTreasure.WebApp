import { useAppSelector } from "@/stores/store";
import { useServiceGetSellerProfile } from "@/services/account/services";

export default function useUserAvatar() {
  const userState = useAppSelector((state) => state.userSlice);
  const isSeller = userState.user?.roleName === "Seller";

  const { data: sellerData } = useServiceGetSellerProfile({
    enabled: isSeller,
  });
  const seller = sellerData?.value?.data;

  const avatarUrl = (() => {
    if (isSeller && seller?.avatarUrl) {
      return seller.avatarUrl;
    }

    if (userState.user?.avatarUrl) {
      return userState.user.avatarUrl;
    }
    return "/images/unknown_avatar.png";
  })();

  return {
    avatarUrl,
    seller: isSeller ? seller : null,
    isSeller,
  };
}
