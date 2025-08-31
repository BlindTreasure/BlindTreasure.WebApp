
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { BlindboxStatusText, StockStatus, stockStatusMap } from "@/const/products";
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
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Thương hiệu:</strong> {blindbox.brand}
                                </div>
                                {blindbox.rejectReason && (
                                    <div className="text-gray-700 dark:text-gray-300">
                                        <strong>Lí do bị từ chối:</strong> {blindbox.rejectReason}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Ngày phát hành:</strong>{' '}
                                    {new Date(blindbox.releaseDate).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Trạng thái:</strong> {BlindboxStatusText[blindbox.status]}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Sản phẩm bí mật:</strong> {blindbox.hasSecretItem ? "Có" : "Không"}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Xác suất bí mật:</strong> {blindbox.secretProbability.toFixed(2)}%
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    <strong>Tình trạng kho:</strong> {stockStatusMap[blindbox.blindBoxStockStatus as StockStatus]}
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
                            <div className="grid gap-3">
                                {blindbox.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex items-center gap-4 p-2 rounded-md border bg-white dark:bg-gray-800 shadow-sm"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName}
                                            className="w-14 h-14 object-cover rounded-md border"
                                        />
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                            {item.productName}
                                        </p>
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
