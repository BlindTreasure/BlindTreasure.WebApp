'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { InventoryTabs } from '@/components/inventory-tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useGetAllOrder from '../../purchased/hooks/useGetOrderByCustomer'
import { OrderResponse } from '@/services/order/typings'
import { PaymentStatus } from '@/const/products'
import { Backdrop } from '@/components/backdrop'

interface InventoryItem {
    id: string
    title: string
    image: string
    status: 'unopened' | 'opened' | null
    type: 'blindbox' | 'regular'
    orderId: string
}

export default function Inventory() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const { getAllOrderApi } = useGetAllOrder()
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await getAllOrderApi()
            if (res?.value.data) {
                const paidOrders = res.value.data.filter(
                    (order) => order.status === PaymentStatus.PAID
                )

                setOrders(paidOrders)

                const allItems: InventoryItem[] = paidOrders.flatMap((order) =>
                    order.details.map((detail) => {
                        const isBlindbox = !!detail.blindBoxId
                        const isUnopened = ['SHIPPING', 'DELIVERED'].includes(detail.status)

                        const id = detail.blindBoxId ?? detail.productId ?? `${order.id}-${detail.productName}`

                        return {
                            id,
                            title: detail.blindBoxName ?? detail.productName,
                            image: detail.blindBoxImage ?? detail.productImages?.[0] ?? '',
                            status: isBlindbox
                                ? (isUnopened ? 'unopened' : 'opened') as 'opened' | 'unopened'
                                : null,
                            type: (isBlindbox ? 'blindbox' : 'regular') as 'blindbox' | 'regular',
                            orderId: order.id,
                        }
                    })
                ).filter(item => item.id)
                setInventoryItems(allItems)
            }
        }

        fetchOrders()
    }, [])


    const filteredItems = inventoryItems.filter(item => {
        if (activeTab === 'all') return true
        if (activeTab === 'opened') return item.type === 'blindbox' && item.status === 'opened'
        if (activeTab === 'unopened') return item.type === 'blindbox' && item.status === 'unopened'
        return false
    })

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

    const handleViewDetail = (id: string, type: 'blindbox' | 'regular') => {
        setIsLoading(true);
        const route = type === 'blindbox' ? `/detail-blindbox/${id}` : `/detail/${id}`;
        router.push(route);
    };

    const handleOpenBox = (id: string) => {
        console.log(`Opening box for product ${id}`)
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
                    <Card key={`${item.orderId}-${item.id}`} className="transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="p-0">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent className="pt-4">
                            <CardTitle className="truncate text-lg">{item.title}</CardTitle>
                            {item.type === 'blindbox' && item.status && (
                                <CardDescription className={`mt-2 ${item.status === 'opened' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {item.status === 'opened' ? 'Đã mở' : 'Chưa mở'}
                                </CardDescription>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleViewDetail(item.id, item.type)}
                                className="flex-1 bg-[#252424] text-white"
                            >
                                Xem chi tiết
                            </Button>


                            {item.status === 'unopened' && (
                                <Link href="/openbox">
                                    <Button
                                        onClick={() => handleOpenBox(item.id)}
                                        className="flex-1 bg-[#EF1104] hover:bg-[#c50e04]"
                                    >
                                        Mở hộp
                                    </Button>
                                </Link>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Backdrop open={isLoading} />
        </div>
    )
}
