"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

type Province = { name: string; code: number }
type District = { name: string; code: number }
type Ward = { name: string; code: number }

type Props = {
  onChange: (value: {
    province: Province | null
    district: District | null
    ward: Ward | null
  }) => void
}

export default function ProvinceSelect({ onChange }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [province, setProvince] = useState<Province | null>(null)
  const [district, setDistrict] = useState<District | null>(null)
  const [ward, setWard] = useState<Ward | null>(null)

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
  }, [])

  useEffect(() => {
    if (province) {
      fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts || []))
      setDistrict(null)
      setWard(null)
      setWards([])
    }
  }, [province])

  useEffect(() => {
    if (district) {
      fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []))
      setWard(null)
    }
  }, [district])

  useEffect(() => {
    onChange({ province, district, ward })
  }, [province, district, ward])

  return (
    <div className="space-y-4">
      <Select onValueChange={(value) => {
        const p = provinces.find((p) => p.code.toString() === value)
        setProvince(p ?? null)
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Tỉnh / Thành phố" />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((p) => (
            <SelectItem key={p.code} value={p.code.toString()}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={!province}
        onValueChange={(value) => {
          const d = districts.find((d) => d.code.toString() === value)
          setDistrict(d ?? null)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Quận / Huyện" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((d) => (
            <SelectItem key={d.code} value={d.code.toString()}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={!district}
        onValueChange={(value) => {
          const w = wards.find((w) => w.code.toString() === value)
          setWard(w ?? null)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Phường / Xã" />
        </SelectTrigger>
        <SelectContent>
          {wards.map((w) => (
            <SelectItem key={w.code} value={w.code.toString()}>
              {w.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
