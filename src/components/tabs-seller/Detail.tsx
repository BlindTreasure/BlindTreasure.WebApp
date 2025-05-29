'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'; 
import { useState } from 'react';

export default function Detail() {
    const [formData, setFormData] = useState({
        brand: '',
        manufacturerAddress: '',
        size: '',
        material: '',
        packaging: '',
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="manufacturerAddress">Địa chỉ tổ chức chịu trách nhiệm sản xuất</Label>
                    <Input
                        id="manufacturerAddress"
                        value={formData.manufacturerAddress}
                        onChange={(e) => setFormData({ ...formData, manufacturerAddress: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="size">Kích cỡ sản phẩm</Label>
                    <Select
                        value={formData.size}
                        onValueChange={(value) => setFormData({ ...formData, size: value })}
                    >
                        <SelectTrigger id="size" className="w-full">
                            <SelectValue placeholder="Chọn kích cỡ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="small">Nhỏ</SelectItem>
                            <SelectItem value="medium">Trung bình</SelectItem>
                            <SelectItem value="large">Lớn</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu sản phẩm</Label>
                    <Select
                        value={formData.material}
                        onValueChange={(value) => setFormData({ ...formData, material: value })}
                    >
                        <SelectTrigger id="material" className="w-full">
                            <SelectValue placeholder="Chọn chất liệu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="polyester">Polyester</SelectItem>
                            <SelectItem value="leather">Da</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="packaging">Bao bì đóng gói</Label>
                    <Select
                        value={formData.packaging}
                        onValueChange={(value) => setFormData({ ...formData, packaging: value })}
                    >
                        <SelectTrigger id="packaging" className="w-full">
                            <SelectValue placeholder="Chọn bao bì" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="box">Hộp giấy</SelectItem>
                            <SelectItem value="plastic">Túi nhựa</SelectItem>
                            <SelectItem value="bag">Túi vải</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
