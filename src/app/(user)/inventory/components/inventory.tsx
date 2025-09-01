'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { InventoryTabs } from '@/components/inventory-tabs'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Backdrop } from '@/components/backdrop'
import Pagination from '@/components/pagination'
import useGetAllBlindboxInventory from '../hooks/useGetBlindboxInventory'
import useGetAllItemInventory from '../hooks/useGetItemInventory'
import QuickViewDialog from '@/components/alldialog/dialogquickly'
import { Product } from '@/services/inventory-item/typings'
import { BlindBox } from '@/services/customer-blindboxes/typings'
import useUnbox from '../hooks/useUnbox'
import useGetItemByBlindBox from '../hooks/useGetItemByBlindBox'
import usePreviewShipment from '../hooks/usePreViewShipment'
import useRequestShipment from '../hooks/useRequestShipment'
import useGetAllAddress from '../../address-list/hooks/useGetAllAddress'
import { InventoryItem as WonInventoryItem, ShipmentPreview } from '@/services/inventory-item/typings'
import { InventoryItemStatus, InventoryItemStatusText } from '@/const/products'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface InventoryItem {
    id: string
    title: string
    image: string
    status: 'unopened' | 'opened' | null
    type: 'blindbox' | 'product'
    orderId?: string
    blindBoxId: string
    productId?: string
    product?: Product
    blindbox?: BlindBox
    quantity?: number
    createdAt?: string
    isFromBlindBox?: boolean
    inventoryItemStatus?: InventoryItemStatus
}

// Define status filter type - chỉ giữ lại các status cần thiết
type StatusFilter = 'all' | 'Available' | 'Shipment_requested' | 'Delivering' | 'Delivered' | 'Reserved' | 'Listed' | 'Sold' | 'Archived' | 'OnHold'

// Status display mapping - cập nhật để chỉ có các status cần thiết
const statusDisplayMap: Record<StatusFilter, string> = {
    'all': 'Tất cả',
    'Available': 'Có sẵn',
    'Shipment_requested': 'Yêu cầu vận chuyển',
    'Delivering': 'Đang giao hàng',
    'Delivered': 'Đã giao hàng',
    'Reserved': 'Đã đặt trước',
    'Listed': 'Đang niêm yết',
    'Sold': 'Đã bán',
    'Archived': 'Đã lưu trữ',
    'OnHold': 'Tạm giữ'
}

// Danh sách các status filters theo thứ tự hiển thị
const statusFilters: StatusFilter[] = [
    'all',
    'Available',
    'Shipment_requested',
    'Delivering',
    'Delivered',
    'Reserved',
    'Listed',
    'Sold',
    'Archived',
    'OnHold'
]

