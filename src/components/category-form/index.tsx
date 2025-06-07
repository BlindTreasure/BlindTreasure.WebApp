'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type CategoryOption = {
  id: string;
  name: string;
  parentId?: string;
  level?: number;
  children?: CategoryOption[];
};

type CategoryFormData = {
  name: string;
  description: string;
  parentId?: string | null;
  imageUrl?: File;
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
  // Safe destructuring với fallback
  const register = form?.register || (() => ({}));
  const handleSubmit = form?.handleSubmit || ((fn: any) => fn);
  const setValue = form?.setValue || (() => {});
  const errors = form?.formState?.errors || {};
  
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(initialData?.parentId || '');
  
  // ✅ State để lưu ảnh gốc khi update
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [hasOriginalImage, setHasOriginalImage] = useState(false);

  // Fetch categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Lưu ảnh gốc khi update mode
  useEffect(() => {
    if (mode === 'update' && initialData) {
      setValue('name', initialData.name || '');
      setValue('description', initialData.description || '');
      setValue('parentId', initialData.parentId || '');
      setSelectedParentId(initialData.parentId || '');
      
      // Lưu ảnh gốc
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
        // Filter categories chưa bị xóa
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

  // ✅ Function để loại bỏ category hiện tại và con cháu của nó
  const filterAvailableParents = (
    cats: CategoryOption[],
    currentCategoryId?: string
  ): CategoryOption[] => {
    if (!currentCategoryId || mode === 'create') return cats;

    const filterRecursive = (categories: CategoryOption[]): CategoryOption[] => {
      return categories
        .filter(cat => cat.id !== currentCategoryId) // Loại bỏ chính nó
        .map(cat => ({
          ...cat,
          children: cat.children ? filterRecursive(cat.children) : undefined
        }));
    };

    return filterRecursive(cats);
  };

  // Function để flatten categories thành list với level
  const flattenCategories = (
    cats: CategoryOption[],
    level = 0
  ): Array<{ id: string; name: string; level: number }> => {
    const result: Array<{ id: string; name: string; level: number }> = [];

    cats.forEach((cat) => {
      if (level <= 2) { // Giới hạn 3 cấp (0, 1, 2)
        result.push({ id: cat.id, name: cat.name, level });
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenCategories(cat.children, level + 1));
        }
      }
    });

    return result;
  };

  // ✅ Lọc categories có thể chọn làm parent
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
    // Reset input value
    const input = document.getElementById('imageUpload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleParentChange = (value: string) => {
    const previousParentId = selectedParentId;
    setSelectedParentId(value);
    setValue('parentId', value);
    
    // ✅ Logic xử lý ảnh thông minh
    if (value) {
      // Nếu chọn parent → ẩn ảnh và xóa ảnh đã chọn
      handleImageChange(undefined);
      const input = document.getElementById('imageUpload') as HTMLInputElement;
      if (input) input.value = '';
    } else {
      // ✅ Nếu bỏ chọn parent → khôi phục ảnh gốc nếu có
      if (mode === 'update' && hasOriginalImage && originalImageUrl) {
        // Khôi phục ảnh gốc
        setValue('imageUrl', originalImageUrl);
        // Gọi setPreviewImage nếu form có method này
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

  // Kiểm tra xem có phải là category con không
  const isChildCategory = selectedParentId && selectedParentId.trim() !== '';
  
  // ✅ Kiểm tra có nên hiển thị ảnh gốc không
  const shouldShowOriginalImage = mode === 'update' && !isChildCategory && hasOriginalImage && originalImageUrl;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {mode === 'create' ? 'Tạo Danh Mục Mới' : 'Cập Nhật Danh Mục'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hàng 1: Tên và Danh mục cha */}
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
                <p className="text-sm text-muted-foreground">
                  {mode === 'update' 
                    ? 'Chọn danh mục cha (không thể chọn chính nó)'
                    : 'Chọn danh mục cha (tối đa 3 cấp)'
                  }
                </p>
                {errors.parentId && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.parentId.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Hàng 2: Mô tả (full width) */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea 
                id="description" 
                rows={4}
                {...register('description')} 
                placeholder="Nhập mô tả cho danh mục..."
              />
              <p className="text-sm text-muted-foreground">
                Mô tả chi tiết về danh mục sản phẩm
              </p>
              {errors.description && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {errors.description.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Hàng 3: Hình ảnh */}
            {!isChildCategory ? (
              <div className="space-y-2">
                <Label>Hình Ảnh Danh Mục</Label>
                <div className="space-y-4">
                  {/* ✅ Hiển thị ảnh preview hoặc ảnh gốc */}
                  {previewImage || shouldShowOriginalImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={previewImage || originalImageUrl || ''} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                      <span className="text-sm">Chưa có ảnh</span>
                    </div>
                  )}
                  <div>
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Chọn file ảnh (JPG, PNG, GIF...)
                      {mode === 'update' && hasOriginalImage && (
                        <span className="text-blue-600 ml-2">
                          • Để trống nếu giữ ảnh cũ
                        </span>
                      )}
                    </p>
                  </div>
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
              /* Thông báo khi là category con */
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ghi chú:</strong> Danh mục con không cần hình ảnh. Chỉ danh mục gốc mới có thể upload hình ảnh.
                  {mode === 'update' && hasOriginalImage && (
                    <span className="block mt-2 text-amber-600">
                      <strong>Lưu ý:</strong> Nếu bỏ chọn danh mục cha, ảnh gốc sẽ được khôi phục.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
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