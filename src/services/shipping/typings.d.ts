export type RequestDistricts = {
  provinceId: number;
};

export type RequestWards = {
  districtId: number;
};

export type ResponseProvinces = {
  provinceID: number;
  provinceName: string;
  nameExtension: string[];
};

export type ResponseDistricts = {
  districtID: number;
  provinceID: number;
  districtName: string;
  nameExtension: string[];
};

export type ResponseWards = {
  wardCode: number;
  districtID: number;
  wardName: string;
  nameExtension: string[];
};

