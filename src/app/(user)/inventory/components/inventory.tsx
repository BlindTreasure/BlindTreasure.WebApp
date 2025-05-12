'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InventoryTabs } from '@/components/inventory-tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function Inventory() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const inventoryItems = [
        { id: 1, name: 'DODO Nami Twinkle Bunny', status: 'opened', image: '/images/blindbox1.webp', type: 'blindbox' },
        { id: 2, name: 'MEGA SPACE MOLLY 400%', status: 'unopened', image: '/images/blindbox_2.jpg', type: 'blindbox' },
        { id: 3, name: 'DIMOO WORLD TOUR SERIES', status: 'opened', image: '/images/blindbox_3.jpg', type: 'blindbox' },
        { id: 4, name: 'SKULLPANDA THE CRYSTAL BALL', status: 'unopened', image: '/images/blindbox_4.webp', type: 'blindbox' },
        { id: 5, name: 'MOLLY EARTH CANDY', status: 'opened', image: '/images/blindbox1.webp', type: 'blindbox' },
        { id: 6, name: 'LABUBU FRUITS SERIES', status: 'unopened', image: '/images/blindbox_2.jpg', type: 'blindbox' },
        { id: 7, name: 'PUCKY BEAUTY STREET', status: 'opened', image: '/images/blindbox_3.jpg', type: 'blindbox' },
        { id: 8, name: 'YUKI THE POLAR BEAR', status: 'unopened', image: '/images/blindbox_4.webp', type: 'blindbox' },
        { id: 9, name: 'BUNNY ANGEL SERIES', status: 'opened', image: '/images/blindbox1.webp', type: 'blindbox' },
        { id: 10, name: 'HIRONO SMALL LIE', status: 'unopened', image: '/images/blindbox_2.jpg', type: 'blindbox' },
        { id: 11, name: 'THE MONSTERS SMLIS', status: 'opened', image: '/images/blindbox_3.jpg', type: 'blindbox' },
        { id: 19, name: 'CRYBABY MOONLIGHT', status: 'unopened', image: '/images/blindbox_4.webp', type: 'blindbox' },
    ]

    const filteredItems = activeTab === 'all'
        ? inventoryItems
        : inventoryItems.filter(item => item.status === activeTab)

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

    const handleViewDetail = (productId: number) => {
        router.push(`/detail/${productId}`)
    }

    const handleOpenBox = (productId: number) => {
        console.log(`Opening box for product ${productId}`)
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 md:px-9">
                {paginatedItems.map((item) => (
                    <Card key={item.id} className="transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="p-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent className="pt-4">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className={`mt-2 ${item.status === 'opened' ? 'text-green-500' : 'text-yellow-500'
                                }`}>
                                {item.status === 'opened' ? 'Đã mở' : 'Chưa mở'}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleViewDetail(item.id)}
                                className="flex-1 bg-[#252424] text-white"
                            >
                                Xem chi tiết
                            </Button>

                            {item.status === 'unopened' && (
                                <Button
                                    onClick={() => handleOpenBox(item.id)}
                                    className="flex-1 bg-[#EF1104] hover:bg-[#c50e04]"
                                >
                                    Mở hộp
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(currentPage - 1)
                                    }}
                                    isActive={currentPage > 1}
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handlePageChange(pageNum)
                                            }}
                                            isActive={pageNum === currentPage}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(currentPage + 1)
                                    }}
                                    isActive={currentPage < totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}