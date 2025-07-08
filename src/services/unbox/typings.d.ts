import { Rarity } from "@/const/products";

export type UnboxResult = {
  productId: string;
  rarity: Rarity;
  weight: number;
  dropRate: number;
  unboxedAt: string;
};

