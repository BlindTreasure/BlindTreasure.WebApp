'use client'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InventoryTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full md:px-9">
      <TabsList className="grid w-full grid-cols-2 h-14">
        <TabsTrigger value="all" className="h-12 text-[10px] md:text-lg">Tất cả sản phẩm</TabsTrigger>
        <TabsTrigger value="blindbox" className="h-12 text-[10px] md:text-lg">Blindbox</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}