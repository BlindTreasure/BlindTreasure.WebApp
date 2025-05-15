// 'use client'
// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import useGetDashboard from "@/app/admin/dashboard/hooks/useGetStatistics";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// export default function StatisticsChart() {
//   const { isPending, getDashboardApi } = useGetDashboard();
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
//   const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
//   const [chartData, setChartData] = useState<{ categories: string[]; series: any[] }>({
//     categories: [],
//     series: [],
//   });

//   const monthMapping: Record<string, string> = {
//     January: "Tháng 1", February: "Tháng 2", March: "Tháng 3", April: "Tháng 4",
//     May: "Tháng 5", June: "Tháng 6", July: "Tháng 7", August: "Tháng 8",
//     September: "Tháng 9", October: "Tháng 10", November: "Tháng 11", December: "Tháng 12"
//   };

//   const weekMapping: Record<string, string> = {
//     "Week 1": "Tuần 1", "Week 2": "Tuần 2", "Week 3": "Tuần 3", "Week 4": "Tuần 4"
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const params: any = { year: selectedYear };

//       if (selectedMonth !== null) params.month = selectedMonth + 1;
//       if (selectedWeek !== null) params.week = selectedWeek;

//       const res = await getDashboardApi(params);
//       if (res?.value?.data) {
//         const { data } = res.value.data;

//         setChartData({
//           categories: data.map((item) => monthMapping[item.name] || weekMapping[item.name] || item.name),
//           series: [
//             { name: "Sales", data: data.map((item) => item.sales) },
//             { name: "Revenue", data: data.map((item) => item.revenue) },
//           ],
//         });
//       }
//     };

//     fetchData();
//   }, [selectedYear, selectedMonth, selectedWeek]);

//   const options: ApexOptions = {
//     chart: { height: 310, type: "area", toolbar: { show: false } },
//     stroke: { curve: "smooth", width: [2, 2] },
//     dataLabels: { enabled: false },
//     colors: ["#465FFF", "#9CB9FF"],
//     xaxis: { categories: chartData.categories },
//     yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] } } },
//     legend: { show: false },
//   };

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5">
//       <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
//         <div>
//           <h3 className="text-lg font-semibold">Thống kê</h3>
//           <p className="text-gray-500">Mục tiêu bạn đã đặt</p>
//         </div>
//         <div className="flex gap-3">
//           <Select onValueChange={(value) => setSelectedYear(Number(value))}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder={selectedYear} />
//             </SelectTrigger>
//             <SelectContent>
//               {[2022, 2023, 2024, 2025].map((year) => (
//                 <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select onValueChange={(value) => setSelectedMonth(value === "all" ? null : Number(value))}>
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Chọn tháng" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Tất cả</SelectItem>
//               {Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`).map((month, index) => (
//                 <SelectItem key={month} value={index.toString()}>{month}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {selectedMonth !== null && (
//             <Select onValueChange={(value) => setSelectedWeek(value === "all" ? null : Number(value))}>
//               <SelectTrigger className="w-[120px]">
//                 <SelectValue placeholder="Chọn tuần" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tất cả</SelectItem>
//                 {[1, 2, 3, 4].map((week) => (
//                   <SelectItem key={week} value={week.toString()}>Tuần {week}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </div>

//       {isPending ? (
//         <p>Đang tải dữ liệu...</p>
//       ) : (
//         <ReactApexChart options={options} series={chartData.series} type="area" height={310} />
//       )}
//     </div>
//   );
// }
"use client";
import React from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Revenue",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you’ve set for each month
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
