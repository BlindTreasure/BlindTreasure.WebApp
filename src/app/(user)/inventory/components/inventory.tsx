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
import Link from 'next/link'
import { Backdrop } from '@/components/backdrop'
import Pagination from '@/components/pagination'
import useGetAllBlindboxInventory from '../hooks/useGetBlindboxInventory'
import useGetAllItemInventory from '../hooks/useGetItemInventory'
import QuickViewDialog from '@/components/alldialog/dialogquickly'
import { Product } from '@/services/inventory-item/typings'
import { BlindBox, CustomerInventory } from '@/services/customer-blindboxes/typings'
import { InventoryItem as ItemInventoryType } from '@/services/inventory-item/typings'
import useGetAllAddress from '../../address-list/hooks/useGetAllAddress'

interface InventoryItem {
    id: string
    title: string
    image: string
    status: 'unopened' | 'opened' | null
    type: 'blindbox' | 'product'
    orderId?: string
    blindBoxId?: string
    productId?: string
    product?: Product
    blindbox?: BlindBox
    quantity?: number 
    createdAt?: string 
}

export default function Inventory() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [blindboxFilter, setBlindboxFilter] = useState<'all' | 'opened' | 'unopened'>('all')
    const [allTabData, setAllTabData] = useState<InventoryItem[]>([])
    const { getAllAddressApi, defaultAddress } = useGetAllAddress()
    const [showAddressDialog, setShowAddressDialog] = useState(false)

    const PAGE_SIZE = 8
    const [pendingDeliveryId, setPendingDeliveryId] = useState<string | null>(null)

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
                    const pageIndex = currentPage - 1;
                    const paginationParams = {
                        pageIndex,
                        pageSize: PAGE_SIZE,
                        isOpened: blindboxFilter === 'all' ? undefined : blindboxFilter === 'opened'
                    };

                    const blindboxRes = await getAllBlindboxInventoryApi(paginationParams)
                    if (blindboxRes?.value.data?.result) {
                        const blindboxItems: InventoryItem[] = blindboxRes.value.data.result.map((item: CustomerInventory) => ({
                            id: item.id,
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
                    let dataToUse = allTabData;

                    if (allTabData.length === 0) {
                        const [itemRes, blindboxRes] = await Promise.all([
                            getAllItemInventoryApi({ pageIndex: 1, pageSize: 50 }),
                            getAllBlindboxInventoryApi({ pageIndex: 1, pageSize: 50 }),
                        ])

                        const itemItems: InventoryItem[] = itemRes?.value.data?.result?.map((item: ItemInventoryType) => ({
                            id: item.id,
                            productId: item.productId,
                            product: item.product,
                            title: item.product?.name || '',
                            image: item.product?.imageUrls?.[0] ?? '',
                            status: null,
                            type: 'product',
                            quantity: item.quantity,
                            createdAt: item.createdAt, 
                        })) ?? []

                        const blindboxItems: InventoryItem[] = blindboxRes?.value.data?.result?.map((item: CustomerInventory) => ({
                            id: item.id,
                            blindBoxId: item.blindBoxId,
                            blindbox: item.blindBox,
                            title: item.blindBox?.name || '',
                            image: item.blindBox?.imageUrl ?? '',
                            status: item.isOpened ? 'opened' : 'unopened',
                            type: 'blindbox',
                            orderId: item.orderDetailId,
                            createdAt: item.createdAt,
                        })) ?? []

                        const allItems = [...itemItems, ...blindboxItems]
                        const sortedItems = allItems.sort((a, b) => {
                            if (!a.createdAt || !b.createdAt) return 0;
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        });
                        setAllTabData(sortedItems)
                        dataToUse = sortedItems;
                        setTotalPages(Math.ceil(allItems.length / PAGE_SIZE))
                        setTotalCount(allItems.length)
                    } else {
                        setTotalPages(Math.ceil(allTabData.length / PAGE_SIZE))
                        setTotalCount(allTabData.length)
                    }
                    const startIndex = (currentPage - 1) * PAGE_SIZE
                    const pageItems = dataToUse.slice(startIndex, startIndex + PAGE_SIZE)
                    setInventoryItems(pageItems)
                }
            } catch (error) {
                console.error('Error fetching inventory:', error)
                setInventoryItems([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchInventory()
    }, [activeTab, currentPage, blindboxFilter])

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

    const handleOpenBox = (id: string) => {
        console.log(`Opening box for product ${id}`)
    }

    const handleDeliver = async (itemId: string) => {
        const res = await getAllAddressApi()
        const defaultAddr = res?.value.data.find(addr => addr.isDefault)

        if (!defaultAddr) {
            setPendingDeliveryId(itemId)
            setShowAddressDialog(true)
            return
        }

        console.log(`Giao hàng: ${itemId}`)
    }

    return (
        <div className="p-4 container mx-auto mt-32">
            <InventoryTabs
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab)
                    setCurrentPage(1)
                    if (tab !== 'all') {
                        setAllTabData([])
                    }
                }}
            />

            {activeTab === 'blindbox' && (
                <div className="flex gap-2 mt-4 mb-2 px-9">
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
                            : 'Hãy bắt đầu mua sắm để thêm sản phẩm vào kho của bạn!'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14 mt-6 md:px-9">
                    {getCurrentPageItems().map((item: InventoryItem) => (
                        <Card key={item.id} className="transition-all duration-300 transform hover:scale-105">
                            <CardHeader className='p-0'>
                                <div className="relative group w-full aspect-[3/2] overflow-hidden rounded-t-lg">
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
                                            onClick={() => handleDeliver(item.id)}
                                            className="flex-1 border border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition"
                                        >
                                            Giao hàng
                                        </Button>
                                        <Button
                                            onClick={() => console.log(`Bán lại: ${item.id}`)}
                                            className="flex-1 border border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition"
                                        >
                                            Bán lại
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 w-full">
                                        {item.type === 'product' && (
                                            <Button
                                                onClick={() => handleDeliver(item.id)}
                                                className="flex-1 border border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition"
                                            >
                                                Giao hàng
                                            </Button>
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
            )}

            {getCurrentPageItems().length > 0 && totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thiếu địa chỉ giao hàng</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground">
                        Bạn chưa thiết lập địa chỉ giao hàng mặc định. Vui lòng thêm địa chỉ để tiếp tục.
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
                            Đóng
                        </Button>
                        <Button asChild>
                            <Link href="/address-list">Thiết lập địa chỉ</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Backdrop open={isLoading || isItemLoading || isBlindboxLoading} />
        </div>
    )
}
