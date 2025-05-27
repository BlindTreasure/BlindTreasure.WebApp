import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SellerInfoFormProps {
  email: string;
}

export function SellerInfoForm({ email }: SellerInfoFormProps) {
  const [form, setForm] = useState({
    shopName: "",
    fullName: "",
    phone: "",
    coaUrl: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Gửi dữ liệu form đến backend
    console.log({ ...form, email });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="shopName">Tên Shop</Label>
        <Input
          id="shopName"
          value={form.shopName}
          onChange={(e) => handleChange("shopName", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="fullName">Họ tên</Label>
        <Input
          id="fullName"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="coa">Link giấy phép kinh doanh (COA)</Label>
        <Input
          id="coa"
          placeholder="https://..."
          value={form.coaUrl}
          onChange={(e) => handleChange("coaUrl", e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit}>Gửi thông tin</Button>
    </div>
  );
}
