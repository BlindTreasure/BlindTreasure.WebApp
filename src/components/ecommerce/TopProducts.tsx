// "use client";
// import React, { useState, useEffect } from "react";
// import { getSellerStatisticsTopProducts } from "@/services/seller-dashboard/api-services";
// import { StatisticRange } from "@/const/seller";
// import { SellerStatisticsTopProduct } from "@/services/seller-dashboard/typings";

// export default function TopProducts() {
//   const [topProducts, setTopProducts] = useState<SellerStatisticsTopProduct[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchTopProducts = async () => {
//       setIsLoading(true);
//       try {
//         const response = await getSellerStatisticsTopProducts({
//           range: StatisticRange.MONTH,
//         });

//         if (response.value?.data) {
//           setTopProducts(response.value.data);
//         }
//       } catch (error) {
//         console.error("Error fetching top products:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTopProducts();
//   }, []);

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) {
//       return `${(num / 1000000).toFixed(1)}M`;
//     } else if (num >= 1000) {
//       return `${(num / 1000).toFixed(1)}K`;
//     }
//     return num.toString();
//   };

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-900 dark:bg-gray-900">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Top sản phẩm bán chạy
//         </h3>
//       </div>

//       <div className="mb-4">
//         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
//           <span>Sản phẩm</span>
//           <span>Doanh thu</span>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {isLoading ? (
//           <div className="py-8 text-center">
//             <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
//           </div>
//         ) : topProducts.length === 0 ? (
//           <div className="py-8 text-center">
//             <div className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm bán chạy</div>
//           </div>
//         ) : (
//           topProducts.slice(0, 5).map((product, index) => (
//             <div key={product.productId} className="flex items-center justify-between py-2">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
//                   {index + 1}
//                 </span>
//                 <img
//                   src={product.productImageUrl}
//                   alt={product.productName}
//                   className="w-12 h-12 object-cover rounded"
//                 />
//                 <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">
//                   {product.productName}
//                 </span>
//               </div>
//               <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                 {formatNumber(product.revenue)}₫
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useState, useEffect } from "react";
// import { getSellerStatisticsTopProducts } from "@/services/seller-dashboard/api-services";
// import { StatisticRange, StatisticRangeText } from "@/const/seller";
// import { SellerStatisticsTopProduct } from "@/services/seller-dashboard/typings";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function TopProducts() {
//   const [topProducts, setTopProducts] = useState<SellerStatisticsTopProduct[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [range, setRange] = useState<StatisticRange>(StatisticRange.DAY);
//   const [fromDate, setFromDate] = useState<string>("");
//   const [toDate, setToDate] = useState<string>("");

//   const fetchTopProducts = async () => {
//     setIsLoading(true);
//     try {
//       const params: any = { range };
//       if (range === StatisticRange.CUSTOM && fromDate && toDate) {
//         params.from = fromDate;
//         params.to = toDate;
//       }

//       const response = await getSellerStatisticsTopProducts(params);
//       if (response.value?.data) {
//         setTopProducts(response.value.data);
//       } else {
//         setTopProducts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching top products:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (range !== StatisticRange.CUSTOM) {
//       fetchTopProducts();
//     }
//   }, [range]);

//   const handleCustomSubmit = () => {
//     if (fromDate && toDate) {
//       fetchTopProducts();
//     }
//   };

//   const formatCurrency = (num: number) => {
//     return new Intl.NumberFormat("vi-VN").format(num) + "₫";
//   };

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-900 dark:bg-gray-900">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Top sản phẩm bán chạy
//         </h3>

//         <Select
//           value={range}
//           onValueChange={(val: StatisticRange) => setRange(val)}
//         >
//           <SelectTrigger className="w-[160px]">
//             <SelectValue placeholder="Khoảng thời gian" />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.values(StatisticRange)
//               .filter((r) => r !== StatisticRange.TODAY)
//               .map((r) => (
//                 <SelectItem key={r} value={r}>
//                   {StatisticRangeText[r]}
//                 </SelectItem>
//               ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {range === StatisticRange.CUSTOM && (
//         <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
//           <div className="flex flex-col sm:flex-row gap-2">
//             <Input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="text-sm flex-1"
//             />
//             <Input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="text-sm flex-1"
//             />
//           </div>
//           <Button size="sm" className="w-1/3 mx-auto" onClick={handleCustomSubmit}>Áp dụng</Button>
//         </div>
//       )}

