import useGetDistricts from "@/app/(user)/address-list/hooks/useGetDistricts";
import useGetProvinces from "@/app/(user)/address-list/hooks/useGetProvinces";
import useGetWards from "@/app/(user)/address-list/hooks/useGetWards";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type SimpleAddress = { name: string; code: string };
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
};

export default function ProvinceSelect({ value, onChange }: ProvinceSelectProps) {
  const { getProvincesApi, provinces } = useGetProvinces();
  const { getDistrictsApi, districts } = useGetDistricts();
  const { getWardsApi, wards } = useGetWards();

  const [selectedProvince, setProvince] = useState<SimpleAddress | null>(null);
  const [selectedDistrict, setDistrict] = useState<SimpleAddress | null>(null);
  const [selectedWard, setWard] = useState<SimpleAddress | null>(null);

  useEffect(() => {
    getProvincesApi();
  }, []);

  useEffect(() => {
    if (value?.province) {
      const p = provinces.find(p => String(p.provinceID) === value.province?.code);
      if (p) {
        setProvince({ code: String(p.provinceID), name: p.provinceName });
        getDistrictsApi({ provinceId: p.provinceID });
      }
    }
  }, [value?.province, provinces]);

  useEffect(() => {
    if (value?.district && selectedProvince) {
      const d = districts.find(d => String(d.districtID) === value.district?.code);
      if (d) {
        setDistrict({ code: String(d.districtID), name: d.districtName });
        getWardsApi({ districtId: d.districtID });
      }
    }
  }, [value?.district, districts]);

  useEffect(() => {
    if (value?.ward && selectedDistrict) {
      const w = wards.find(w => String(w.wardCode) === value.ward?.code);
      if (w) setWard({ code: String(w.wardCode), name: w.wardName });
    }
  }, [value?.ward, wards]);

  const handleProvinceChange = (code: string) => {
    const p = provinces.find(p => String(p.provinceID) === code);
    const province = p ? { code, name: p.provinceName } : null;
    setProvince(province);
    setDistrict(null);
    setWard(null);
    if (p) getDistrictsApi({ provinceId: p.provinceID });
    onChange({ province, district: null, ward: null });
  };

  const handleDistrictChange = (code: string) => {
    const d = districts.find(d => String(d.districtID) === code);
    const district = d ? { code, name: d.districtName } : null;
    setDistrict(district);
    setWard(null);
    if (d) getWardsApi({ districtId: d.districtID });
    onChange({ province: selectedProvince, district, ward: null });
  };

  const handleWardChange = (code: string) => {
    const w = wards.find(w => String(w.wardCode) === code);
    const ward = w ? { code, name: w.wardName } : null;
    setWard(ward);
    onChange({ province: selectedProvince, district: selectedDistrict, ward });
  };

  return (
    <div className="space-y-4">
      <Select value={selectedProvince?.code || ""} onValueChange={handleProvinceChange}>
        <SelectTrigger>
          <SelectValue placeholder="Tỉnh/Thành phố" />
        </SelectTrigger>
        <SelectContent>
          {provinces.map(p => (
            <SelectItem key={p.provinceID} value={String(p.provinceID)}>
              {p.provinceName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedDistrict?.code || ""}
        onValueChange={handleDistrictChange}
        disabled={!selectedProvince}
      >
        <SelectTrigger>
          <SelectValue placeholder="Quận/Huyện" />
        </SelectTrigger>
        <SelectContent>
          {districts.map(d => (
            <SelectItem key={d.districtID} value={String(d.districtID)}>
              {d.districtName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedWard?.code || ""}
        onValueChange={handleWardChange}
        disabled={!selectedDistrict}
      >
        <SelectTrigger>
          <SelectValue placeholder="Phường/Xã" />
        </SelectTrigger>
        <SelectContent>
          {wards.map(w => (
            <SelectItem key={w.wardCode} value={String(w.wardCode)}>
              {w.wardName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
