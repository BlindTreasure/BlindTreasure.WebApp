"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddAddressDialog from "@/components/alldialog/dialogaddress";

export default function AddressList() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className="p-6 bg-white rounded shadow mt-40">
            <div className="border border-b-0 p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Địa chỉ của tôi</h2>
                    <Button onClick={() => setShowDialog(true)} className="bg-red-500 hover:bg-red-600 text-white">
                        + Thêm địa chỉ mới
                    </Button>
                </div>
            </div>
            
            <div className="p-6 border">
                <h2 className="text-xl font-semibold">Địa chỉ</h2>
                <div className=" space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-lg">
                            <p>Nguyễn Thị Hồng Hạnh</p>
                            <div className="w-px h-5 bg-gray-300" />
                            <p>(+84) 987 570 351</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="border rounded-sm border-red-500 p-2 text-red-500">Cập nhật</button>
                            <button className="border rounded-sm border-red-500 p-2 text-red-500">Xóa</button>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-lg text-gray-600">136, Đường 160</p>
                            <p className="text-lg text-gray-600">Phường Tăng Nhơn Phú A, Thành Phố Thủ Đức, TP. Hồ Chí Minh</p>
                        </div>
                        <div><button className="border rounded-sm border-blue-500 p-2 text-blue-500">Thiết lập mặc định</button></div>
                    </div>
                    <div><button className="border rounded-sm border-green-500 p-2 text-green-500">Mặc định</button></div>
                </div>
            </div>
            <AddAddressDialog open={showDialog} onClose={() => setShowDialog(false)} />
        </div>
    );
}
