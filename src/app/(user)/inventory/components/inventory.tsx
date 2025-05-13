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
        { id: 1, title: 'Hello', status: 'opened', image: '/images/blindbox1.webp', type: 'blindbox' },
        { id: 2, title: 'MEGA SPACE MOLLY 400...', status: 'unopened', image: '/images/blindbox_2.jpg', type: 'blindbox' },
        { id: 3, title: 'MEGA SPACE MOLLY 400...', status: 'opened', image: '/images/blindbox_3.jpg', type: 'blindbox' },
        { id: 4, title: 'MEGA SPACE MOLLY 400...', status: 'unopened', image: '/images/blindbox_4.webp', type: 'blindbox' },
        { id: 5, title: 'MEGA SPACE MOLLY 400...', status: 'opened', image: '/images/blindbox1.webp', type: 'blindbox' },
        { id: 6, title: 'MEGA SPACE MOLLY 400...', status: 'unopened', image: '/images/blindbox_2.jpg', type: 'blindbox' },
        { id: 7, title: 'MEGA SPACE MOLLY 400...', status: 'opened', image: '/images/blindbox_3.jpg', type: 'blindbox' },
        { id: 8, title: 'MEGA SPACE MOLLY 400...', status: 'unopened', image: '/images/blindbox_4.webp', type: 'blindbox' },
        { id: 9, title: 'MEGA SPACE MOLLY 400...', status: 'opened', image: '/images/blindbox1.webp', type: 'blindbox' },
        { id: 10, title: 'MEGA SPACE MOLLY 400...', status: 'unopened', image: '/images/blindbox_2.jpg', type: 'blindbox' },
        { id: 11, title: 'MEGA SPACE MOLLY 400...', status: 'opened', image: '/images/blindbox_3.jpg', type: 'blindbox' },
        { id: 12, title: 'CRYBABY MOONLIGHT', status: 'unopened', image: '/images/blindbox_4.webp', type: 'blindbox' },
        { id: 13, title: 'Bình nước siêu cute', image: '/images/blindbox_4.webp', type: 'sale' },
        { id: 14, title: 'Móc khóa dễ thương', image: '/images/blindbox_4.webp', type: 'new' },
    ]

    const filteredItems = inventoryItems.filter(item => {
        if (activeTab === 'all') {
            return ['blindbox', 'sale', 'new'].includes(item.type)
        }
        return item.type === 'blindbox' && item.status === activeTab
    })

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

    const handleViewDetail = (id: number) => {
        router.push(`/detail/${id}`)
    }

    const handleOpenBox = (id: number) => {
        console.log(`Opening box for product ${id}`)
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
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent className="pt-4">
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            {item.type === 'blindbox' && (
                                <CardDescription className={`mt-2 ${item.status === 'opened' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {item.status === 'opened' ? 'Đã mở' : 'Chưa mở'}
                                </CardDescription>
                            )}
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