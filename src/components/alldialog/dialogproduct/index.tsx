import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/services/product-seller/typings";

interface ProductDetailDialogProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({ product, isOpen, onClose }) => {
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "Active":
                return "Đang hoạt động";
            case "Inactive":
                return "Ngừng hoạt động";
            default:
                return status;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogTitle className="border-b pb-4 text-lg font-semibold">Chi tiết sản phẩm</DialogTitle>
                <DialogDescription asChild>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <div>
                            <strong>Tên:</strong> {product.name}
                        </div>
                        <div>
                            <strong>Mô tả:</strong> {product.description}
                        </div>
                        <div>
                            <strong>Giá:</strong> {product.price.toLocaleString()} VND
                        </div>
                        <div>
                            <strong>Tồn kho:</strong> {product.stock}
                        </div>
                        <div>
                            <strong>Chiều cao:</strong> {product.height} cm
                        </div>
                        <div>
                            <strong>Chất liệu:</strong> {product.material}
                        </div>
                        <div>
                            <strong>Loại sản phẩm:</strong> {product.productType}
                        </div>
                        <div>
                            <strong>Thương hiệu:</strong> {product.brand}
                        </div>
                        <div>
                            <strong>Trạng thái:</strong> {getStatusLabel(product.status)}
                        </div>
                        <div>
                            <strong>Ngày tạo:</strong> {new Date(product.createdAt).toLocaleString()}
                        </div>
                        <div>
                            <strong>Ngày cập nhật:</strong> {new Date(product.updatedAt).toLocaleString()}
                        </div>

                        <div>
                            <strong>Hình ảnh:</strong>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {product.imageUrls.length > 0 ? (
                                    product.imageUrls.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`${product.name} hình ${idx + 1}`}
                                            className="w-40 h-40 object-cover rounded-md border"
                                        />
                                    ))
                                ) : (
                                    <p>Không có hình ảnh</p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailDialog;