//       <div className="mb-4">
//         <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
//           <span>Sản phẩm</span>
//           <span>Doanh thu</span>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="py-8 text-center text-gray-500 dark:text-gray-400">
//           Đang tải dữ liệu...
//         </div>
//       ) : topProducts.length === 0 ? (
//         <div className="py-8 text-center text-gray-500 dark:text-gray-400">
//           Chưa có sản phẩm bán chạy
//         </div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-10">#</TableHead>
//               <TableHead>Sản phẩm</TableHead>
//               <TableHead className="text-right">Giá</TableHead>
//               <TableHead className="text-right">SL bán</TableHead>
//               <TableHead className="text-right">Doanh thu</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {topProducts.slice(0, 10).map((product, index) => (
//               <TableRow key={product.productId}>
//                 <TableCell className="text-sm text-gray-500 dark:text-gray-400">
//                   {index + 1}
//                 </TableCell>
//                 <TableCell>
//                   {/* <div className="flex items-center gap-3">
//                     <img
//                       src={product.productImageUrl}
//                       alt={product.productName}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {product.productName}
//                     </span>
//                   </div> */}

//                 </TableCell>
//                 <TableCell className="text-right">
//                   {formatCurrency(product.price)}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   {product.quantitySold}
//                 </TableCell>
//                 <TableCell className="text-right font-semibold">
//                   {formatCurrency(product.revenue)}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { getSellerStatisticsTopProducts } from "@/services/seller-dashboard/api-services";
import { StatisticRange, StatisticRangeText } from "@/const/seller";
import { SellerStatisticsTopProduct } from "@/services/seller-dashboard/typings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function TopProducts() {
  const [topProducts, setTopProducts] = useState<SellerStatisticsTopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState<StatisticRange>(StatisticRange.DAY);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<SellerStatisticsTopProduct | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchTopProducts = async () => {
    setIsLoading(true);
    try {
      const params: any = { range };
      if (range === StatisticRange.CUSTOM && fromDate && toDate) {
        params.from = fromDate;
        params.to = toDate;
      }

      const response = await getSellerStatisticsTopProducts(params);
      if (response.value?.data) {
        setTopProducts(response.value.data);
      } else {
        setTopProducts([]);
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (range !== StatisticRange.CUSTOM) {
      fetchTopProducts();
    }
  }, [range]);

  const handleCustomSubmit = () => {
    if (fromDate && toDate) {
      fetchTopProducts();
    }
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num) + "₫";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-900 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top sản phẩm bán chạy
        </h3>

        <Select
          value={range}
          onValueChange={(val: StatisticRange) => setRange(val)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(StatisticRange)
              .filter((r) => r !== StatisticRange.TODAY)
              .map((r) => (
                <SelectItem key={r} value={r}>
                  {StatisticRangeText[r]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {range === StatisticRange.CUSTOM && (
        <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-sm flex-1"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-sm flex-1"
            />
          </div>
          <Button size="sm" className="w-1/3 mx-auto" onClick={handleCustomSubmit}>
            Áp dụng
          </Button>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Sản phẩm</span>
          <span>Doanh thu</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : topProducts.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Chưa có sản phẩm bán chạy
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
              <TableHead className="text-right">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.slice(0, 10).map((product, index) => (
              <TableRow key={product.productId}>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 max-w-[100px]">
                    <img
                      src={product.productImageUrl}
                      alt={product.productName}
                      className="w-12 h-12 object-cover rounded shrink-0"
                    />
                    <span
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
                      title={product.productName} 
                    >
                      {product.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(product.revenue)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsDetailOpen(true);
                    }}
                  >
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>Thông tin chi tiết sản phẩm</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 mt-4">
                <img
                  src={selectedProduct.productImageUrl}
                  alt={selectedProduct.productName}
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="text-sm space-y-1">
                  <p><strong>Tên:</strong> {selectedProduct.productName}</p>
                  <p><strong>Giá:</strong> {formatCurrency(selectedProduct.price)}</p>
                  <p><strong>SL bán:</strong> {selectedProduct.quantitySold}</p>
                  <p><strong>Doanh thu:</strong> {formatCurrency(selectedProduct.revenue)}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
