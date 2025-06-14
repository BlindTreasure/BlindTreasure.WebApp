'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Info, Upload, Image } from 'lucide-react';
import { useEffect, useState } from 'react';

type CategoryOption = {
  id: string;
  name: string;
  parentId?: string;
  level?: number;
  children?: CategoryOption[];
};

interface CategoryFormProps {
  form: any;
  onSubmit: (data: any) => void;
  previewImage?: string | null;
  handleImageChange: (file?: File) => void;
  getCategoryApi: (params: { pageIndex: number; pageSize: number }) => Promise<any>;
  isSubmitting: boolean;
  mode: 'create' | 'update';
  initialData?: any;
  onCancel?: () => void;
  getCategoryByIdApi?: (params: string) => Promise<any>;
}

export default function CategoryForm({
  form,
  onSubmit,
  previewImage,
  handleImageChange,
  getCategoryApi,
  isSubmitting,
  mode,
  initialData,
  onCancel
}: CategoryFormProps) {
  const register = form?.register || (() => ({}));
  const handleSubmit = form?.handleSubmit || ((fn: any) => fn);
  const setValue = form?.setValue || (() => {});
  const errors = form?.formState?.errors || {};

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(initialData?.parentId || '');
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [hasOriginalImage, setHasOriginalImage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === 'update' && initialData) {
      setValue('name', initialData.name || '');
      setValue('description', initialData.description || '');
      setValue('parentId', initialData.parentId || '');
      setSelectedParentId(initialData.parentId || '');

      if (initialData.imageUrl) {
        setOriginalImageUrl(initialData.imageUrl);
        setHasOriginalImage(true);
      }
    }
  }, [mode, initialData?.id]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await getCategoryApi({
        pageIndex: 1,
        pageSize: 1000,
      });

      if (response?.value?.data?.result) {
        const activeCategories = response.value.data.result.filter(
          (cat: any) => cat.isDeleted === false
        );
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const filterAvailableParents = (
    cats: CategoryOption[],
    currentCategoryId?: string
  ): CategoryOption[] => {
    if (!currentCategoryId || mode === 'create') return cats;

    const filterRecursive = (categories: CategoryOption[]): CategoryOption[] => {
      return categories
        .filter(cat => cat.id !== currentCategoryId)
        .map(cat => ({
          ...cat,
          children: cat.children ? filterRecursive(cat.children) : undefined
        }));
    };

    return filterRecursive(cats);
  };

  const flattenCategories = (
    cats: CategoryOption[],
    level = 0
  ): Array<{ id: string; name: string; level: number }> => {
    const result: Array<{ id: string; name: string; level: number }> = [];

    cats.forEach((cat) => {
      if (level <= 2) {
        result.push({ id: cat.id, name: cat.name, level });
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenCategories(cat.children, level + 1));
        }
      }
    });

    return result;
  };

  const availableParentCategories = filterAvailableParents(categories, initialData?.id);
  const flatCategories = flattenCategories(availableParentCategories);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const removeImage = () => {
    handleImageChange(undefined);
    const input = document.getElementById('imageUpload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleParentChange = (value: string) => {
    setSelectedParentId(value);
    setValue('parentId', value);

    if (value) {
      handleImageChange(undefined);
      const input = document.getElementById('imageUpload') as HTMLInputElement;
      if (input) input.value = '';
    } else {
      if (mode === 'update' && hasOriginalImage && originalImageUrl) {
        setValue('imageUrl', originalImageUrl);
        if (form?.setPreviewImage) {
          form.setPreviewImage(originalImageUrl);
        }
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  const isChildCategory = selectedParentId && selectedParentId.trim() !== '';
  
  // Logic để xác định khi nào hiển thị nút X
  // Chỉ hiển thị nút X khi có ảnh mới được chọn (previewImage khác với originalImageUrl)
  const shouldShowRemoveButton = previewImage && previewImage !== originalImageUrl;
  
  // Logic để xác định ảnh nào sẽ được hiển thị
  const displayImage = previewImage || (mode === 'update' && !isChildCategory && originalImageUrl);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {mode === 'create' ? 'Tạo Danh Mục Mới' : 'Cập Nhật Danh Mục'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Danh Mục *</Label>
                <Input 
                  id="name" 
                  {...register('name')} 
                  placeholder="Nhập tên danh mục"
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.name.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Danh Mục Cha</Label>
                <select
                  value={selectedParentId}
                  onChange={(e) => handleParentChange(e.target.value)}
                  disabled={isLoadingCategories}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingCategories ? 'Đang tải...' : '-- Không có danh mục cha --'}
                  </option>
                  {flatCategories.map((cat) => (
                    <option 
                      key={cat.id} 
                      value={cat.id}
                      style={{ fontWeight: cat.level === 0 ? 'bold' : 'normal' }}
                    >
                      {'—'.repeat(cat.level)} {cat.name}
                    </option>
                  ))}
                </select>
                {errors.parentId && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.parentId.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea 
                id="description" 
                rows={4}
                {...register('description')} 
                placeholder="Nhập mô tả cho danh mục..."
              />
              {errors.description && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {errors.description.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {!isChildCategory ? (
              <div className="space-y-2">
                <Label>Hình Ảnh Danh Mục</Label>
                <div className="space-y-4">
                  {/* Preview Image */}
                  {displayImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={displayImage} 
                        alt="Preview" 
                        className="w-40 h-40 object-cover rounded-lg border shadow-sm"
                      />
                      {shouldShowRemoveButton && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                          title="Xóa ảnh"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                      <Image className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm text-center">Chưa có ảnh</span>
                    </div>
                  )}

                  {/* File Input with Custom Styling */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <label 
                        htmlFor="imageUpload" 
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Chọn tệp
                      </label>
                    </div>
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* File Format Info */}
                  <p className="text-sm text-gray-500">
                    Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                  </p>
                </div>
                {errors.imageUrl && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.imageUrl.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ghi chú:</strong> Danh mục con không cần hình ảnh. Chỉ danh mục gốc mới có thể upload hình ảnh.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isLoadingCategories}
          >
            {isSubmitting 
              ? (mode === 'create' ? "Đang tạo..." : "Đang cập nhật...")
              : (mode === 'create' ? "Tạo Danh Mục" : "Cập Nhật Danh Mục")
            }
          </Button>
        </div>
      </form>
    </div>
  );
}