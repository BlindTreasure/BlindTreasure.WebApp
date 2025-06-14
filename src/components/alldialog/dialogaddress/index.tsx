import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ProvinceSelect from "@/components/province-selected";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export default function AddressDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [type, setType] = useState<"home" | "office" | null>(null)
    type Province = { name: string; code: number }
    type District = { name: string; code: number }
    type Ward = { name: string; code: number }

    const [address, setAddress] = useState<{
        province: Province | null
        district: District | null
        ward: Ward | null
    }>({
        province: null,
        district: null,
        ward: null,
    })

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xl max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Địa chỉ mới</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input className="border px-3 py-2 rounded w-full" placeholder="Họ và tên" />
                    <input className="border px-3 py-2 rounded w-full" placeholder="Số điện thoại" />
                </div>

                <div className="mb-4">
                    <ProvinceSelect onChange={setAddress} />
                </div>

                <div className="mb-4">
                    <input className="w-full border px-3 py-2 rounded" placeholder="Địa chỉ cụ thể" />
                </div>

                <div className="mb-4">
                    <button className="flex items-center border px-3 py-2 rounded text-gray-600">
                        <span className="mr-2">+</span> Thêm vị trí
                    </button>
                </div>

                <div className="mb-4">
                    <span className="block text-sm font-medium mb-2">Loại địa chỉ:</span>
                    <div className="flex space-x-2">
                        {["home", "office"].map((item) => (
                            <div
                                key={item}
                                onClick={() => setType(item as "home" | "office")}
                                className={`px-4 py-2 rounded border cursor-pointer 
          ${type === item ? " text-red-600 border-red-500" : "bg-white text-gray-800 border-gray-400"}`}
                            >
                                {item === "home" ? "Nhà Riêng" : "Văn Phòng"}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Đặt làm mặc định</Label>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>Trở Lại</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">Hoàn thành</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

