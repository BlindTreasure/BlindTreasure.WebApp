"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { FaRegEdit } from "react-icons/fa"
import { HiOutlineTrash } from "react-icons/hi"
import { BsEye } from "react-icons/bs"
import { CiSearch } from "react-icons/ci";
import { BlindboxStatus, BlindboxStatusText, ProductSortBy, ProductStatus, Rarity, RarityColorClass, RarityText } from "@/const/products"
import { BlindBox, BlindBoxItem, BlindBoxItemRequest, BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings"
import useGetAllBlindBoxes from "../hooks/useGetAllBlindBoxes"
import { IoIosArrowDown } from "react-icons/io";
import { FiChevronRight } from "react-icons/fi";
import moment from "moment"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import BlindboxDetailDialog from "@/components/alldialog/dialogblindbox"
import { PaginationFooter } from "@/components/pagination-footer"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CreateBlindbox from "@/components/blindboxform/createBlindBox"
import useGetAllProduct from "../../allproduct/hooks/useGetAllProduct"
import { GetProduct, TProductResponse } from "@/services/product-seller/typings"
import useSubmitBlindbox from "../hooks/useSubmitBlindbox"
import useDeleteAllItemsBlindbox from "../hooks/useDeleteAllItemBlindbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MdOutlineCleaningServices } from "react-icons/md";
import useDeleteBlindbox from "../hooks/useDeleteBlindbox";
import { CreateBlindBoxBodyType } from "@/utils/schema-validations/create-blindbox.schema";
import BlindboxItemDetailDialog from "@/components/alldialog/dialogblindboxitem";
export default function BlindboxTable() {
    const [blindboxes, setBlindBox] = useState<BlindBoxListResponse>()
    const [products, setProducts] = useState<TProductResponse>()
    const [selecteddetailBlindbox, setSelectedDetailBlindbox] = useState<BlindBox | null>(null);
    const [selectedItemDetail, setSelectedItemDetail] = useState<BlindBoxItem | null>(null);
    const [selectedBlindboxToEditBlindbox, setSelectedBlindboxToEditBlindbox] = useState<BlindBox | null>(null);
    const [selectedBlindboxToEditItem, setSelectedBlindboxToEditBlindboxItem] = useState<BlindBoxItemRequest | null>(null);
    const [openEditBlindbox, setOpenEditBlindbox] = useState(false);
    const [openEditItem, setOpenEditItem] = useState(false);
    const { getAllBlindBoxesApi, isPending } = useGetAllBlindBoxes()
    const [searchInput, setSearchInput] = useState("")
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [submitBlindbox, setSubmitBlindbox] = useState<string | null>(null);
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [deleteAllItemDialogOpen, setDeleteAllItemDialogOpen] = useState(false);
    const [allItemToDelete, setAllItemToDelete] = useState<string | null>(null);
    const [deleteBlindboxDialogOpen, setDeleteBlindboxDialogOpen] = useState(false);
    const [blindBoxToDelete, setBlindBoxToDelete] = useState<string | null>(null);
    const { onSubmit, isPending: isSubmitting } = useSubmitBlindbox();
    const { onDeleteAllItem, isPending: isDeletingAllItem } = useDeleteAllItemsBlindbox();
    const { onDeleteBlindbox, isPending: isDeletingBlindbox } = useDeleteBlindbox();

    const [params, setParams] = useState<GetBlindBoxes>({
        search: "",
        SellerId: "",
        categoryId: "",
        status: "",
        minPrice: undefined,
        maxPrice: undefined,
        ReleaseDateFrom: "",
        ReleaseDateTo: "",
        pageIndex: 1,
        pageSize: 5,
    })

    const openModal = (blindbox: BlindBox) => {
        setSelectedDetailBlindbox(blindbox);
    };

    const handleEditClick = (blindbox: BlindBox) => {
        setSelectedBlindboxToEditBlindbox(blindbox);
        setOpenEditBlindbox(true);
    };

    const handleSubmitBlindbox = (blindbox: string) => {
        setSubmitBlindbox(blindbox);
        setSubmitDialogOpen(true);
    };

    const handleDeleteAllItem = (blindbox: string) => {
        setAllItemToDelete(blindbox);
        setDeleteAllItemDialogOpen(true);
    };

    const handleDeleteBlindbox = (blindbox: string) => {
        setBlindBoxToDelete(blindbox);
        setDeleteBlindboxDialogOpen(true);
    };

    const handleConfirmSubmit = () => {
        if (submitBlindbox) {
            onSubmit(submitBlindbox, () => {
                setParams({ ...params });
                setSubmitBlindbox(null);
            });
        }
        setSubmitDialogOpen(false);
    };

    const handleConfirmDeleteAllItem = () => {
        if (allItemToDelete) {
            onDeleteAllItem(allItemToDelete, () => {
                setParams({ ...params });
                setAllItemToDelete(null);
            });
        }
        setDeleteAllItemDialogOpen(false);
    };

    const handleConfirmDeleteBlindbox = () => {
        if (blindBoxToDelete) {
            onDeleteBlindbox(blindBoxToDelete, () => {
                setParams({ ...params });
                setBlindBoxToDelete(null);
            });
        }
        setDeleteBlindboxDialogOpen(false);
    };

    function toUtcMidnightISOString(date: Date): string {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return utcDate.toISOString();
    }

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };


    useEffect(() => {
        const delay = setTimeout(() => {
            setParams((prev) => ({ ...prev, search: searchInput, pageIndex: 1 }))
        }, 500)
        return () => clearTimeout(delay)
    }, [searchInput])

    useEffect(() => {
        (async () => {
            const res = await getAllBlindBoxesApi(params)
            if (res) setBlindBox(res.value.data)
        })()
    }, [params])

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > (blindboxes?.totalPages || 1)) return
        setParams((prev) => ({ ...prev, pageIndex: newPage }))
    }

    const { getAllProductApi } = useGetAllProduct()

    const [productParams, setProductParams] = useState<GetProduct>({
        pageIndex: 1,
        pageSize: 5,
        search: "",
        productStatus: ProductStatus.Active,
        categoryId: "",
        sortBy: undefined,
        desc: undefined,
    })

    const fetchBlindboxes = async () => {
        const res = await getAllBlindBoxesApi(params);
        if (res) {
            setBlindBox(res.value.data);
            const boxIds = res.value.data.result.map((box: any) => box.id);
        }
    };

    useEffect(() => {
        fetchBlindboxes();
    }, [params]);


    useEffect(() => {
        (async () => {
            const res = await getAllProductApi(productParams)
            if (res) setProducts(res.value.data)
        })()
    }, [productParams])



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
                                    <SelectItem value="Draft">Nháp</SelectItem>
                                    <SelectItem value="PendingApproval">Chờ phê duyệt</SelectItem>
                                    <SelectItem value="Approved">Đã phê duyệt</SelectItem>
                                    <SelectItem value="Rejected">Từ chối</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 items-center">
                            <Input
                                type="number"
                                placeholder="Giá tối thiểu"
                                className="w-40"
                                onChange={(e) =>
                                    setParams((prev) => ({
                                        ...prev,
                                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                                        pageIndex: 1,
                                    }))
                                }
                            />
                            <Input
                                type="number"
                                placeholder="Giá tối đa"
                                className="w-40"
                                onChange={(e) =>
                                    setParams((prev) => ({
                                        ...prev,
                                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                                        pageIndex: 1,
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-40 justify-between text-left font-normal">
                                        {params.ReleaseDateFrom
                                            ? format(new Date(params.ReleaseDateFrom), "dd/MM/yyyy")
                                            : "Từ ngày"}
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={params.ReleaseDateFrom ? new Date(params.ReleaseDateFrom) : undefined}
                                        onSelect={(date) =>
                                            setParams((prev) => ({
                                                ...prev,
                                                ReleaseDateFrom: date ? toUtcMidnightISOString(date) : "",
                                                pageIndex: 1,
                                            }))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-40 justify-between text-left font-normal">
                                        {params.ReleaseDateTo
                                            ? format(new Date(params.ReleaseDateTo), "dd/MM/yyyy")
                                            : "Đến ngày"}
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={params.ReleaseDateTo ? new Date(params.ReleaseDateTo) : undefined}
                                        onSelect={(date) =>
                                            setParams((prev) => ({
                                                ...prev,
                                                ReleaseDateTo: date ? toUtcMidnightISOString(date) : "",
                                                pageIndex: 1,
                                            }))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Độ hiếm</TableHead>
                                <TableHead>Ngày phát hành</TableHead>
                                <TableHead>Trạng thái</TableHead>
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
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                blindboxes?.result.map((blindbox) => {
                                    const isExpanded = expandedIds.has(blindbox.id);
                                    const canSubmit =
                                        (blindbox.status === BlindboxStatus.Draft || blindbox.status === BlindboxStatus.Rejected) &&
                                        blindbox.items && blindbox.items.length > 0;
                                    return (
                                        <React.Fragment key={blindbox.id}>
                                            <TableRow
                                            >
                                                <TableCell className="flex items-center gap-2 min-w-[150px]">
                                                    {blindbox.items && blindbox.items.length > 0 ? (
                                                        isExpanded ? (
                                                            <IoIosArrowDown
                                                                className="w-4 h-4 shrink-0 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpand(blindbox.id);
                                                                }}
                                                            />
                                                        ) : (
                                                            <FiChevronRight
                                                                className="w-4 h-4 shrink-0 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpand(blindbox.id);
                                                                }}
                                                            />
                                                        )
                                                    ) : (
                                                        <span className="w-4 h-4" />
                                                    )}

                                                    {blindbox.imageUrl ? (
                                                        <img
                                                            src={blindbox.imageUrl}
                                                            alt={blindbox.name}
                                                            className="w-24 h-14 object-cover rounded shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-24 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 shrink-0">
                                                            No image
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-[160px] truncate whitespace-nowrap overflow-hidden" title={blindbox.name}>
                                                    {blindbox.name}
                                                </TableCell>
                                                <TableCell>{blindbox.price.toLocaleString()}₫</TableCell>
                                                <TableCell>{blindbox.totalQuantity}</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>{moment(blindbox.releaseDate).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${blindbox.status === BlindboxStatus.Draft
                                                            ? "bg-gray-100 text-gray-700"
                                                            : blindbox.status === BlindboxStatus.PendingApproval
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : blindbox.status === BlindboxStatus.Approved
                                                                    ? "bg-green-100 text-green-700"
                                                                    : blindbox.status === BlindboxStatus.Rejected
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-gray-200 text-gray-600"
                                                            }`}
                                                    >
                                                        {BlindboxStatusText[blindbox.status]}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="flex gap-4">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleEditClick(blindbox)}
                                                    >
                                                        <FaRegEdit className="w-4 h-4" />
                                                    </Button>

                                                    <Button variant="outline" size="icon" onClick={() => openModal(blindbox)}>
                                                        <BsEye className="w-4 h-4" />
                                                    </Button>

                                                    <TooltipProvider>
                                                        {blindbox.items && blindbox.items.length > 0 ? (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="text-orange-500"
                                                                        onClick={() => handleDeleteAllItem(blindbox.id)}
                                                                        disabled={isDeletingAllItem}
                                                                    >
                                                                        <MdOutlineCleaningServices className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Xóa tất cả sản phẩm</TooltipContent>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="text-red-500"
                                                                        onClick={() => handleDeleteBlindbox(blindbox.id)}
                                                                        disabled={isDeletingBlindbox}

                                                                    >
                                                                        <HiOutlineTrash className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Xóa blindbox</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </TooltipProvider>

                                                    {blindbox.status === BlindboxStatus.PendingApproval ? (
                                                        <Button variant="outline" disabled className="text-yellow-600 cursor-not-allowed">
                                                            Đã gửi duyệt
                                                        </Button>
                                                    ) : blindbox.status === BlindboxStatus.Approved ? (
                                                        <Button variant="outline" disabled className="text-green-600 cursor-not-allowed">
                                                            Đã duyệt
                                                        </Button>
                                                    ) : !canSubmit ? (
                                                        <Button variant="outline" disabled className="text-gray-400 cursor-not-allowed">
                                                            Thêm item trước
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            className="text-blue-600"
                                                            onClick={() => handleSubmitBlindbox(blindbox.id)}
                                                            disabled={isSubmitting}
                                                        >
                                                            Gửi duyệt
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            {isExpanded &&
                                                blindbox.items.map((item) => (
                                                    <TableRow key={item.productId} className="bg-gray-50">
                                                        <TableCell className="pl-10 w-24">
                                                            {item.imageUrl ? (
                                                                <img
                                                                    src={item.imageUrl}
                                                                    alt={item.productName}
                                                                    className="w-20 h-12 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                                    No image
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="max-w-[120px] truncate whitespace-nowrap overflow-hidden" title={item.productName}>
                                                            {item.productName}
                                                        </TableCell>

                                                        <TableCell>-</TableCell>
                                                        <TableCell>{item.quantity}</TableCell>

                                                        <TableCell>
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-medium ${RarityColorClass[item.rarity]}`}
                                                            >
                                                                {RarityText[item.rarity]}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell>-</TableCell>
                                                        <TableCell>-</TableCell>

                                                        <TableCell className="flex gap-4">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => setSelectedItemDetail(item)}
                                                            >
                                                                <BsEye className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                        </React.Fragment>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    {selecteddetailBlindbox && (
                        <BlindboxDetailDialog
                            blindbox={selecteddetailBlindbox}
                            isOpen={true}
                            onClose={() => setSelectedDetailBlindbox(null)}
                        />
                    )}

                    {selectedItemDetail && (
                        <BlindboxItemDetailDialog
                            item={selectedItemDetail}
                            isOpen={!!selectedItemDetail}
                            onClose={() => setSelectedItemDetail(null)}
                        />
                    )}

                    <Dialog open={openEditBlindbox} onOpenChange={setOpenEditBlindbox}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-poppins text-xl">Cập nhật tùi mù</DialogTitle>
                            </DialogHeader>
                            {selectedBlindboxToEditBlindbox && (
                                <CreateBlindbox
                                    mode="edit"
                                    blindboxId={selectedBlindboxToEditBlindbox?.id}
                                    blindbox={selectedBlindboxToEditBlindbox}
                                    onSuccess={() => {
                                        setOpenEditBlindbox(false);
                                        fetchBlindboxes();
                                    }}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận gửi duyệt Blindbox</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn gửi duyệt blindbox này? Sau khi gửi, bạn sẽ không thể chỉnh sửa cho đến khi được phản hồi.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmSubmit}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Gửi duyệt
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={deleteAllItemDialogOpen} onOpenChange={setDeleteAllItemDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa tất cả sản phẩm</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa tất cả sản phẩm trong blindbox này? Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmDeleteAllItem}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Xóa tất cả
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={deleteBlindboxDialogOpen} onOpenChange={setDeleteBlindboxDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa túi mù</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa túi mù này? Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmDeleteBlindbox}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Xóa
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <PaginationFooter
                        currentPage={params.pageIndex}
                        totalPages={blindboxes?.totalPages ?? 1}
                        totalItems={blindboxes?.count ?? 0}
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
