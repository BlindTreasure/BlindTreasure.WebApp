import { StatisticRange } from "@/const/seller";

export type AdminStatistics = {
  range: StatisticRange;
  startDate?: string;
  endDate?: string;
};

export type DashboardResponse = {
  revenueSummary: RevenueSummary;
  orderSummary: OrderSummary;
  sellerSummary: SellerSummary;
  customerSummary: CustomerSummary;
  topCategories: TopCategory[];
  timeSeries: TimeSeries;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
};

export type RevenueSummary = {
  totalGrossAmount: number;
  totalPlatformFee: number;
  totalNetAmount: number;
  revenueGrowthPercent: number;
  previousPeriodRevenue: number;
  platformFeeRate: number;
  revenueTakingRate: number;
  totalPayouts: number;
  estimatedGrossAmount: number;
  estimatedPlatformFee: number;
  estimatedNetAmount: number;
  estimatedOrderCount: number;
};

export type OrderSummary = {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  inventoryOrders: number;
  refundedOrders: number;
  orderGrowthPercent: number;
  averageOrderValue: number;
  totalItemsSold: number;
  estimatedOrders: number;
  estimatedAverageOrderValue: number;
  estimatedItemsSold: number;
};

export type SellerSummary = {
  totalSellers: number;
  activeSellers: number;
  topSellers: SellerItem[];
  estimatedActiveSellers: number;
  estimatedTopSellers: SellerItem[];
};

export type SellerItem = {
  sellerId: string;
  sellerName: string;
  totalRevenue: number;
  platformFeeGenerated: number;
  payoutCount: number;
  estimatedRevenue: number;
  estimatedPlatformFeeGenerated: number;
  estimatedPayoutCount: number;
};

export type CustomerSummary = {
  totalCustomers: number;
  newCustomersThisPeriod: number;
};

export type TopCategory = {
  categoryName: string;
  orderCount: number;
  revenue: number;
  estimatedOrderCount: number;
  estimatedRevenue: number;
};

export type TimeSeries = {
  categories: string[];
  platformRevenue: number[];
  grossSales: number[];
  payoutCounts: number[];
  orderCounts: number[];
  estimatedPlatformRevenue: number[];
  estimatedGrossSales: number[];
  estimatedPayoutCounts: number[];
  estimatedOrderCounts: number[];
};
