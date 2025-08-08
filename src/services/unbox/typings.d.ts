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
  PageIndex?: number;
  PageSize?: number;
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

export type ResponseUnboxLogsList = {
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  result: ResponseUnboxLogs[];
};
