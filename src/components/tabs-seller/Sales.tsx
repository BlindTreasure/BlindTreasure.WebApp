'use client';

import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";
type DiscountRow = {
    from: number | '';
    to: number | '';
    price: number | '';
};

export default function Sales() {
    const [productType, setProductType] = useState<'new' | 'sale' | 'blindbox'>('new');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [probability, setProbability] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [maxBuy, setMaxBuy] = useState<'unlimited' | 'custom'>('unlimited');
    const [maxBuyQuantity, setMaxBuyQuantity] = useState('');
    const [discountRows, setDiscountRows] = useState<DiscountRow[]>([]);

    function addDiscountRow() {
        setDiscountRows([...discountRows, { from: '', to: '', price: '' }]);
    }

    function removeDiscountRow(index: number) {
        setDiscountRows(discountRows.filter((_, i) => i !== index));
    }

    function updateDiscountRow(index: number, field: keyof DiscountRow, value: string | number) {
        const newRows = [...discountRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setDiscountRows(newRows);
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 w-[300px]">
                    <Label>Loại sản phẩm</Label>
                    <Select value={productType} onValueChange={(value) => setProductType(value as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Loại</SelectLabel>
                                <SelectItem value="new">Mới</SelectItem>
                                <SelectItem value="sale">Giảm giá</SelectItem>
                                <SelectItem value="blindbox">Blindbox</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {productType === 'new' && (
                    <div className="space-y-1 w-[300px]">
                        <Label>Giá</Label>
                        <Input
                            type="number"
                            value={price}
                            min={0}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá sản phẩm"
                        />
                    </div>
                )}

                {productType === 'sale' && (
                    <>
                        <div className="space-y-1 w-[300px]">
                            <Label>Giá gốc</Label>
                            <Input
                                type="number"
                                min={0}
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                                placeholder="Nhập giá gốc"
                            />
                        </div>
                        <div className="space-y-1 w-[300px]">
                            <Label>Giá sale</Label>
                            <Input
                                type="number"
                                min={0}
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                placeholder="Nhập giá sale"
                            />
                        </div>
                    </>
                )}

                {productType === 'blindbox' && (
                    <>
                        <div className="space-y-1 w-[300px]">
                            <Label>Giá</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Nhập giá"
                            />
                        </div>

                        <div className="space-y-1 w-[300px]">
                            <Label>Xác suất trúng (%)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={probability}
                                onChange={(e) => setProbability(e.target.value)}
                                placeholder="Nhập xác suất trúng"
                            />
                        </div>
                    </>
                )}
             
                <div className="space-y-1 w-[300px]">
                    <Label>Số lượng kho</Label>
                    <Input
                        type="number"
                        min={0}
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        placeholder="Nhập số lượng kho"
                    />
                </div>

                <div className="space-y-1 w-[300px]">
                    <Label>Số lượng mua tối đa</Label>
                    <Select value={maxBuy} onValueChange={(value) => setMaxBuy(value as any)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn số lượng mua tối đa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn</SelectLabel>
                                <SelectItem value="unlimited">Không giới hạn</SelectItem>
                                <SelectItem value="custom">Số lượng trên mỗi đơn hàng</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {maxBuy === 'custom' && (
                        <Input
                            type="number"
                            min={1}
                            value={maxBuyQuantity}
                            onChange={(e) => setMaxBuyQuantity(e.target.value)}
                            placeholder="Nhập số lượng mua tối đa"
                            className="mt-2"
                        />
                    )}
                </div>

                {(productType === 'sale' || productType === 'new' || productType === 'blindbox') && (
                    <div className="space-x-4">
                        <Label>Mua nhiều giảm giá:</Label>

                        <Button
                            variant="outline" // để viền (mặc định là nét liền)
                            className="mb-3 border-dashed border-[#d02a2a] text-[#d02a2a] hover:bg-[#d02a2a]/10 gap-2"
                            onClick={addDiscountRow}
                        >
                            <Plus className="w-4 h-4 text-[#d02a2a]" />
                            <span className='text-[#d02a2a]'>Thêm khoảng giá</span>
                        </Button>

                        {discountRows.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Từ (sản phẩm)</TableHead>
                                        <TableHead>Đến (sản phẩm)</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discountRows.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={2} // HTML vẫn set min
                                                    value={row.from}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '') {
                                                            updateDiscountRow(idx, 'from', '');
                                                            return;
                                                        }
                                                        const newValue = Number(value);
                                                        if (newValue < 2) return;

                                                        updateDiscountRow(idx, 'from', newValue);
                                                    }}
                                                    placeholder="Từ"
                                                />

                                            </TableCell>

                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={typeof row.from === 'number' ? row.from + 1 : 1}
                                                    value={row.to}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value === '' ? '' : Number(e.target.value);
                                                        updateDiscountRow(idx, 'to', newValue);
                                                    }}
                                                    placeholder="Đến"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={row.price}
                                                    onChange={(e) =>
                                                        updateDiscountRow(idx, 'price', e.target.value === '' ? '' : Number(e.target.value))
                                                    }
                                                    placeholder="Đơn giá"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" onClick={() => removeDiscountRow(idx)}>
                                                    <RiDeleteBin6Line className='text-[#d02a2a]'/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
