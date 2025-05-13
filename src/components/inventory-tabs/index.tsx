'use client'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InventoryTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full md:px-9">
      <TabsList className="grid w-full grid-cols-3 h-14">
        <TabsTrigger value="all" className="h-12 text-[10px] md:text-lg">Tất cả sản phẩm</TabsTrigger>
        <TabsTrigger value="opened" className="h-12 text-[10px] md:text-lg">Sản phẩm đã mở</TabsTrigger>
        <TabsTrigger value="unopened" className="h-12 text-[10px] md:text-lg">Sản phẩm chưa mở</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}