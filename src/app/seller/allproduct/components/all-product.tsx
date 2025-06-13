"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GetProduct, Product, TProductResponse } from "@/services/product-seller/typings"
import useGetAllProduct from "../hooks/useGetAllProduct"
import moment from "moment"
import { FaRegEdit } from "react-icons/fa"
import { HiOutlineTrash } from "react-icons/hi"
import { BsEye } from "react-icons/bs"
import { CiSearch } from "react-icons/ci";
import { ProductSortBy } from "@/const/products"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import EditProductSeller from "../../create-product/components/edit-product"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useDeleteProduct from "../hooks/useDeleteProduct"
import ProductDetailDialog from "@/components/alldialog/dialogproduct"
import { PaginationFooter } from "@/components/pagination-footer"

export default function ProductTable() {
    const [products, setProducts] = useState<TProductResponse>()
    const { getAllProductApi, isPending } = useGetAllProduct()
    const { onDelete, isPending: isDeleting } = useDeleteProduct();
    const [params, setParams] = useState<GetProduct>({
        pageIndex: 1,
        pageSize: 5,
        search: "",
        status: "",
        categoryId: "",
        sortBy: undefined,
        desc: undefined,
    })

    const [searchInput, setSearchInput] = useState("")
    const [selectedProductToEdit, setSelectedProductToEdit] = useState<Product | null>(null);
    const [selectedProductToView, setSelectedProductToView] = useState<Product | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const openModal = (product: Product) => {
        setSelectedProductToView(product);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProductToEdit(product);
        setOpen(true);
    };

    const handleDeleteClick = (productId: string) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            onDelete(productToDelete, () => {
                setParams({ ...params });
                setProductToDelete(null);
            });
        }
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            setParams((prev) => ({ ...prev, search: searchInput, pageIndex: 1 }))
        }, 500)
        return () => clearTimeout(delay)
    }, [searchInput])

    useEffect(() => {
        (async () => {
            const res = await getAllProductApi(params)
            if (res) setProducts(res.value.data)
        })()
    }, [params])

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > (products?.totalPages || 1)) return
        setParams((prev) => ({ ...prev, pageIndex: newPage }))
    }

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
        <div>
            <Card className="mt-6 shadow-lg rounded-lg border border-gray-200">
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                        <div className="relative w-full sm:w-1/3">
                            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-4 ">
                            <Select
                                value={params.sortBy}
                                onValueChange={(value) =>
                                    setParams((prev) => ({
                                        ...prev,
                                        sortBy: value as ProductSortBy,
                                        pageIndex: 1,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ProductSortBy.CreatedAt}>Ngày tạo</SelectItem>
                                    <SelectItem value={ProductSortBy.Name}>Tên</SelectItem>
                                    <SelectItem value={ProductSortBy.Price}>Giá</SelectItem>
                                    <SelectItem value={ProductSortBy.Stock}>Kho</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={
                                    typeof params.desc === "boolean"
                                        ? params.desc
                                            ? "desc"
                                            : "asc"
                                        : undefined
                                }
                                onValueChange={(value) =>
                                    setParams((prev) => ({
                                        ...prev,
                                        desc: value === "desc" ? true : false,
                                        pageIndex: 1,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Thứ tự" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Tăng dần</SelectItem>
                                    <SelectItem value="desc">Giảm dần</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                onValueChange={(value) =>
                                    setParams((prev) => ({
                                        ...prev,
                                        status: value === "all" ? "" : value,
                                        pageIndex: 1,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="Active">Hoạt động</SelectItem>
                                    <SelectItem value="Inactive">Không hoạt động</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Kho</TableHead>
                                <TableHead>Loại hàng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell><Skeleton className="w-14 h-14 rounded" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                products?.result.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.imageUrls && product.imageUrls.length > 0 ? (
                                                <img
                                                    src={product.imageUrls[0]}
                                                    alt={product.name}
                                                    className="w-24 h-14 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-24 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                    No image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price.toLocaleString()}₫</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${product.productType === "DirectSale"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product.productType}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${product.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {getStatusLabel(product.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{moment(product.createdAt).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell className="flex gap-4">
                                            <Button variant="outline" size="icon" onClick={() => handleEditClick(product)}>
                                                <FaRegEdit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-red-500"
                                                onClick={() => handleDeleteClick(product.id)}
                                                disabled={isDeleting}
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => openModal(product)}>
                                                <BsEye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {selectedProductToView && (
                        <ProductDetailDialog
                            product={selectedProductToView}
                            isOpen={true}
                            onClose={() => setSelectedProductToView(null)}
                        />
                    )}

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-poppins text-xl">Cập nhật sản phẩm</DialogTitle>
                            </DialogHeader>
                            {selectedProductToEdit && (
                                <EditProductSeller
                                    productData={selectedProductToEdit}
                                    onUpdateSuccess={() => {
                                        setOpen(false);
                                        setParams({ ...params });
                                    }}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmDelete}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Xóa
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <PaginationFooter
                        currentPage={params.pageIndex}
                        totalPages={products?.totalPages ?? 1}
                        totalItems={products?.count ?? 0}
                        pageSize={params.pageSize}
                        onPageSizeChange={(newSize) => {
                            setParams((prev) => ({
                                ...prev,
                                pageSize: newSize,
                                pageIndex: 1,
                            }));
                        }}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
