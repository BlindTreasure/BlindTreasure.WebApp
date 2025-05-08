import { FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Ribbon from "../blindbox";

interface ProductCardProps {
  type: "new" | "sale" | "blindbox";
  percent?: number;
  image?: string;
  title: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  percent,
  image = "/images/cart.webp",
  title,
  price,
}) => {
  return (
    <div className="relative p-2 mt-12 transition-all duration-300 transform hover:scale-105">
      <Ribbon type={type} percent={percent} />
      <Card className="relative w-full rounded-xl overflow-hidden p-4 shadow-lg bg-white">
        <div className="w-full h-48 overflow-hidden rounded-md">
          <img
            src={image}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 text-sm">
          <p className="truncate font-semibold text-gray-800">{title}</p>
          <p className="text-red-600 font-bold text-lg">{price}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
            Thêm vào giỏ hàng
          </Button>
          <FaRegHeart className="text-2xl" />
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
