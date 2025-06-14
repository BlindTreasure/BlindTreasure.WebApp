import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/cart-item/api-path";

export const getCartByCustomer = async (): Promise<
  TResponseData<API.ResponseDataCart>
> => {
  const response = await request<TResponseData<API.ResponseDataCart>>(
    API_ENDPOINTS.CART_ITEM,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const updateCartItemByCustomer = async (
  body: REQUEST.UpdateQuantityItemCart
): Promise<TResponseData<API.ResponseDataCart>> => {
  const response = await request<TResponseData<API.ResponseDataCart>>(
    API_ENDPOINTS.CART_ITEM,
    {
      method: "PUT",
      data: body,
    }
  );
  return response.data;
};

export const deleteCartItemByCustomer = async (cartItemId: string) => {
  const response = await request<TResponseData<API.ResponseDataCart>>(
    API_ENDPOINTS.DELETE_CART_ITEM(cartItemId),
    {
      method: "DELETE",
    }
  );
  return response.data;
};

export const addCartItemByCustomer = async (
  body: REQUEST.AddItemToCart
): Promise<TResponseData<API.ResponseDataCart>> => {
  const response = await request<TResponseData<API.ResponseDataCart>>(
    API_ENDPOINTS.CART_ITEM,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const deleteAllCartItemByCustomer = async () => {
  const response = await request<TResponseData<API.ResponseDataCart>>(
    API_ENDPOINTS.CLEAR_ALL_CART,
    {
      method: "DELETE",
    }
  );
  return response.data;
};
