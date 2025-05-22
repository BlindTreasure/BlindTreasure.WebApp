import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
  status: "Hiển thị" | "Ẩn";
  image: string;
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Sản phẩm</th>
            <th className="px-4 py-3 text-left">Giá</th>
            <th className="px-4 py-3 text-left">Kho</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3 flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <span className="font-medium text-gray-900">
                  {product.name}
                </span>
              </td>
              <td className="px-4 py-3">{product.price}</td>
              <td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    product.status === "Hiển thị"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button variant="outline" size="sm">
                  <Pencil size={16} className="mr-1" /> Sửa
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} className="mr-1" /> Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
