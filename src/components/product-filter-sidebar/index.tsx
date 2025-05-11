import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type SidebarProps = {
  categories: {
    name: string;
    subCategories?: string[];
  }[];
  prices: string[];
  brands: string[];
};

export default function ProductFilterSidebar({ categories, prices, brands }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      if (typeof window !== 'undefined') {
        setIsCollapsed(window.innerWidth < 1200 && window.innerWidth >= 1024);
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const FilterContent = ({ collapsed = false }) => (
    <div className={`space-y-5 text-[15px] leading-relaxed ${collapsed ? "px-2" : "p-4 md:p-0"}`}>
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">
          {collapsed ? "DM" : "Danh Mục"}
        </h3>
        {!collapsed ? (
          <Accordion type="multiple" className="space-y-1">
            {categories.map((cat, idx) =>
              cat.subCategories ? (
                <AccordionItem key={idx} value={`cat-${idx}`} className="border-none">
                  <AccordionTrigger className="text-left font-normal px-2 py-1 hover:text-[#d02a2a] transition-colors">
                    {cat.name}
                  </AccordionTrigger>
                  <AccordionContent className="pl-5 space-y-1">
                    {cat.subCategories.map((sub, subIdx) => (
                      <div
                        key={subIdx}
                        className="cursor-pointer hover:text-[#d02a2a] transition-colors"
                      >
                        {sub}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2 py-1 font-normal cursor-pointer hover:text-[#d02a2a] transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronDown className="w-4 h-4 opacity-0" />
                </div>
              )
            )}
          </Accordion>
        ) : (
          <div className="space-y-1">
            {categories.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="cursor-pointer hover:text-[#d02a2a] transition-colors">
                <Button variant="ghost" size="sm" className="w-full justify-start px-1 py-1 h-auto">
                  {cat.name.substring(0, 3)}...
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full justify-center p-1 h-auto">...</Button>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">
          {collapsed ? "₫" : "Giá (₫)"}
        </h3>
        {!collapsed ? (
          <RadioGroup className="space-y-2 pl-1">
            {prices.map((price, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={price} id={`price-${index}`} />
                <Label htmlFor={`price-${index}`} className="cursor-pointer">
                  {price}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="flex flex-col gap-1">
            <Button variant="outline" size="sm" className="w-full justify-center p-1 h-auto">
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">
          {collapsed ? "TH" : "Thương hiệu"}
        </h3>
        {!collapsed ? (
          <div className="space-y-2 pl-1">
            {brands.map((brand, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <Checkbox id={`brand-${index}`} />
                <Label htmlFor={`brand-${index}`} className="cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Button variant="outline" size="sm" className="w-full justify-center p-1 h-auto">
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {collapsed && (
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              setIsOpen(true);
              setIsCollapsed(false);
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter button - for small screens */}
      <div className="lg:hidden w-full mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Lọc sản phẩm</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center justify-between">
                <span>Bộ lọc</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mini-sidebar for medium screens (1024-1200px) */}
      <div className={`hidden lg:block xl:hidden sticky top-24 ${isCollapsed ? "w-14" : "w-56"} transition-all duration-300`}>
        {isCollapsed ? (
          <FilterContent collapsed={true} />
        ) : (
          <div className="bg-white border rounded-md p-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#d02a2a] font-semibold">Bộ lọc</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsCollapsed(true)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterContent />
          </div>
        )}
      </div>

      {/* Large desktop sidebar */}
      <div className="hidden xl:block sticky top-24">
        <FilterContent />
      </div>
    </>
  );
}