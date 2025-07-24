import { Rarity } from "@/const/products";

export type UnboxResult = {
  productId: string;
  rarity: Rarity;
  weight: number;
  dropRate: number;
  unboxedAt: string;
};

export type GetUnboxLogsParams = {
  userId?: string;
  productId?: string;
};

export type ResponseUnboxLogs = {
  id: string;
  customerBlindBoxId: string;
  customerName: string;
  productId: string;
  productName: string;
  rarity: Rarity;
  dropRate: number;
  rollValue: number;
  unboxedAt: string;
  blindBoxName: string;
  reason: string;
};
