import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterState } from "@/stores/filter-product-slice";

// Define proper interfaces for better type safety
interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

interface CategoriesResponse {
  result: Category[];
}

type SidebarProps = {
  categories?: CategoriesResponse;
  prices: string[];
  releaseDateRanges: string[];
  filters: FilterState;
  onCategoryFilter: (categoryId: string) => void;
  onPriceFilter: (priceRange: string) => void;
  onReleaseDateFilter: (dateRange: string) => void;
  onClearFilters: () => void;
};

export default function ProductFilterSidebar({ 
  categories, 
  prices, 
  releaseDateRanges, 
  filters,
  onCategoryFilter,
  onPriceFilter,
  onReleaseDateFilter,
  onClearFilters
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Helper function to find category by ID
  const findCategoryById = (id: string): Category | undefined => {
    if (!categories?.result) return undefined;
    
    const findInArray = (arr: Category[]): Category | undefined => {
      for (const cat of arr) {
        if (cat.id === id) return cat;
        if (cat.children && cat.children.length > 0) {
          const found = findInArray(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findInArray(categories.result);
  };

  // Auto-expand categories when filters change or component mounts
  useEffect(() => {
    if (filters.categoryId && categories?.result) {
      const selectedCategory = findCategoryById(filters.categoryId);
      
      if (selectedCategory) {
        // If selected category is a parent category with children, expand it
        if (selectedCategory.children && selectedCategory.children.length > 0) {
          setExpandedCategories([selectedCategory.id]);
        }
        // If selected category is a child category, expand its parent
        else if (selectedCategory.parentId) {
          const parentCategory = findCategoryById(selectedCategory.parentId);
          if (parentCategory && parentCategory.children && parentCategory.children.length > 0) {
            setExpandedCategories([parentCategory.id]);
          }
        }
      }
    } else {
      // If no category is selected, collapse all
      setExpandedCategories([]);
    }
  }, [filters.categoryId, categories]);
  
  // Helper function to get current price range string
  const getCurrentPriceRange = (): string => {
    const { minPrice, maxPrice } = filters;
    
    // Check each specific case
    if (minPrice === undefined && maxPrice === 200000) return "Dưới 200.000₫";
    if (minPrice === 200000 && maxPrice === 500000) return "200.000 - 500.000₫";
    if (minPrice === 500000 && maxPrice === 1000000) return "500.000 - 1.000.000₫";
    if (minPrice === 1000000 && maxPrice === 2000000) return "1.000.000 - 2.000.000₫";
    if (minPrice === 2000000 && maxPrice === 4000000) return "2.000.000 - 4.000.000₫";
    if (minPrice === 4000000 && maxPrice === undefined) return "Trên 4.000.000₫";
    
    // If no case matches, return empty string
    return "";
  };

  // Helper function to get current release date range string
  const getCurrentReleaseDateRange = (): string => {
    if (!filters.releaseDateFrom && !filters.releaseDateTo) return "";
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    if (filters.releaseDateFrom) {
      const fromDate = new Date(filters.releaseDateFrom);
      
      // Check if it's approximately 1 month ago (within 1 day tolerance)
      if (Math.abs(fromDate.getTime() - oneMonthAgo.getTime()) < 24 * 60 * 60 * 1000) {
        return "1 tháng qua";
      }
      // Check if it's approximately 3 months ago (within 1 week tolerance)
      if (Math.abs(fromDate.getTime() - threeMonthsAgo.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        return "3 tháng qua";
      }
      // Check if it's approximately 6 months ago (within 1 week tolerance)
      if (Math.abs(fromDate.getTime() - sixMonthsAgo.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        return "6 tháng qua";
      }
      // Check if it's approximately 1 year ago (within 1 month tolerance)
      if (Math.abs(fromDate.getTime() - oneYearAgo.getTime()) < 30 * 24 * 60 * 60 * 1000) {
        return "1 năm qua";
      }
    }
    
    if (filters.releaseDateTo) {
      const toDate = new Date(filters.releaseDateTo);
      // Check if toDate is approximately 1 year ago (meaning "older than 1 year")
      if (Math.abs(toDate.getTime() - oneYearAgo.getTime()) < 30 * 24 * 60 * 60 * 1000) {
        return "Trên 1 năm";
      }
    }
    
    return "";
  };

  const handleCategoryClick = (categoryId: string) => {
    // Check if this category is currently selected
    const isCurrentlySelected = filters.categoryId === categoryId;
    
    onCategoryFilter(categoryId);
    
    const category = findCategoryById(categoryId);
    if (category && category.children && category.children.length > 0) {
      if (isCurrentlySelected) {
        // If clicking on already selected category, collapse it
        setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
      } else {
        // If selecting new category with children, collapse all others and expand this one
        setExpandedCategories([categoryId]);
      }
    } else {
      // If selecting a category without children, collapse all expanded categories
      setExpandedCategories([]);
    }
  };

  const handlePriceChange = (priceRange: string) => {
    onPriceFilter(priceRange);
  };

  const handleReleaseDateChange = (dateRange: string) => {
    onReleaseDateFilter(dateRange);
  };

  const handleClearAll = () => {
    setExpandedCategories([]);
    onClearFilters();
  };

  // Count active filters
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.releaseDateFrom || filters.releaseDateTo) count++;
    return count;
  };
  
  const FilterContent = ({ isCompact = false }: { isCompact?: boolean }) => (
    <div
      className={`space-y-5 text-[15px] leading-relaxed ${isCompact ? "p-4" : "p-2"
        }`}
    >
      {/* Clear All Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#d02a2a]">Bộ lọc</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearAll}
          className="text-gray-500 hover:text-[#d02a2a]"
          disabled={getActiveFiltersCount() === 0}
        >
          <X className="h-4 w-4 mr-1" />
          Xóa tất cả
        </Button>
      </div>

      <Separator />

      {/* Danh Mục */}
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">Danh Mục</h3>
        <div className="space-y-1">
          {categories?.result
            ?.filter((cat) => !cat.parentId) 
            ?.map((parentCat) => {
              const hasChildren = parentCat.children && Array.isArray(parentCat.children) && parentCat.children.length > 0;
              const isParentSelected = filters.categoryId === parentCat.id;
              const isExpanded = expandedCategories.includes(parentCat.id);

              return (
                <div key={parentCat.id}>
                  {/* Parent Category - Click để select và auto expand nếu có children */}
                  <div
                    className={`cursor-pointer px-2 py-1 hover:text-[#d02a2a] transition-colors ${
                      isParentSelected ? 'text-[#d02a2a] font-semibold' : ''
                    }`}
                    onClick={() => handleCategoryClick(parentCat.id)}
                  >
                    {parentCat.name}
                  </div>
                  
                  {/* Children Categories - hiện khi expanded */}
                  {hasChildren && isExpanded && (
                    <div className="pl-6 space-y-1 mt-1">
                      {(parentCat.children || []).map((childCat) => {
                        const isChildSelected = filters.categoryId === childCat.id;
                        return (
                          <div
                            key={childCat.id}
                            className={`cursor-pointer px-2 py-1 hover:text-[#d02a2a] transition-colors ${
                              isChildSelected ? 'text-[#d02a2a] font-semibold' : ''
                            }`}
                            onClick={() => handleCategoryClick(childCat.id)}
                          >
                            {childCat.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <Separator />

      {/* Giá */}
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">Giá (₫)</h3>
        <RadioGroup 
          className="space-y-2 pl-1" 
          value={getCurrentPriceRange()}
          onValueChange={handlePriceChange}
        >
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

      {/* Ngày phát hành - RadioGroup để chỉ chọn 1 */}
      <div>
        <h3 className="text-[#d02a2a] font-semibold mb-2 text-base">Ngày phát hành</h3>
        <RadioGroup 
          className="space-y-2 pl-1" 
          value={getCurrentReleaseDateRange()}
          onValueChange={handleReleaseDateChange}
        >
          {releaseDateRanges.map((dateRange, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={dateRange} id={`date-${index}`} />
              <Label htmlFor={`date-${index}`} className="cursor-pointer">
                {dateRange}
              </Label>
            </div>
          ))}
        </RadioGroup>
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
              {getActiveFiltersCount() > 0 && (
                <span className="bg-[#d02a2a] text-white rounded-full px-2 py-0.5 text-xs">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-[85%] sm:w-[350px] p-0 z-[100]">
            <div className="h-full overflow-y-auto pt-[80px] px-4">
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