export default function Inventory() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [blindboxFilter, setBlindboxFilter] = useState<'all' | 'opened' | 'unopened'>('all')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'product' | 'blindbox'>('all')

    const { handleUnbox, isUnboxing } = useUnbox()
    const [showPrizeDialog, setShowPrizeDialog] = useState(false)
    const [selectedPrize, setSelectedPrize] = useState<{
        customerBlindBoxId: string
        blindBoxId: string
        blindBoxName: string
    } | null>(null)

    const { inventoryItem: wonItem, isLoading: loadingPrize, error: prizeError } = useGetItemByBlindBox(
        selectedPrize?.blindBoxId || ''
    )
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showShippingDialog, setShowShippingDialog] = useState(false)
    const [shippingData, setShippingData] = useState<ShipmentPreview[] | null>(null)

    const { previewShipment, isPending: isPreviewLoading } = usePreviewShipment()
    const { requestShipment, isPending: isRequestLoading } = useRequestShipment()
    const { getAllAddressApi, defaultAddress } = useGetAllAddress()

    const PAGE_SIZE = 8

    const {
        getAllBlindboxInventoryApi,
        isPending: isBlindboxLoading,
    } = useGetAllBlindboxInventory()

    const {
        getAllItemInventoryApi,
        isPending: isItemLoading,
    } = useGetAllItemInventory()

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    const getCurrentPageItems = () => {
        return inventoryItems
    }

    useEffect(() => {
        const fetchInventory = async () => {
            setIsLoading(true)
            try {
                if (activeTab === 'blindbox') {
                    const paginationParams = {
                        pageIndex: currentPage,
                        pageSize: PAGE_SIZE,
                        isOpened: blindboxFilter === 'all' ? undefined : blindboxFilter === 'opened'
                    };

                    const blindboxRes = await getAllBlindboxInventoryApi(paginationParams)
                    if (blindboxRes?.value.data?.result) {
                        const blindboxItems: InventoryItem[] = blindboxRes.value.data.result.map((item: any) => ({
                            id: item.id,
                            inventoryItemIds: item.inventoryItemIds,
                            blindBoxId: item.blindBoxId,
                            blindbox: item.blindBox,
                            title: item.blindBox?.name || '',
                            image: item.blindBox?.imageUrl ?? '',
                            status: item.isOpened ? 'opened' : 'unopened',
                            type: 'blindbox',
                            orderId: item.orderDetailId,
                            createdAt: item.createdAt,
                        }))
                        const sortedBlindboxItems = blindboxItems.sort((a, b) => {
                            if (!a.createdAt || !b.createdAt) return 0;
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        });
                        setInventoryItems(sortedBlindboxItems)
                        setTotalPages(blindboxRes.value.data.totalPages)
                        setTotalCount(blindboxRes.value.data.count)
                    }
                } else if (activeTab === 'all') {
                    const paginationParams: {
                        pageIndex: number,
                        pageSize: number,
                        status?: string,
                        isFromBlindBox?: boolean
                    } = {
                        pageIndex: currentPage,
                        pageSize: PAGE_SIZE,
                    };

                    if (statusFilter !== 'all') {
                        paginationParams.status = statusFilter;
                    }

                    if (itemTypeFilter === 'product') {
                        paginationParams.isFromBlindBox = false;
                    } else if (itemTypeFilter === 'blindbox') {
                        paginationParams.isFromBlindBox = true;
                    }

                    const itemRes = await getAllItemInventoryApi(paginationParams)

                    if (itemRes?.value.data?.result) {
                        const itemItems: InventoryItem[] = itemRes.value.data.result.map((item: any, index: number) => ({
                            id: item.id,
                            productId: item.productId,
                            product: item.product,
                            title: item.product?.name || '',
                            image: item.product?.imageUrls?.[0] ?? '',
                            status: null,
                            type: 'product',
                            quantity: item.quantity,
                            createdAt: item.createdAt,
                            isFromBlindBox: item.isFromBlindBox,
                            blindBoxId: item.isFromBlindBox ? (item.sourceCustomerBlindBoxId || '') : '',
                            inventoryItemStatus: item.status,
                        }))

                        const sortedItems = itemItems.sort((a, b) => {
                            if (!a.createdAt || !b.createdAt) return 0;
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        });

                        setInventoryItems(sortedItems)
                        setTotalPages(itemRes.value.data.totalPages)
                        setTotalCount(itemRes.value.data.count)
                    }
                }
            } catch (error) {
                setInventoryItems([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchInventory()
    }, [activeTab, currentPage, blindboxFilter, statusFilter, itemTypeFilter])

    useEffect(() => {
        getAllAddressApi()
    }, [])

    const handleViewDetail = (id: string, type: 'blindbox' | 'product', blindBoxId?: string, productId?: string) => {
        setIsLoading(true)
        if (type === 'blindbox' && blindBoxId) {
            router.push(`/detail-blindbox/${blindBoxId}`)
        } else if (type === 'product' && productId) {
            router.push(`/detail/${productId}`)
        } else {
            setIsLoading(false)
        }
    }

    const handleOpenBox = (customerBlindBoxId: string) => {
        const blindBoxItem = inventoryItems.find(item => item.id === customerBlindBoxId);
        const blindBoxName = blindBoxItem?.title || 'BlindBox';
        const blindBoxId = blindBoxItem?.blindBoxId;
        handleUnbox(customerBlindBoxId, blindBoxName, blindBoxId);
    }

    const handleViewPrize = (customerBlindBoxId: string) => {
        const blindBoxItem = inventoryItems.find(item => item.id === customerBlindBoxId);
        if (blindBoxItem && blindBoxItem.blindBoxId) {
            setSelectedPrize({
                customerBlindBoxId,
                blindBoxId: blindBoxItem.blindBoxId,
                blindBoxName: blindBoxItem.title
            });
            setShowPrizeDialog(true);
        }
    }

    const handleResellItem = (itemId?: string) => {
        if (itemId && itemId.trim() !== '') {
            sessionStorage.setItem('preselectedInventoryId', itemId);
            router.push('/marketplace/create');
        }
    }

    const handleDeliver = async (itemId: string) => {
        const item = inventoryItems.find(i => i.id === itemId)

        if (!item || !item.id) {
            return
        }

        setSelectedItems([itemId])

        try {
            const result = await previewShipment({
                inventoryItemIds: [item.id]
            })

            if (result) {
                setShippingData(result)
                setShowShippingDialog(true)
            }
        } catch (error: any) {
        }
    }

    const handleSelectItem = (itemId: string) => {
        const item = inventoryItems.find(i => i.id === itemId);

        if (item?.inventoryItemStatus === InventoryItemStatus.Delivering) {
            return;
        }

        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const handleSelectAll = () => {
        const selectableItems = getCurrentPageItems().filter(item =>
            ((item.type === 'product' && !item.isFromBlindBox) ||
                (item.type === 'product' && item.isFromBlindBox)) &&
            item.inventoryItemStatus !== InventoryItemStatus.Delivering &&
            item.inventoryItemStatus !== InventoryItemStatus.Delivered &&
            item.inventoryItemStatus !== InventoryItemStatus.Archived
        )

        if (selectedItems.length === selectableItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(selectableItems.map(item => item.id))
        }
    }

    const handlePreviewShipping = async () => {
        if (selectedItems.length === 0) return

        const selectedInventoryItemIds = selectedItems
            .map(itemId => {
                const item = inventoryItems.find(i => i.id === itemId)
                return item?.id
            })
            .filter(Boolean) as string[]

        if (selectedInventoryItemIds.length === 0) {
            return
        }

        try {
            const result = await previewShipment({
                inventoryItemIds: selectedInventoryItemIds
            })

            if (result) {
                setShippingData(result)
                setShowShippingDialog(true)
            }
        } catch (error: any) {
        }
    }

    const handleExchangeItem = (inventoryId?: string) => {
        if (inventoryId && inventoryId.trim() !== '') {
            sessionStorage.setItem('preselectedInventoryId', inventoryId);
            setShowPrizeDialog(false);
            router.push('/marketplace/create');
        }
    }

    const handleRequestShipping = async () => {
        if (selectedItems.length === 0) return

        const selectedInventoryItemIds = selectedItems
            .map(itemId => {
                const item = inventoryItems.find(i => i.id === itemId)
                return item?.id
            })
            .filter(Boolean) as string[]

        if (selectedInventoryItemIds.length === 0) {
            return
        }

        try {
            const result = await requestShipment({
                inventoryItemIds: selectedInventoryItemIds
            })

            if (result) {
                setSelectedItems([])
                setShippingData(null)
                setShowShippingDialog(false)
                setCurrentPage(1)
                if (result.paymentUrl) {
                    window.location.href = result.paymentUrl
                }
            }
        } catch (error: any) {
        }
    }

    const getStatusDisplayText = (status?: InventoryItemStatus | null) => {
        if (!status) return 'Chưa có trạng thái'
        return statusDisplayMap[status as StatusFilter] || status
    }

    const getStatusColor = (status?: InventoryItemStatus | null) => {
        switch (status) {
            case 'Available':
                return 'text-green-600 bg-green-50'
            case 'Shipment_requested':
                return 'text-blue-600 bg-blue-50'
            case 'Delivering':
                return 'text-orange-600 bg-orange-50'
            case 'Listed':
                return 'text-purple-600 bg-purple-50'
            case 'Delivered':
                return 'text-gray-600 bg-gray-50'
            default:
                return 'text-gray-400 bg-gray-50'
        }
    }

    const handleItemTypeFilterChange = (type: 'all' | 'product' | 'blindbox') => {
        setItemTypeFilter(type);
        setStatusFilter('all');
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: StatusFilter) => {
        setStatusFilter(status)
        setItemTypeFilter('all');
        setCurrentPage(1)
    }


    return (
        <div className="p-4 container mx-auto mt-32">
            <InventoryTabs
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab)
                    setCurrentPage(1)
                    // Reset filters when changing tabs
                    if (tab !== 'blindbox') {
                        setBlindboxFilter('all')
                    }
                    if (tab !== 'all') {
                        setStatusFilter('all')
                    }
                }}
            />

            {/* Filter cho blindbox */}
            {activeTab === 'blindbox' && (
                <div className="flex gap-2 mt-4 mb-2 px-9 flex-wrap">
                    <Button
                        variant={blindboxFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setBlindboxFilter('all')
                            setCurrentPage(1)
                        }}
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={blindboxFilter === 'opened' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setBlindboxFilter('opened')
                            setCurrentPage(1)
                        }}
                    >
                        Đã mở
                    </Button>
                    <Button
                        variant={blindboxFilter === 'unopened' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setBlindboxFilter('unopened')
                            setCurrentPage(1)
                        }}
                    >
                        Chưa mở
                    </Button>
                </div>
            )}

            {/* Filter cho products */}
            {activeTab === 'all' && (
                <div className="mt-4 mb-2 px-10 flex justify-end">
                    <div className="flex gap-4 justify-center w-fit">
                        {/* Select loại item */}
                        <Select
                            value={itemTypeFilter}
                            onValueChange={handleItemTypeFilterChange}
                        >
                            <SelectTrigger className="min-w-[150px]">
                                <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="product">Sản phẩm</SelectItem>
                                <SelectItem value="blindbox">Blindbox</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Select trạng thái */}
                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusFilter}
                        >
                            <SelectTrigger className="min-w-[150px]">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusFilters.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {statusDisplayMap[status]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {getCurrentPageItems().length === 0 && !isLoading && !isItemLoading && !isBlindboxLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <img
                        src="images/Empty-item.jpg"
                        alt="Không có sản phẩm"
                        className="w-48 h-48 object-contain mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {activeTab === 'blindbox'
                            ? 'Chưa có BlindBox nào'
                            : activeTab === 'all'
                                ? 'Chưa có sản phẩm nào trong kho'
                                : 'Chưa có sản phẩm nào'
                        }
                    </h3>
                    <p className="text-gray-500 max-w-md">
                        {activeTab === 'blindbox'
                            ? blindboxFilter === 'opened'
                                ? 'Bạn chưa mở BlindBox nào. Hãy mua và mở BlindBox để xem những gì bên trong!'
                                : blindboxFilter === 'unopened'
                                    ? 'Bạn không có BlindBox chưa mở nào. Hãy mua BlindBox mới!'
                                    : 'Bạn chưa có BlindBox nào. Hãy khám phá và mua BlindBox yêu thích!'
                            : statusFilter !== 'all'
                                ? `Không có sản phẩm nào với trạng thái "${statusDisplayMap[statusFilter]}"`
                                : 'Hãy bắt đầu mua sắm để thêm sản phẩm vào kho của bạn!'
                        }
                    </p>
                </div>
            ) : (
                <>
                    {activeTab === 'all' && (() => {
                        const selectableItems = getCurrentPageItems().filter(item =>
                            ((item.type === 'product' && !item.isFromBlindBox) ||
                                (item.type === 'product' && item.isFromBlindBox)) &&
                            item.inventoryItemStatus !== InventoryItemStatus.Delivering &&
                            item.inventoryItemStatus !== InventoryItemStatus.Delivered &&
                            item.inventoryItemStatus !== InventoryItemStatus.Archived
                        );
                        return selectableItems.length > 0;
                    })() && (
                            <div className="flex items-center justify-between mb-4 p-4 rounded-lg md:mx-9">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={selectedItems.length > 0 && selectedItems.length === getCurrentPageItems().filter(item =>
                                            ((item.type === 'product' && !item.isFromBlindBox) ||
                                                (item.type === 'product' && item.isFromBlindBox)) &&
                                            item.inventoryItemStatus !== InventoryItemStatus.Delivering &&
                                            item.inventoryItemStatus !== InventoryItemStatus.Delivered &&
                                            item.inventoryItemStatus !== InventoryItemStatus.Archived
                                        ).length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <span className="text-sm font-medium">
                                        {selectedItems.length > 0 ? `Chọn tất cả (${selectedItems.length} đã chọn)` : 'Chọn tất cả sản phẩm'}
                                    </span>
                                </div>
                                {selectedItems.length > 0 && (
                                    <Button
                                        onClick={handlePreviewShipping}
                                        disabled={isPreviewLoading}
                                        className="bg-[#d02a2a] hover:bg-opacity-80 text-white"
                                    >
                                        {isPreviewLoading ? 'Đang tính...' : `Giao hàng (${selectedItems.length})`}
                                    </Button>
                                )}
                            </div>
                        )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14 mt-6 md:px-9">
                        {getCurrentPageItems().map((item: InventoryItem) => (
                            <Card key={item.id} className="transition-all duration-300 transform hover:scale-105">
                                <CardHeader className='p-0'>
                                    <div className="relative group w-full aspect-[3/2] overflow-hidden rounded-t-lg">
                                        {activeTab === 'all' &&
                                            ((item.type === 'product' && !item.isFromBlindBox) || (item.type === 'product' && item.isFromBlindBox)) &&
                                            item.inventoryItemStatus !== InventoryItemStatus.Delivering &&
                                            item.inventoryItemStatus !== InventoryItemStatus.Delivered &&
                                            item.inventoryItemStatus !== InventoryItemStatus.Archived && (
                                                <div className="absolute top-2 left-2 z-10">
                                                    <Checkbox
                                                        checked={selectedItems.includes(item.id)}
                                                        onCheckedChange={() => handleSelectItem(item.id)}
                                                        className="bg-white border-2 border-gray-300"
                                                    />
                                                </div>
                                            )}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {item.quantity && item.quantity > 1 && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                {item.quantity}
                                            </div>
                                        )}
                                        {/* Status badge for products */}
                                        {item.type === 'product' && (
                                            <div className={`absolute bottom-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(item.inventoryItemStatus)}`}>
                                                {getStatusDisplayText(item.inventoryItemStatus)}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex gap-2">
                                                {item.type === 'product' && item.product && (
                                                    <QuickViewDialog type="product" data={item.product} />
                                                )}

                                                {item.type === 'blindbox' && item.blindbox && (
                                                    <QuickViewDialog type="blindbox" data={item.blindbox} />
                                                )}
                                                <Button
                                                    className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300"
                                                    onClick={() =>
                                                        handleViewDetail(item.id, item.type, item.blindBoxId, item.productId)
                                                    }
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="truncate text-lg">{item.title}</CardTitle>

                                        {item.type === 'blindbox' && item.status && (
                                            <span
                                                className={`text-sm font-medium ${item.status === 'opened' ? 'text-green-500' : 'text-yellow-500'
                                                    }`}
                                            >
                                                ({item.status === 'opened' ? 'Đã mở' : 'Chưa mở'})
                                            </span>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-2">
                                    {item.type === 'blindbox' && item.status === 'opened' ? (
                                        <div className="flex gap-2 w-full">
                                            <Button
                                                onClick={() => handleViewPrize(item.id)}
                                                className="flex-1 border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition"
                                            >
                                                Xem thưởng
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 w-full">
                                            {item.type === 'product' && !item.isFromBlindBox && (
                                                item.inventoryItemStatus === InventoryItemStatus.Archived ? (
                                                    <Button
                                                        disabled
                                                        className="flex-1 border border-gray-400 text-gray-400 bg-transparent cursor-not-allowed"
                                                    >
                                                        Đã lưu trữ
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleDeliver(item.id)}
                                                        disabled={
                                                            item.inventoryItemStatus === InventoryItemStatus.Delivering ||
                                                            item.inventoryItemStatus === InventoryItemStatus.Delivered
                                                        }
                                                        className="flex-1 border border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {item.inventoryItemStatus === InventoryItemStatus.Delivering
                                                            ? 'Đang giao hàng'
                                                            : item.inventoryItemStatus === InventoryItemStatus.Delivered
                                                                ? 'Đã giao hàng'
                                                                : 'Giao hàng'}
                                                    </Button>
                                                )
                                            )}

                                            {item.type === 'product' && item.isFromBlindBox && (
                                                item.inventoryItemStatus === InventoryItemStatus.Archived ? (
                                                    <Button
                                                        disabled
                                                        className="flex-1 border border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed"
                                                    >
                                                        Đã lưu trữ
                                                    </Button>
                                                ) : (
                                                    <>
                                                        {item.inventoryItemStatus !== InventoryItemStatus.Delivering &&
                                                            item.inventoryItemStatus !== InventoryItemStatus.Delivered && (
                                                                <Button
                                                                    onClick={() => handleResellItem(item.id)}
                                                                    className="flex-1 border border-orange-600 text-orange-600 bg-transparent hover:bg-orange-600 hover:text-white transition"
                                                                >
                                                                    Đổi hàng
                                                                </Button>
                                                            )}
                                                        <Button
                                                            onClick={() => handleDeliver(item.id)}
                                                            disabled={
                                                                item.inventoryItemStatus === InventoryItemStatus.Delivering ||
                                                                item.inventoryItemStatus === InventoryItemStatus.Delivered
                                                            }
                                                            className="flex-1 border border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {item.inventoryItemStatus === InventoryItemStatus.Delivering
                                                                ? 'Đang giao hàng'
                                                                : item.inventoryItemStatus === InventoryItemStatus.Delivered
                                                                    ? 'Đã giao hàng'
                                                                    : 'Giao hàng'}
                                                        </Button>
                                                    </>
                                                )
                                            )}

                                            {item.type === 'blindbox' && item.status === 'unopened' && (
                                                <Button
                                                    onClick={() => handleOpenBox(item.id)}
                                                    className="flex-1 border border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white transition"
                                                >
                                                    Mở hộp
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {getCurrentPageItems().length > 0 && totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            <Dialog open={showShippingDialog} onOpenChange={setShowShippingDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Xem trước phí vận chuyển</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            Bạn đang yêu cầu giao {selectedItems.length} sản phẩm
                        </div>

                        <div className="p-4 rounded-lg border bg-gray-50">
                            <h4 className="font-medium mb-2">📍 Địa chỉ nhận hàng</h4>
                            {defaultAddress ? (
                                <div className="text-sm">
                                    <p className="font-medium">{defaultAddress.fullName}</p>
                                    <p className="text-muted-foreground">{defaultAddress.phone}</p>
                                    <p className="text-muted-foreground">
                                        {defaultAddress.addressLine}, {defaultAddress.city}, {defaultAddress.province}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Đang tải địa chỉ...</p>
                            )}
                        </div>

                        <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                            <h4 className="font-medium mb-2">Sản phẩm được chọn:</h4>
                            {selectedItems.map(itemId => {
                                const item = getCurrentPageItems().find(i => i.id === itemId)
                                return item ? (
                                    <div key={itemId} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">Giá: {item.product?.realSellingPrice?.toLocaleString('vi-VN')}₫</p>
                                        </div>
                                    </div>
                                ) : null
                            })}
                        </div>

                        <div className="p-4 rounded-lg border">
                            {shippingData && shippingData.length > 0 ? (
                                <div className="space-y-3">
                                    {shippingData.map((shipment, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div>
                                                <span className="font-medium"><strong>Sản phẩm thuộc:</strong> {shipment.sellerCompanyName}</span>
                                                <p className="">
                                                    <strong>Dự kiến giao hàng:</strong> {new Date(shipment.ghnPreviewResponse.expectedDeliveryTime).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2 flex justify-between items-center">
                                        <span className="font-bold">Tổng phí vận chuyển:</span>
                                        <span className="text-xl font-bold text-[#d02a2a]">
                                            {shippingData.reduce((total, shipment) => total + shipment.ghnPreviewResponse.totalFee, 0).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Phí vận chuyển dự kiến:</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {isPreviewLoading ? 'Đang tính...' : 'Chưa có dữ liệu'}
                                    </span>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Phí có thể thay đổi tùy theo khu vực giao hàng
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowShippingDialog(false)} disabled={isRequestLoading}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleRequestShipping}
                            disabled={isRequestLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isRequestLoading ? 'Đang xử lý...' : 'Xác nhận giao hàng'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showPrizeDialog} onOpenChange={setShowPrizeDialog}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Phần thưởng từ {selectedPrize?.blindBoxName}</DialogTitle>
                    </DialogHeader>

                    {loadingPrize ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-sm text-muted-foreground">Đang tải thông tin phần thưởng...</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Phần thưởng bạn đã nhận được từ blindbox này:
                            </div>

                            {wonItem ? (
                                <Card className="border">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-48 aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={
                                                        wonItem.product?.imageUrls?.[0] || '/images/item1.png'
                                                    }
                                                    alt={wonItem.product?.name || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2">
                                                        {wonItem.product?.name || 'Sản phẩm'}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        {wonItem.product?.description || 'Không có mô tả'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Giá trị:</span>
                                                        <span className="text-green-600">
                                                            {wonItem.product?.realSellingPrice ?
                                                                `${wonItem.product.realSellingPrice.toLocaleString('vi-VN')}đ` :
                                                                'Chưa có giá'
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Chiều cao:</span>
                                                        <span>
                                                            {wonItem.product?.height ?
                                                                `${wonItem.product.height} cm` :
                                                                'Chưa có thông tin'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Chất liệu:</span>
                                                        <span>
                                                            {wonItem.product?.material || 'Chưa có thông tin'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <Button
                                                        className="w-1/2 border border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition"
                                                        onClick={() => handleExchangeItem(wonItem?.product?.id)}
                                                    >
                                                        Đổi hàng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không tìm thấy thông tin phần thưởng
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Backdrop open={isLoading || isItemLoading || isBlindboxLoading || isUnboxing} />
        </div >
    )
}