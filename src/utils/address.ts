type Ward = { code: string; name: string; level?: string };
type District = { code: string; name: string; wards: Ward[] };
type Province = { code: string; name: string; districts: District[] };
export function convertAddressFromBE(address: API.ResponseAddress, provincesData: Province[]) {
  const province = provincesData.find((p) => p.name === address.province);
  const district = province?.districts.find((d: District) => d.name === address.city);
  const ward = district?.wards.find((w: Ward) => w.code === address.postalCode);

  return {
    province: province ? { code: province.code, name: province.name } : null,
    district: district ? { code: district.code, name: district.name } : null,
    ward: ward ? { code: ward.code, name: ward.name } : null,
  };
}