import { useState } from "react";
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
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type SidebarProps = {
  categories?: API.ResponseDataCategory;
  prices: string[];
  brands: string[];
};

export default function ProductFilterSidebar({ categories, prices, brands }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const FilterContent = ({ isCompact = false }: { isCompact?: boolean }) => (
    <div
      className={`space-y-5 text-[15px] leading-relaxed ${isCompact ? "p-2" : "p-4"
        }`}
    >
      {/* Danh Mục */}
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">Danh Mục</h3>
        <Accordion type="multiple" className="space-y-1">
          {categories?.result
            .filter((cat) => !cat.parentId) 
            .map((parentCat) => {
              const hasChildren = parentCat.children && parentCat.children.length > 0;

              return hasChildren ? (
                <AccordionItem key={parentCat.id} value={`cat-${parentCat.id}`} className="border-none">
                  <AccordionTrigger className="text-left font-normal px-2 py-1 hover:text-[#d02a2a] transition-colors">
                    {parentCat.name}
                  </AccordionTrigger>
                  <AccordionContent className="pl-5 space-y-1">
                    {parentCat.children.map((childCat) => (
                      <div
                        key={childCat.id}
                        className="cursor-pointer hover:text-[#d02a2a] transition-colors"
                      >
                        {childCat.name}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div
                  key={parentCat.id}
                  className="px-2 py-1 cursor-pointer hover:text-[#d02a2a] transition-colors"
                >
                  {parentCat.name}
                </div>
              );
            })}
        </Accordion>
      </div>

      <Separator />

      {/* Giá */}
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">Giá (₫)</h3>
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
      </div>

      <Separator />

      {/* Thương hiệu */}
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">Thương hiệu</h3>
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
      </div>
    </div>
  );

  return (
    <div>
      {/* Filter Sheet - chỉ hiện ở dưới lg */}
      <div className="block lg:hidden w-full mt-20">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Lọc sản phẩm</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-[85%] sm:w-[350px] p-0 z-[100]">
            <div className="h-full overflow-y-auto pt-[80px] px-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Bộ lọc</h2>
              </div>
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar cố định ở lg trở lên */}
      <div className="hidden lg:block sticky top-24">
        <FilterContent isCompact />
      </div>
    </div>
  );
}
