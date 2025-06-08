// components/PaginationFooter.tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Pagination from "../pagination";

interface PaginationFooterProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageSizeChange: (newSize: number) => void;
    onPageChange: (page: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageSizeChange,
    onPageChange
}) => {
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="p-4 border-t bg-white dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span>Hiển thị</span>
                <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <span>mỗi trang</span>
            </div>

            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                <span className="hidden sm:inline">
                    Đang hiển thị {startIndex} - {endIndex} / {totalItems} sản phẩm
                </span>
                <span className="inline sm:hidden">
                    {startIndex} - {endIndex} / {totalItems}
                </span>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
};
