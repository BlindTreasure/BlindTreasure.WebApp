'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { Switch } from '../ui/switch';

export default function Delivery() {
    const [formData, setFormData] = useState({
        weight: '',
        length: '',
        width: '',
        height: '',
        shippingFeeCongKe: '',
        shippingFeeHoaToc: '',
        shippingFeeNhanh: '',
    });

    const [isEditingFeeCongKe, setIsEditingFeeCongKe] = useState(false);
    const [tempFeeCongKe, setTempFeeCongKe] = useState(formData.shippingFeeCongKe);

    const [isEditingFeeHoaToc, setIsEditingFeeHoaToc] = useState(false);
    const [tempFeeHoaToc, setTempFeeHoaToc] = useState(formData.shippingFeeHoaToc);

    const [isEditingFeeNhanh, setIsEditingFeeNhanh] = useState(false);
    const [tempFeeNhanh, setTempFeeNhanh] = useState(formData.shippingFeeNhanh);

    const [enabledCongKe, setEnabledCongKe] = useState(true);
    const [enabledHoaToc, setEnabledHoaToc] = useState(false);
    const [enabledNhanh, setEnabledNhanh] = useState(false);

    const handleSaveFee = (type: 'congke' | 'hoatoc' | 'nhanh') => {
        if (type === 'congke') {
            setFormData({ ...formData, shippingFeeCongKe: tempFeeCongKe });
            setIsEditingFeeCongKe(false);
        } else if (type === 'hoatoc') {
            setFormData({ ...formData, shippingFeeHoaToc: tempFeeHoaToc });
            setIsEditingFeeHoaToc(false);
        } else if (type === 'nhanh') {
            setFormData({ ...formData, shippingFeeNhanh: tempFeeNhanh });
            setIsEditingFeeNhanh(false);
        }
    };

    const handleCancelEdit = (type: 'congke' | 'hoatoc' | 'nhanh') => {
        if (type === 'congke') {
            setTempFeeCongKe(formData.shippingFeeCongKe);
            setIsEditingFeeCongKe(false);
        } else if (type === 'hoatoc') {
            setTempFeeHoaToc(formData.shippingFeeHoaToc);
            setIsEditingFeeHoaToc(false);
        } else if (type === 'nhanh') {
            setTempFeeNhanh(formData.shippingFeeNhanh);
            setIsEditingFeeNhanh(false);
        }
    };

    const renderShippingFeeRow = (
        label: string,
        enabled: boolean,
        setEnabled: (val: boolean) => void,
        feeValue: string,
        tempFee: string,
        setTempFee: (val: string) => void,
        isEditing: boolean,
        setIsEditing: (val: boolean) => void,
        onSave: () => void,
        onCancel: () => void
    ) => (
        <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2">
                <span className="font-medium">{label}</span>
                <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded">
                    BLINDTREASURE VẬN CHUYỂN
                </span>
            </div>

            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <Input
                            type="number"
                            value={tempFee}
                            onChange={(e) => setTempFee(e.target.value)}
                            className="w-24"
                        />
                        <button
                            onClick={onSave}
                            className="text-blue-500 text-sm"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 text-sm"
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <>
                        <span>
                            {feeValue
                                ? Number(feeValue).toLocaleString()
                                : 0}
                            ₫
                        </span>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-500 hover:text-black text-xl"
                        >
                            <CiEdit />
                        </button>
                    </>
                )}

                <div className="flex items-center space-x-2">
                    <Switch
                        checked={enabled}
                        onCheckedChange={setEnabled}
                        id={`switch-${label.toLowerCase().replace(/\s/g, '')}`}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="weight">Cân nặng (Sau khi đóng gói)</Label>
                    <div className="relative">
                        <Input
                            id="weight"
                            type="number"
                            min={0}
                            step="0.01"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            placeholder="Nhập cân nặng"
                            className="pr-12"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm pointer-events-none">
                            | gr
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Kích thước đóng gói</Label>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Input
                                id="length"
                                type="number"
                                min={0}
                                step="0.01"
                                value={formData.length}
                                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                placeholder="Dài"
                                className="pr-12"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm pointer-events-none">
                                | cm
                            </span>
                        </div>

                        <div className="relative">
                            <Input
                                id="width"
                                type="number"
                                min={0}
                                step="0.01"
                                value={formData.width}
                                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                placeholder="Rộng"
                                className="pr-12"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm pointer-events-none">
                                | cm
                            </span>
                        </div>

                        <div className="relative">
                            <Input
                                id="height"
                                type="number"
                                min={0}
                                step="0.01"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                placeholder="Cao"
                                className="pr-12"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm pointer-events-none">
                                | cm
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Phí vận chuyển</Label>
                    <div className="border p-4 rounded space-y-4">
                        {renderShippingFeeRow(
                            "Hàng Cồng Kềnh",
                            enabledCongKe,
                            setEnabledCongKe,
                            formData.shippingFeeCongKe,
                            tempFeeCongKe,
                            setTempFeeCongKe,
                            isEditingFeeCongKe,
                            setIsEditingFeeCongKe,
                            () => handleSaveFee('congke'),
                            () => handleCancelEdit('congke')
                        )}

                        {renderShippingFeeRow(
                            "Hỏa Tốc",
                            enabledHoaToc,
                            setEnabledHoaToc,
                            formData.shippingFeeHoaToc,
                            tempFeeHoaToc,
                            setTempFeeHoaToc,
                            isEditingFeeHoaToc,
                            setIsEditingFeeHoaToc,
                            () => handleSaveFee('hoatoc'),
                            () => handleCancelEdit('hoatoc')
                        )}

                        {renderShippingFeeRow(
                            "Nhanh",
                            enabledNhanh,
                            setEnabledNhanh,
                            formData.shippingFeeNhanh,
                            tempFeeNhanh,
                            setTempFeeNhanh,
                            isEditingFeeNhanh,
                            setIsEditingFeeNhanh,
                            () => handleSaveFee('nhanh'),
                            () => handleCancelEdit('nhanh')
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                            Cài đặt đơn vị vận chuyển ở đây chỉ áp dụng cho sản phẩm này.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
