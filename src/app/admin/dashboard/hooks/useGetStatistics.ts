// import useToast from "@/hooks/use-toast";
// import { getDashboard } from "@/services/order/api-services";
// import { getAllProduct } from "@/services/product/api-services";
// import { isTResponseData } from "@/utils/compare";
// import { useRef, useState } from "react";

// export default function useGetDashboard() {
//   const { addToast } = useToast();
//   const [isPending, setPending] = useState(false);
//   const hasFetchedData = useRef(false);

//   const getDashboardApi = async (params: REQUEST.GetDashboard) => {
//     setPending(true);
//     try {
//       const res = await getDashboard(params);
//       if (isTResponseData(res)) {
//         return res as TResponseData<API.TDashboardData>;
//       } else {
//         addToast({
//           type: "error",
//           description: "Failed to fetch books",
//         });
//         return null;
//       }
//     } catch (error) {
//       addToast({
//         type: "error",
//         description: "An error occurred while fetching books",
//       });
//       return null;
//     } finally {
//       setPending(false);
//     }
//   };

//   return { isPending, getDashboardApi };
// }
