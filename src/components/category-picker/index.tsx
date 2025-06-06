import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import useCreateProductForm from "@/app/seller/create-product/hooks/useCreateProduct";

interface CategoryPickerProps {
  categories?: API.ResponseDataCategory;
  setValue: ReturnType<typeof useCreateProductForm>["setValue"];
  watch: ReturnType<typeof useCreateProductForm>["watch"];
}

export default function CategoryPicker({
  categories,
  setValue,
  watch,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const mainCats = categories?.result?.filter((c) => !c.parentId) || [];
  const getChildren = (parentId: string) =>
    categories?.result?.filter((c) => c.parentId === parentId) || [];

  const updateSelectedCats = (catId: string | null) => {
  if (!catId) {
    setSelectedMain(null);
    setSelectedSub(null);
    return;
  }
  const currentCat = categories?.result?.find(c => c.id === catId);
  if (!currentCat) {
    setSelectedMain(null);
    setSelectedSub(null);
    return;
  }
  if (!currentCat.parentId) {
    setSelectedMain(currentCat.id);
    setSelectedSub(null);
  } else {
    const parentCat = categories?.result?.find(c => c.id === currentCat.parentId);
    if (parentCat && !parentCat.parentId) {
      setSelectedMain(parentCat.id);
      setSelectedSub(currentCat.id);
    } else if (parentCat && parentCat.parentId) {
      const grandParentCat = categories?.result?.find(c => c.id === parentCat.parentId);
      setSelectedMain(grandParentCat?.id || null);
      setSelectedSub(parentCat.id);
    } else {
      setSelectedMain(null);
      setSelectedSub(null);
    }
  }
};

  const handleSelect = (catId: string) => {
  setValue("categoryId", catId, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  updateSelectedCats(catId);
  setOpen(false);
};

const categoryId = watch("categoryId");

useEffect(() => {
  if (categoryId) {
    updateSelectedCats(categoryId);
  }
}, [categoryId, categories]);

  const selectedCategoryName = useMemo(() => {
  const catId = watch("categoryId");
  if (!catId || !categories?.result?.length) return "Chọn danh mục";
  return categories.result.find((c) => c.id === catId)?.name || "Chọn danh mục";
}, [watch("categoryId"), categories]);

console.log("📦 categoryId:", watch("categoryId"));
console.log("📦 selectedCategoryName:", selectedCategoryName);
console.log("📦 categories:", categories?.result);

  return (
    <div className="space-y-2">
      <label className="block font-medium text-sm">
        Danh mục <span className="text-red-600">*</span>
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="border rounded px-4 py-2 w-full text-left">
          {selectedCategoryName}
        </PopoverTrigger>

        <PopoverContent className="w-full max-w-[650px] sm:w-[650px] h-[400px] border rounded shadow-md overflow-hidden">
          <div className="px-4 py-3">
            <h3 className="font-semibold text-gray-800">Chọn danh mục phù hợp</h3>
          </div>

          <div className="px-4 bg-white flex h-[calc(100%-60px)] flex-col sm:flex-row">
            <div className="flex-1 bg-gray-50 flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  {mainCats.map((main) => {
                    const hasChildren = getChildren(main.id).length > 0;
                    const isSelected = watch("categoryId") === main.id;
                    return (
                      <div
                        key={main.id}
                        onMouseEnter={() => {
                          setSelectedMain(main.id);
                          setSelectedSub(null);
                        }}
                        onClick={() => handleSelect(main.id)}
                        className={cn(
                          "flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-50",
                          isSelected && "bg-gray-100 font-semibold text-[#d02a2a]"
                        )}
                      >
                        <span className="text-sm">{main.name}</span>
                        {hasChildren && (
                          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  {selectedMain &&
                    getChildren(selectedMain).map((sub) => {
                      const hasChildren = getChildren(sub.id).length > 0;
                      const isSelected = watch("categoryId") === sub.id;
                      return (
                        <div
                          key={sub.id}
                          onMouseEnter={() => setSelectedSub(sub.id)}
                          onClick={() => handleSelect(sub.id)}
                          className={cn(
                            "flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-50",
                            isSelected && "bg-gray-100 font-semibold text-[#d02a2a]"
                          )}
                        >
                          <span className="text-sm">{sub.name}</span>
                          {hasChildren && (
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="w-full sm:w-1/3 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  {selectedSub &&
                    getChildren(selectedSub).map((subSub) => {
                      const isSelected = watch("categoryId") === subSub.id;
                      return (
                        <div
                          key={subSub.id}
                          onClick={() => handleSelect(subSub.id)}
                          className={cn(
                            "px-4 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-50",
                            isSelected && "bg-gray-100 font-semibold text-[#d02a2a]"
                          )}
                        >
                          <span className="text-sm">{subSub.name}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
