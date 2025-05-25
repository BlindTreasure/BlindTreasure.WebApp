'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, Plus, EyeOff, X } from 'lucide-react';

const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
const RARITY_COLORS: Record<Rarity, string> = {
  Common: "bg-gray-500 text-white",
  Uncommon: "bg-green-500 text-white",
  Rare: "bg-blue-500 text-white",
  Epic: "bg-purple-500 text-white",
  Legendary: "bg-yellow-500 text-black",
};

export default function BlindBoxBasicInfoForm() {
  const [formData, setFormData] = useState({
    name: 'Mystery Box Series 1',
    price: 299000,
    totalQuantity: 1000,
    releaseDate: '2024-12-25T10:00',
    description: 'Hộp bí ẩn chứa các món đồ sưu tập hiếm với nhiều độ hiếm khác nhau.',
    imageUrl: 'https://example.com/blindbox-image.jpg',
    probabilityConfig: '{"algorithm": "weighted", "bonusMultiplier": 1.2}',
    hasSecretItem: true,
    secretProbability: 2.5,
    items: [
      {
        productId: 'PROD-001',
        quantity: 10,
        dropRate: 25,
        rarity: 'Rare',
        weight: 1.0,
        sku: 'SKU-001',
        isSecret: true,
        isActive: true,
      },
      {
        productId: 'PROD-002',
        quantity: 20,
        dropRate: 25,
        rarity: 'Common',
        weight: 1.0,
        sku: 'SKU-002',
        isSecret: false,
        isActive: true,
      },
      {
        productId: 'PROD-003',
        quantity: 30,
        dropRate: 25,
        rarity: 'Epic',
        weight: 1.5,
        sku: 'SKU-003',
        isSecret: false,
        isActive: true,
      },
    ],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setImagePreview(result);
          setFormData({ ...formData, imageUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleItemChange = (index: number, key: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [key]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    const newItem = {
      productId: '',
      quantity: 1,
      dropRate: 0,
      rarity: 'Common' as Rarity,
      weight: 1.0,
      sku: '',
      isSecret: false,
      isActive: true,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted BlindBox:', formData);
    alert('Dữ liệu BlindBox đã được log ra console!');
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Chọn ngày phát hành';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thông Tin Cơ Bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Sản Phẩm *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá Bán (VND) *</Label>
              <Input id="price" type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalQuantity">Tổng Số Lượng *</Label>
              <Input id="totalQuantity" type="number" value={formData.totalQuantity} onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Ngày Phát Hành</Label>
              <div className="relative">
                <div 
                  className="flex items-center justify-center w-full h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">{formatDisplayDate(formData.releaseDate)}</span>
                </div>
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-1 z-10 bg-background border border-input rounded-md shadow-lg">
                    <Input 
                      type="datetime-local" 
                      value={formData.releaseDate} 
                      onChange={(e) => {
                        setFormData({ ...formData, releaseDate: e.target.value });
                        setShowDatePicker(false);
                      }}
                      className="border-0 focus:ring-0"
                      autoFocus
                      onBlur={() => setTimeout(() => setShowDatePicker(false), 200)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea id="description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Hình Ảnh Sản Phẩm</Label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
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
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Chọn file ảnh (JPG, PNG, GIF...)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="probabilityConfig">Cấu Hình Xác Suất</Label>
              <Textarea id="probabilityConfig" rows={3} value={formData.probabilityConfig} onChange={(e) => setFormData({ ...formData, probabilityConfig: e.target.value })} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="hasSecretItem" checked={formData.hasSecretItem} onCheckedChange={(checked) => setFormData({ ...formData, hasSecretItem: checked })} />
                <Label htmlFor="hasSecretItem">Có Item Bí Mật</Label>
              </div>
              {formData.hasSecretItem && (
                <div className="space-y-2">
                  <Label htmlFor="secretProbability">Xác Suất Item Bí Mật (%)</Label>
                  <Input id="secretProbability" type="number" step="0.01" min="0" max="100" value={formData.secretProbability} onChange={(e) => setFormData({ ...formData, secretProbability: parseFloat(e.target.value) })} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Danh Sách Items</CardTitle>
            <div className="text-sm text-muted-foreground">
              Tổng tỷ lệ rơi:
              <Badge variant="destructive" className="ml-2">
                {formData.items.reduce((sum, item) => sum + item.dropRate, 0).toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.items.reduce((sum, item) => sum + item.dropRate, 0) !== 100 && (
            <Alert>
              <AlertDescription>
                Tổng tỷ lệ rơi phải bằng 100%. Hiện tại: {formData.items.reduce((sum, item) => sum + item.dropRate, 0).toFixed(2)}%
              </AlertDescription>
            </Alert>
          )}

          {formData.items.map((item, index) => (
            <div key={index} className="relative">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">Item #{index + 1}</CardTitle>
                    <Badge className={`${RARITY_COLORS[item.rarity as Rarity]} border-0`}>{item.rarity}</Badge>
                    {item.isSecret && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Bí mật</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Product ID *</Label>
                      <Input value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Số Lượng *</Label>
                      <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tỷ Lệ Rơi (%) *</Label>
                      <Input type="number" step="0.01" value={item.dropRate} onChange={(e) => handleItemChange(index, 'dropRate', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Độ Hiếm</Label>
                      <Select value={item.rarity} onValueChange={(value) => handleItemChange(index, 'rarity', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {RARITY_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Trọng Số</Label>
                      <Input type="number" step="0.01" value={item.weight} onChange={(e) => handleItemChange(index, 'weight', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input value={item.sku} onChange={(e) => handleItemChange(index, 'sku', e.target.value)} />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch checked={item.isSecret} onCheckedChange={(checked) => handleItemChange(index, 'isSecret', checked)} />
                      <Label className="flex items-center space-x-1">
                        <EyeOff className="w-4 h-4" />
                        <span>Item Bí Mật</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={item.isActive} onCheckedChange={(checked) => handleItemChange(index, 'isActive', checked)} />
                      <Label>Kích Hoạt</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <Button onClick={handleAddItem} variant="outline" className="w-full h-20 border-dashed border-2 hover:border-primary">
            <Plus className="w-5 h-5 mr-2" />
            Thêm Item Mới
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="mt-4">Lưu BlindBox</Button>
      </div>
    </div>
  );
}