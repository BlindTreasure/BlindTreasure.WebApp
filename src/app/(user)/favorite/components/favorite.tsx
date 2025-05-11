'use client'
import ProductCard from "@/components/product-card";
import PaginationBar from "@/components/pagination";

interface Blindbox {
  id: number;
  type: "new" | "sale" | "blindbox";
  percent?: number;
  title: string;
  price: number;
}

export default function Favorite (){
    const blindboxes: Blindbox[] = [
    { id: 1, type: "sale", percent: 30, title: "Hello", price: 5420000 },
    { id: 2, type: "sale", percent: 50, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 3, type: "sale", percent: 40, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 4, type: "sale", percent: 10, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 5, type: "sale", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 12, type: "sale", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 6, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 7, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
  ];

    return(
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 mt-20">
            <h2 className="text-2xl font-semibold text-center mb-8">Sản Phẩm Yêu Thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {blindboxes.map((product) => (
                <ProductCard
                    key={product.id}
                    type={product.type}
                    percent={product.percent}
                    title={product.title}
                    price={product.price.toLocaleString() + "₫"}
                />
                ))}
            </div>
            <div className="mt-8">
                <PaginationBar />
            </div>
        </div>

    )
}