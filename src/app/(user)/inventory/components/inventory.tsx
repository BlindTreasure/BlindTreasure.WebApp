'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { InventoryTabs } from '@/components/inventory-tabs'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { BlindBox } from '@/services/customer-inventory/typings'
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
}

export default function Inventory() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { getAllAddressApi, defaultAddress } = useGetAllAddress()
    const [showAddressDialog, setShowAddressDialog] = useState(false)
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

    const totalPages = Math.ceil(inventoryItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = inventoryItems.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        const fetchInventory = async () => {
            if (activeTab === 'blindbox') {
                const blindboxRes = await getAllBlindboxInventoryApi()
                if (blindboxRes?.value.data) {
                    const blindboxItems: InventoryItem[] = blindboxRes.value.data.map((item) => ({
                        id: item.id,
                        blindBoxId: item.blindBoxId,
                        blindbox: item.blindBox,
                        title: item.blindBox?.name,
                        image: item.blindBox?.imageUrl ?? '',
                        status: item.isOpened ? 'opened' : 'unopened',
                        type: 'blindbox',
                        orderId: item.orderDetailId,
                    }))
                    setInventoryItems(blindboxItems)
                }
                return
            }

            const [itemRes, blindboxRes] = await Promise.all([
                getAllItemInventoryApi(),
                getAllBlindboxInventoryApi(),
            ])

            const itemItems: InventoryItem[] = itemRes?.value.data?.map((item) => ({
                id: item.id,
                productId: item.productId,
                product: item.product,
                title: item.product.name,
                image: item.product.imageUrls?.[0] ?? '',
                status: null,
                type: 'product',
            })) ?? []
            const blindboxItems: InventoryItem[] = blindboxRes?.value.data?.map((item) => ({
                id: item.id,
                blindBoxId: item.blindBoxId,
                blindbox: item.blindBox,
                title: item.blindBox?.name,
                image: item.blindBox?.imageUrl ?? '',
                status: item.isOpened ? 'unopened' : 'opened',
                type: 'blindbox',
                orderId: item.orderDetailId,
            })) ?? []

            setInventoryItems([...itemItems, ...blindboxItems])
        }

        fetchInventory()
    }, [activeTab])

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
                }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14 mt-6 md:px-9">
                {paginatedItems.map((item) => (
                    <Card key={item.id} className="transition-all duration-300 transform hover:scale-105">
                        <CardHeader className='p-0'>
                            <div className="relative group w-full aspect-[3/2] overflow-hidden rounded-t-lg">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
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

            <div className="mt-8 flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

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
