import { useMutation } from "@tanstack/react-query";
import {
  getOnboardingLink,
  getLoginLink,
  verifySellerAccount,
} from "@/services/stripe/api-services";

export function useGetOnboardingLink() {
  return useMutation({
    mutationFn: getOnboardingLink,
  });
}

export function useGetLoginLink() {
  return useMutation({
    mutationFn: getLoginLink,
  });
}

export function useVerifySellerAccount() {
  return useMutation({
    mutationFn: verifySellerAccount,
  });
}
