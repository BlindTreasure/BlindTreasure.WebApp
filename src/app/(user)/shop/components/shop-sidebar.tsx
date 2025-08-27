'use client';

import { Dispatch, SetStateAction } from "react";

interface ShopSidebarProps {
    filterType: 'all' | 'product' | 'blindbox';
    setFilterType: Dispatch<SetStateAction<'all' | 'product' | 'blindbox'>>;
    minPrice: number | null;
    setMinPrice: Dispatch<SetStateAction<number | null>>;
    maxPrice: number | null;
    setMaxPrice: Dispatch<SetStateAction<number | null>>;
    setCurrentPage: Dispatch<SetStateAction<number>>;
}

const priceRanges = [
    { label: "Tất cả", min: null, max: null },
    { label: "Dưới 200.000₫", min: 0, max: 200000 },
    { label: "200.000₫ - 500.000₫", min: 200000, max: 500000 },
    { label: "500.000₫ - 1.000.000₫", min: 500000, max: 1000000 },
    { label: "1.000.000₫ - 2.000.000₫", min: 1000000, max: 2000000 },
    { label: "2.000.000₫ - 4.000.000₫", min: 2000000, max: 4000000 },
    { label: "Trên 4.000.000₫", min: 4000000, max: null },
];

export default function ShopSidebar({
    filterType,
    setFilterType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    setCurrentPage
}: ShopSidebarProps) {

    const handlePriceRangeChange = (min: number | null, max: number | null) => {
        setCurrentPage(1);
        setMinPrice(min);
        setMaxPrice(max);
    };

    return (
        <aside className="bg-white p-4 border rounded-lg shadow-sm h-fit w-full mt-8">
            <div className="mb-6">
                <h4 className="font-semibold text-[#d02a2a] mb-3">Loại sản phẩm</h4>
                <div className="flex flex-col gap-2 text-base ml-2">
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "product", label: "Sản phẩm" },
                        { key: "blindbox", label: "Blindbox" },
                    ].map((btn) => (
                        <button
                            key={btn.key}
                            onClick={() => {
                                setFilterType(btn.key as any);
                                setCurrentPage(1);
                            }}
                            className={`text-left transition ${filterType === btn.key
                                    ? "text-[#d02a2a] font-medium"
                                    : "text-gray-700 hover:text-red-500"
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="my-4" />

            <div className="mb-6">
                <h4 className="font-semibold mb-3 text-[#d02a2a]">Giá</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-700 ml-2">
                    {priceRanges.map((range, index) => (
                        <label
                            key={index}
                            className="flex items-center gap-2 cursor-pointer hover:text-red-600"
                        >
                            <input
                                type="radio"
                                name="priceRange"
                                className="h-4 w-4 accent-red-600 text-red-600 focus:ring-red-500 border-gray-300"
                                checked={minPrice === range.min && maxPrice === range.max}
                                onChange={() => handlePriceRangeChange(range.min, range.max)}
                            />
                            <span>{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}

