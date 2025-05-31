'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

export default function Difference() {
  const [preOrder, setPreOrder] = useState('no');
  const [status, setStatus] = useState('new');
  const [date, setDate] = useState<Date | undefined>();
  const [sku, setSku] = useState('');

  const statusOptions = [
    { value: 'new', label: 'Mới' },
    { value: 'used', label: 'Đã sử dụng' },
    { value: 'refurbished', label: 'Tân trang' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="block">Hàng Đặt Trước</Label>
        <RadioGroup
          defaultValue="no"
          value={preOrder}
          onValueChange={setPreOrder}
          className="flex items-center gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">Không</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Đồng ý</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Tôi sẽ gửi hàng trong 3 ngày (không bao gồm các ngày nghỉ lễ, Tết và những ngày đơn vị vận chuyển không làm việc)
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="status">Tình trạng</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status" className="w-1/3">
            <SelectValue placeholder="Chọn tình trạng" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">Cài đặt thời gian</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-1/3 text-left flex items-center justify-between px-3 py-2 border rounded-md shadow-sm text-sm"
            >
              {date ? format(date, 'dd/MM/yyyy') : <span className="text-muted-foreground">Chọn ngày</span>}
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <Label htmlFor="sku">SKU sản phẩm</Label>
        <Input
          id="sku"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="-"
          className='w-1/3'
        />
      </div>
    </div>
  );
}
