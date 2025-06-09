
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { BlindBox } from "@/services/blindboxes/typings";
import { useState } from "react";

interface BlindboxDetailDialogProps {
    blindbox: BlindBox;
    isOpen: boolean;
    onClose: () => void;
}

const BlindboxDetailDialog: React.FC<BlindboxDetailDialogProps> = ({ blindbox, isOpen, onClose }) => {
    const [loadingPage, setLoadingPage] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogTitle className="border-b pb-4 text-lg font-semibold">Chi tiết tùi mù</DialogTitle>
                <DialogDescription asChild>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Tên:</strong> {blindbox.name}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Giá:</strong> {blindbox.price.toLocaleString()}₫
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Số lượng:</strong> {blindbox.totalQuantity}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Ngày phát hành:</strong> {new Date(blindbox.releaseDate).toLocaleDateString()}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Trạng thái:</strong> {blindbox.status}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Secret item:</strong> {blindbox.hasSecretItem ? "Có" : "Không"}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Xác suất Secret:</strong> {(blindbox.secretProbability * 100).toFixed(2)}%
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Mô tả</h3>
                            <p className="text-gray-600 dark:text-gray-300">{blindbox.description}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Hình ảnh</h3>
                            <img src={blindbox.imageUrl} alt="Blindbox" className="w-40 rounded-md shadow" />
                        </div>

                        <div className="mb-4">
                            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Danh sách vật phẩm</h3>
                            <div className="grid gap-4">
                                {blindbox.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="p-3 border rounded-md flex items-center gap-4 bg-gray-50 dark:bg-gray-800"
                                    >
                                        <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">{item.productName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Rarity: {item.rarity}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Drop rate: {item.dropRate}%</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Số lượng: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default BlindboxDetailDialog;
