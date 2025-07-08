import { useState, useEffect } from "react";
import { getProductById } from "@/services/product/api-services";
import { AllProduct } from "@/services/product/typings";
import { isTResponseData } from "@/utils/compare";

export default function useGetProductById(productId: string) {
  const [product, setProduct] = useState<AllProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getProductById(productId);
        
        if (isTResponseData(response) && response.value.data) {
          setProduct(response.value.data);
        } else {
          setError("Không thể tải thông tin sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Lỗi khi tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    isLoading,
    error,
  };
}
