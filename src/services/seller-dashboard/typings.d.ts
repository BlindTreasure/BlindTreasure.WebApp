import { StatisticRange } from "@/const/seller";
import { OrderStatus } from "@/const/products";

export type SellerStatistics = {
  range: StatisticRange;
  startDate?: string;
  endDate?: string;
};

export type SellerStatisticsTimeSeries = {
  range: SellerStatisticsParams["range"];
  categories: string[];
  sales: number[];
  revenue: number[];
};

export type SellerStatisticsOverview = {
  totalRevenue: number;
  totalRevenueLastPeriod: number;
  revenueGrowthPercent: number;
  totalOrders: number;
  totalOrdersLastPeriod: number;
  ordersGrowthPercent: number;
  totalProductsSold: number;
  totalProductsSoldLastPeriod: number;
  productsSoldGrowthPercent: number;
  averageOrderValue: number;
  averageOrderValueLastPeriod: number;
  averageOrderValueGrowthPercent: number;
  timeSeriesData: SellerStatisticsTimeSeries;
};

export type SellerStatisticsTopProduct = {
  productId: string;
  productName: string;
  productImageUrl: string;
  quantitySold: number;
  revenue: number;
  price: number;
};

export type SellerStatisticsTopBlindboxes = {
  blindBoxId: string;
  blindBoxName: string;
  blindBoxImageUrl: string;
  quantitySold: number;
  revenue: number;
  price: number;
}

export type SellerStatisticsOrderStatus = {
  status: OrderStatus;
  count: number;
  revenue: number;
  percentage: number;
};

export type SellerStatisticsResponse = {
  overview: SellerStatisticsOverview;
  topProducts: SellerStatisticsTopProduct[];
  topBlindBoxes: SellerStatisticsTopBlindboxes[]; 
  orderStatusStats: SellerStatisticsOrderStatus[];
  lastUpdated: string;
};
