"use client"
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function Openbox() {
    const [quantity, setQuantity] = useState<number>(1);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="px-4 py-8 mt-36">
            <h2 className="text-2xl font-semibold text-center mb-6 pb-2 w-full max-w-md mx-auto">
                Mở Hộp Nào
            </h2>

            <div className="max-w-6xl mx-auto p-6 shadow-md rounded-lg mt-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full max-w-sm mx-auto">
                        <img
                            src="/images/blindbox1.webp"
                            alt="MEGA SPACE MOLLY 400"
                            className="rounded-lg w-full h-80 object-cover"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">MEGA SPACE MOLLY 400</h3>
                        <p className="text-gray-600 mb-4">Hãy thử vận may của bạn. Mở hộp và nhận lấy bất ngờ</p>

                        <div className="mb-4">
                            <p className="font-medium mb-2">Tỉ lệ</p>
                            <ul className="space-y-1">
                                <li className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span>5% Siêu hiếm</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                                    <span>35% Hiếm</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-300"></span>
                                    <span>60% Bình thường</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-400 rounded-full overflow-hidden">
                                <button
                                    onClick={handleDecrease}
                                    className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                                >
                                    −
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-12 h-10 text-center border-t border-b border-gray-400"
                                />
                                <button
                                    onClick={handleIncrease}
                                    className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                            <Button className="px-4 py-2 hover:bg-white hover:text-black border border-gray-200 transition-colors duration-300 h-12">Mở Hộp</Button>
                        </div>
                    </div>
                </div>

                <div className="xl:px-20 mt-4">
                    <p className="font-medium text-xl mb-2 text-gray-600">
                        Các sản phẩm bạn đã nhận được trong bộ sưu tập này
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            🎉 MEGA SPACE MOLLY 400... ×1
                        </li>
                        <li className="flex items-start gap-2">
                            🎉 MEGA SPACE MOLLY 400... ×1
                        </li>
                        <li className="flex items-start gap-2">
                            🎉 MEGA SPACE MOLLY 400... ×1
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    );
}
