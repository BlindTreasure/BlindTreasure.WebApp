"use client";
import { useEffect, useState } from "react";
import BlindboxCard from "@/components/blindbox-card";
import { BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import { Backdrop } from "@/components/backdrop";
import { useRouter } from "next/navigation";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import Pagination from "@/components/pagination";

export default function AllBlindBoxes() {
  const [blindboxes, setBlindboxes] = useState<BlindBoxListResponse>();
  const { getAllBlindBoxesApi, isPending: isPendingBlindbox } = useGetAllBlindBoxes();
  const router = useRouter();

  const [blindBoxParams] = useState<GetBlindBoxes>({
    pageIndex: 1,
    pageSize: 9999,
    search: "",
    SellerId: "",
    categoryId: "",
    status: "",
    minPrice: undefined,
    maxPrice: undefined,
    ReleaseDateFrom: "",
    ReleaseDateTo: "",
    HasItem: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    (async () => {
      const res = await getAllBlindBoxesApi(blindBoxParams);
      if (res) setBlindboxes(res.value.data);
    })();
  }, []);

  const allItems = blindboxes?.result.filter((b) => b.items && b.items.length > 0) ?? [];

  const totalPages = Math.ceil(allItems.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = allItems.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center mt-40">Tất cả Blindbox</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((box) => (
          <BlindboxCard
            key={box.id}
            blindbox={box}
            ribbonTypes={["blindbox"]}
            onViewDetail={(id) => router.push(`/detail-blindbox/${id}`)}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Backdrop open={isPendingBlindbox} />
    </div>
  );
}
