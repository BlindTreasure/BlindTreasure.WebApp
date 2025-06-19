import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type SimpleAddress = { name: string; code: string };
type Ward = SimpleAddress & { level?: string };
type District = SimpleAddress & { wards: Ward[] };
type Province = SimpleAddress & { districts: District[] };

type ProvinceSelectProps = {
  value?: {
    province: SimpleAddress | null;
    district: SimpleAddress | null;
    ward: SimpleAddress | null;
  };
  onChange: (value: {
    province: SimpleAddress | null;
    district: SimpleAddress | null;
    ward: SimpleAddress | null;
  }) => void;
  provincesData: Province[];
};

export default function ProvinceSelect({ value, onChange, provincesData }: ProvinceSelectProps) {
  const [internalValue, setInternalValue] = useState<{
    province: Province | null;
    district: District | null;
    ward: Ward | null;
  }>({
    province: null,
    district: null,
    ward: null,
  });

  useEffect(() => {
    if (value?.province && provincesData.length > 0) {
      const selectedProvince = provincesData.find(
        (p) => p.code === value.province?.code
      );
      setInternalValue((prev) => ({
        ...prev,
        province: selectedProvince || null,
        district: null,
        ward: null,
      }));
    }
    if (!value?.province) {
      setInternalValue({ province: null, district: null, ward: null });
    }
  }, [value?.province, provincesData]);

  useEffect(() => {
    if (internalValue.province && value?.district) {
      const selectedDistrict = internalValue.province.districts.find(
        (d) => d.code === value.district?.code
      );
      setInternalValue((prev) => ({
        ...prev,
        district: selectedDistrict || null,
        ward: null,
      }));
    }
    if (!value?.district) {
      setInternalValue((prev) => ({ ...prev, district: null, ward: null }));
    }
  }, [internalValue.province, value?.district]);

  useEffect(() => {
    if (internalValue.district && value?.ward) {
      const selectedWard = internalValue.district.wards.find(
        (w) => w.code === value.ward?.code
      );
      setInternalValue((prev) => ({
        ...prev,
        ward: selectedWard || null,
      }));
    }
    if (!value?.ward) {
      setInternalValue((prev) => ({ ...prev, ward: null }));
    }
  }, [internalValue.district, value?.ward]);

  const handleProvinceChange = (code: string) => {
    const province = provincesData.find((p) => p.code === code) || null;
    setInternalValue({
      province,
      district: null,
      ward: null,
    });
    onChange({
      province: province ? { name: province.name, code: province.code } : null,
      district: null,
      ward: null,
    });
  };

  const handleDistrictChange = (code: string) => {
    const district = internalValue.province?.districts.find((d) => d.code === code) || null;
    setInternalValue((prev) => ({
      ...prev,
      district,
      ward: null,
    }));
    onChange({
      province: internalValue.province
        ? { name: internalValue.province.name, code: internalValue.province.code }
        : null,
      district: district ? { name: district.name, code: district.code } : null,
      ward: null,
    });
  };

  const handleWardChange = (code: string) => {
    const ward = internalValue.district?.wards.find((w) => w.code === code) || null;
    setInternalValue((prev) => ({
      ...prev,
      ward,
    }));
    onChange({
      province: internalValue.province
        ? { name: internalValue.province.name, code: internalValue.province.code }
        : null,
      district: internalValue.district
        ? { name: internalValue.district.name, code: internalValue.district.code }
        : null,
      ward: ward ? { name: ward.name, code: ward.code } : null,
    });
  };

  return (
    <div className="space-y-4">
      <Select
        value={internalValue.province?.code || ""}
        onValueChange={handleProvinceChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tỉnh/Thành phố">
            {internalValue.province?.name || value?.province?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {provincesData.map((p) => (
            <SelectItem key={p.code} value={p.code}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={!internalValue.province}
        value={internalValue.district?.code || ""}
        onValueChange={handleDistrictChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Quận/Huyện">
            {internalValue.district?.name || value?.district?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(internalValue.province?.districts ?? []).map((d) => (
            <SelectItem key={d.code} value={d.code}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={!internalValue.district}
        value={internalValue.ward?.code || ""}
        onValueChange={handleWardChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Phường/Xã">
            {internalValue.ward?.name || value?.ward?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(internalValue.district?.wards ?? []).map((w) => (
            <SelectItem key={w.code} value={w.code}>
              {w.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}